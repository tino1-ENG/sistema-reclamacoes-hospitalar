import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIChatSession, type IAIChatMessage } from '../models/AIChatSession.js';
import { Department } from '../models/Department.js';
import { scrubSensitiveData, scrubProcessPayload } from '../utils/data-scrubber.js';

export type AIProviderType = 'gemini' | 'local' | 'auto' | 'fallback';

export interface AIStatusResponse {
  configuredProvider: string;
  activeProvider: string;
  isLocalAvailable: boolean;
  isGeminiAvailable: boolean;
  localUrl: string;
  localModel: string;
  geminiModel: string;
}

export class AIService {
  private geminiClient: GoogleGenerativeAI | null = null;
  private localAiUrl: string;
  private localModel: string;
  private geminiModelName: string;
  private configuredProvider: string;

  constructor() {
    this.configuredProvider = process.env.AI_PROVIDER || 'auto';
    this.localAiUrl = process.env.LOCAL_AI_URL || 'http://localhost:11434';
    this.localModel = process.env.LOCAL_AI_MODEL || 'mistral';
    this.geminiModelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      this.geminiClient = new GoogleGenerativeAI(geminiApiKey);
    }
  }

  /**
   * Verifica a disponibilidade do motor de IA local (Ollama / LM Studio)
   */
  async isLocalAiReachable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`${this.localAiUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Determina dinamicamente o fornecedor activo ('local' ou 'gemini' ou 'fallback')
   */
  async getEffectiveProvider(): Promise<'local' | 'gemini' | 'fallback'> {
    if (this.configuredProvider === 'local') {
      const reachable = await this.isLocalAiReachable();
      return reachable ? 'local' : 'fallback';
    }

    if (this.configuredProvider === 'gemini') {
      return this.geminiClient ? 'gemini' : 'fallback';
    }

    // Modo 'auto': Se local estiver a correr na máquina do utilizador, prioriza local; senão usa Gemini; senão fallback
    const localOk = await this.isLocalAiReachable();
    if (localOk) return 'local';
    if (this.geminiClient) return 'gemini';
    return 'fallback';
  }

  /**
   * Consulta o estado dos motores de IA
   */
  async getStatus(): Promise<AIStatusResponse> {
    const isLocalAvailable = await this.isLocalAiReachable();
    const isGeminiAvailable = Boolean(this.geminiClient);
    const activeProvider = await this.getEffectiveProvider();

    return {
      configuredProvider: this.configuredProvider,
      activeProvider,
      isLocalAvailable,
      isGeminiAvailable,
      localUrl: this.localAiUrl,
      localModel: this.localModel,
      geminiModel: this.geminiModelName
    };
  }

  /**
   * Chamada genérica de completação textual (roteia entre Gemini e Ollama local)
   */
  private async generateCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    const provider = await this.getEffectiveProvider();

    if (provider === 'local') {
      try {
        const response = await fetch(`${this.localAiUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.localModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: scrubSensitiveData(userPrompt) }
            ],
            stream: false
          })
        });

        if (response.ok) {
          const data = (await response.json()) as { message?: { content?: string } };
          if (data.message?.content) {
            return data.message.content.trim();
          }
        }
      } catch (err) {
        console.warn('[AIService] Falha na IA Local, a tentar Gemini/Fallback:', err);
      }
    }

    if (provider === 'gemini' || this.geminiClient) {
      try {
        const model = this.geminiClient!.getGenerativeModel({
          model: this.geminiModelName,
          systemInstruction: systemPrompt
        });

        const result = await model.generateContent(scrubSensitiveData(userPrompt));
        const responseText = result.response.text();
        if (responseText) {
          return responseText.trim();
        }
      } catch (err) {
        console.warn('[AIService] Falha no Gemini API, a utilizar resposta inteligente de contingência:', err);
      }
    }

    return '';
  }

  /**
   * Assistente Virtual do Utente — "Acolhe HospitalCare"
   */
  async chatWithAssistant(
    sessionId: string,
    userMessage: string,
    userId?: string
  ): Promise<{ response: string; suggestedAction?: Record<string, unknown> }> {
    let session = await AIChatSession.findOne({ sessionId });
    if (!session) {
      session = new AIChatSession({
        sessionId,
        userId,
        messages: []
      });
    }

    // Grava mensagem do utilizador higienizada
    const cleanUserMsg = scrubSensitiveData(userMessage);
    session.messages.push({
      role: 'user',
      content: cleanUserMsg,
      timestamp: new Date()
    });

    const systemPrompt = `Você é o "Acolhe HospitalCare", o assistente virtual oficial de acolhimento e orientação ao utente do Hospital Central de Maputo (HCM) em Moçambique.
Seu papel:
1. Orientar utentes com empatia, respeito, dignidade e clareza em Português de Moçambique.
2. Auxiliar no registo e acompanhamento de Reclamações, Sugestões, Pedidos de Esclarecimento e Elogios.
3. Explicar como funciona o Código de Referência (#HC-...) e o PIN de 4 dígitos para acompanhar processos com total confidencialidade.
4. Identificar o departamento hospitalar correto entre: Urgência Geral, Pediatria, Maternidade & Obstetrícia, Consulta Externa, Farmácia Central, Cirurgia & Bloco Operatório.
5. Regras estritas de segurança: NUNCA dê diagnósticos médicos, prescrições de medicamentos ou orientações terapêuticas de emergência. Para emergências vitais, oriente sempre a dirigir-se imediatamente à Urgência Geral do HCM ou ligar para a Linha de Emergência (117 / +258 21 350 400).
6. Mantenha respostas curtas (máximo 3 parágrafos), acolhedoras e objectivas.`;

    // Constrói histórico contextual
    const lastHistory = session.messages
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'Utente' : 'Assistente'}: ${m.content}`)
      .join('\n');

    const prompt = `Histórico recente da conversa:\n${lastHistory}\n\nNova mensagem do utente: ${cleanUserMsg}\n\nResponda ao utente de forma empática e prestativa:`;

    let reply = await this.generateCompletion(systemPrompt, prompt);

    if (!reply) {
      // Resposta inteligente de contingência (baseada em palavras-chave)
      const lower = cleanUserMsg.toLowerCase();
      if (lower.includes('consultar') || lower.includes('acompanhar') || lower.includes('código') || lower.includes('pin')) {
        reply = 'Para consultar o estado do seu processo, aceda à secção **Consultar Processo** no menu principal. Irá necessitar do seu Código de Referência (ex: #HC-2026-XXXX) e do seu PIN de segurança de 4 dígitos.';
      } else if (lower.includes('reclam') || lower.includes('queixa') || lower.includes('mau atendimento')) {
        reply = 'Lamentamos profundamente a sua experiência menos positiva. O Hospital Central de Maputo está comprometido em corrigir falhas. Pode submeter uma **Reclamação** formal através do botão "Submeter Processo", indicando o departamento (ex: Urgência, Pediatria, Farmácia). Iremos investigar e responder com total transparência.';
      } else if (lower.includes('farmácia') || lower.includes('medicamento')) {
        reply = 'Para questões relacionadas com dispensa de medicamentos ou funcionamento da Farmácia Central do HCM, pode submeter uma manifestação selecionando o departamento **Farmácia Central**. A equipa de supervisão farmacêutica irá analisar a sua questão.';
      } else if (lower.includes('elogio') || lower.includes('agradec')) {
        reply = 'Ficamos muito gratos pelo seu reconhecimento! Os elogios aos nossos médicos, enfermeiros e equipas de apoio motivam todo o corpo clínico do HCM. Pode registar o seu Elogio formal no formulário de processos.';
      } else {
        reply = 'Olá! Sou o **Acolhe HospitalCare**, o assistente digital do Hospital Central de Maputo. Como posso ajudar? Posso orientá-lo a submeter uma reclamação, sugestão ou elogio, ou explicar como acompanhar o seu processo com o código e PIN.';
      }
    }

    session.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date()
    });

    await session.save();

    return { response: reply };
  }

  /**
   * Copiloto Staff — Resumir Processo Clínico / Administrativo
   */
  async summarizeProcess(processData: {
    referenceNumber: string;
    title: string;
    description: string;
    departmentName?: string;
    categoryName?: string;
    type: string;
  }): Promise<{ summary: string; keyPoints: string[]; urgencyReasoning: string }> {
    const scrubbed = scrubProcessPayload(processData);

    const systemPrompt = `Você é o Copiloto Analítico do HospitalCare para funcionários e supervisores do Hospital Central de Maputo.
Sua tarefa é analisar o relato de um utente e gerar um resumo executivo objetivo e estruturado em JSON.
Retorne rigorosamente um JSON válido no formato:
{
  "summary": "Resumo de 1 a 2 frases do cerne da ocorrência",
  "keyPoints": ["Ponto chave 1", "Ponto chave 2", "Ponto chave 3"],
  "urgencyReasoning": "Avaliação curta do impacto e prioridade sugerida"
}`;

    const userPrompt = `Processo ${processData.referenceNumber}:
Tipo: ${processData.type}
Departamento: ${processData.departmentName || 'Não especificado'}
Título: ${scrubbed.title}
Descrição: ${scrubbed.description}

Gere a análise em JSON:`;

    const raw = await this.generateCompletion(systemPrompt, userPrompt);

    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          summary: parsed.summary || 'Resumo processado.',
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ['Análise concluída.'],
          urgencyReasoning: parsed.urgencyReasoning || 'Prioridade avaliada com base nas normas do HCM.'
        };
      }
    } catch {
      // Ignora erro de JSON e usa fallback
    }

    // Fallback gracioso
    return {
      summary: `Processo ${processData.referenceNumber}: Relato de ${processData.type.toLowerCase()} registado para o serviço de ${processData.departmentName || 'Atendimento Geral'}.`,
      keyPoints: [
        `Assunto principal: ${scrubbed.title}`,
        'Manifestação documentada no sistema com SLA ativo',
        'Requer avaliação técnica pelo departamento responsável'
      ],
      urgencyReasoning: 'Triagem preliminar recomenda validação de impacto clínico e conformidade de atendimento.'
    };
  }

  /**
   * Copiloto Staff — Sugerir Minuta de Resposta Institucional
   */
  async suggestInstitutionalReply(processData: {
    referenceNumber: string;
    title: string;
    description: string;
    patientName?: string;
    departmentName?: string;
    type: string;
    staffNotes?: string;
  }): Promise<string> {
    const scrubbed = scrubProcessPayload(processData);

    const systemPrompt = `Você é o redator de comunicações institucionais do Hospital Central de Maputo (HCM).
Escreva uma proposta de parecer oficial / resposta formal ao utente.
Diretrizes:
- Tom formal, solene, empático e resolutivo.
- Focado na missão de saúde pública e no respeito aos direitos dos utentes em Moçambique.
- Se for reclamação: reconheça o impacto, informe as medidas de averiguação tomadas e peça desculpas institucionais se aplicável.
- Se for sugestão: agradeça a contribuição para a melhoria dos serviços do HCM.
- Se for elogio: expresse o apreço da direção e transmita à equipa elogiada.
- Não invente conclusões de auditorias não mencionadas nas notas.
- Termine com a saudação oficial: "Com os melhores cumprimentos, Direcção dos Serviços de Atendimento e Humanização — Hospital Central de Maputo".`;

    const userPrompt = `Dados do Processo:
Referência: ${processData.referenceNumber}
Tipo: ${processData.type}
Departamento: ${processData.departmentName || 'HCM'}
Assunto: ${scrubbed.title}
Descrição: ${scrubbed.description}
Notas do Funcionário: ${processData.staffNotes || 'Sem notas adicionais'}`;

    const reply = await this.generateCompletion(systemPrompt, userPrompt);
    if (reply) {
      return reply;
    }

    // Fallback de minuta padrão institucional
    return `Estimado(a) Utente,

Acusamos a recepção da sua manifestação referente ao processo ${processData.referenceNumber}, associada aos serviços de ${processData.departmentName || 'Atendimento Geral'}.

Informamos que a ocorrência exposta foi devidamente registada e remetida à coordenação responsável para as necessárias averiguações e implementação das medidas correctivas pertinentes, visando a melhoria contínua da assistência prestada aos nossos cidadãos.

Agradecemos o seu contributo cívico, fundamental para elevar os padrões de humanização e eficácia nos cuidados de saúde do Hospital Central de Maputo.

Com os melhores cumprimentos,
Direcção dos Serviços de Atendimento e Humanização
Hospital Central de Maputo`;
  }

  /**
   * Triagem Inteligente Automática
   */
  async triageProcess(
    title: string,
    description: string
  ): Promise<{
    suggestedDepartmentId?: string;
    suggestedDepartmentName?: string;
    suggestedPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    confidenceScore: number;
    rationale: string;
  }> {
    const departments = await Department.find({ isActive: true });
    const deptList = departments.map((d) => `${d._id}: ${d.name} (${d.code})`).join('\n');

    const cleanTitle = scrubSensitiveData(title);
    const cleanDesc = scrubSensitiveData(description);

    const systemPrompt = `Você é o classificador automático de triagem do Hospital Central de Maputo.
Departamentos disponíveis:
${deptList}

Analise o título e a descrição e classifique o processo retornando JSON estrito:
{
  "departmentId": "ID_DO_DEPARTAMENTO_ESCOLHIDO",
  "priority": "LOW" | "NORMAL" | "HIGH" | "URGENT",
  "confidenceScore": 0.85,
  "rationale": "Justificativa curta"
}`;

    const userPrompt = `Título: ${cleanTitle}\nDescrição: ${cleanDesc}`;
    const raw = await this.generateCompletion(systemPrompt, userPrompt);

    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const dept = departments.find((d) => d._id.toString() === parsed.departmentId);
        return {
          suggestedDepartmentId: dept ? dept._id.toString() : departments[0]?._id.toString(),
          suggestedDepartmentName: dept ? dept.name : departments[0]?.name,
          suggestedPriority: ['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(parsed.priority) ? parsed.priority : 'NORMAL',
          confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.8,
          rationale: parsed.rationale || 'Triagem automática realizada.'
        };
      }
    } catch {
      // Ignora erro e cai no fallback
    }

    // Triagem heurística de fallback
    const text = `${cleanTitle} ${cleanDesc}`.toLowerCase();
    let priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' = 'NORMAL';
    if (text.includes('morte') || text.includes('grave') || text.includes('urgente') || text.includes('sangramento') || text.includes('crítico')) {
      priority = 'URGENT';
    } else if (text.includes('dor') || text.includes('demora excessiva') || text.includes('falta de médico')) {
      priority = 'HIGH';
    } else if (text.includes('elogio') || text.includes('parabéns') || text.includes('sugestão')) {
      priority = 'LOW';
    }

    let matchedDept = departments[0];
    for (const d of departments) {
      if (text.includes(d.name.toLowerCase()) || text.includes(d.code.toLowerCase())) {
        matchedDept = d;
        break;
      }
    }

    return {
      suggestedDepartmentId: matchedDept?._id.toString(),
      suggestedDepartmentName: matchedDept?.name,
      suggestedPriority: priority,
      confidenceScore: 0.75,
      rationale: 'Classificação heurística baseada nos termos da ocorrência e regulamento de triagem do HCM.'
    };
  }
}

export const aiService = new AIService();
