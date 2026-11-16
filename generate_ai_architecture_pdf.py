import os
import sys
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#075985"))

        # Cabeçalho superior
        self.drawString(54, 800, "HospitalCare — Roteiro de Uso da IA & Arquitetura Local/Híbrida")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(541, 800, "Hospital Central de Maputo (HCM)")

        # Linha divisória do cabeçalho
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 792, 541, 792)

        # Rodapé inferior
        self.line(54, 50, 541, 50)
        self.drawString(54, 38, "HospitalCare IA • Soberania de Dados e Inteligência Hospitalar • Oficial")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(541, 38, page_text)

        self.restoreState()


def build_ai_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0284C7'),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#075985'),
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3.5
    )

    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white,
        alignment=0
    )

    tb_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.HexColor('#1E293B'),
        alignment=0
    )

    tb_code = ParagraphStyle(
        'TableCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.8,
        leading=10,
        textColor=colors.HexColor('#0F172A'),
        alignment=0
    )

    story = []

    # =========================================================================
    # BANNER E CABEÇALHO DO DOCUMENTO
    # =========================================================================
    banner_data = [[
        Paragraph("<font color='white'><b>REPÚBLICA DE MOÇAMBIQUE • MINISTÉRIO DA SAÚDE • HOSPITAL CENTRAL DE MAPUTO</b></font>", 
                  ParagraphStyle('Banner', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white, alignment=1))
    ]]
    banner_table = Table(banner_data, colWidths=[487], rowHeights=[22])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#075985')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("HospitalCare — Inteligência Artificial Hospitalar", title_style))
    story.append(Paragraph("Roteiro de Esclarecimento de Ocorrências, Natureza Local/Híbrida e Arquitetura Técnica", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceBefore=0, spaceAfter=8))

    # Tabela resumo de status da IA
    summary_box_data = [
        [
            Paragraph("<b>Tipo de IA:</b> Local (On-Premises) com Fallback Híbrido", tb_style),
            Paragraph("<b>Modelo Local Ativo:</b> Ollama <code>qwen3.5:latest</code> (9.7B - 6.6 GB)", tb_style)
        ],
        [
            Paragraph("<b>Privacidade de Dados:</b> Higienização Prévia (Data Scrubber)", tb_style),
            Paragraph("<b>Serviço Local:</b> <code>http://localhost:11434</code> (Porta Ollama)", tb_code)
        ],
        [
            Paragraph("<b>IA em Nuvem (Backup):</b> Google Gemini 1.5 Flash", tb_style),
            Paragraph("<b>Motor Residente Offline:</b> Guia do HCM no Frontend (0 ms)", tb_style)
        ]
    ]
    summary_box = Table(summary_box_data, colWidths=[240, 247])
    summary_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0284C7')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(summary_box)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECÇÃO 1: A IA É LOCAL OU NÃO? (RESPOSTA DIRETA E DETALHADA)
    # =========================================================================
    story.append(Paragraph("1. A Inteligência Artificial é Local ou Não? (Esclarecimento Definitivo)", h1_style))
    story.append(Paragraph(
        "<b>SIM, a Inteligência Artificial do HospitalCare é concebida e configurada prioritariamente como uma IA LOCAL (On-Premises).</b>",
        ParagraphStyle('Highlight', parent=body_style, fontName='Helvetica-Bold', fontSize=9.5, leading=13.5, textColor=colors.HexColor('#075985'))
    ))
    story.append(Paragraph(
        "No ambiente operacional do Hospital Central de Maputo, toda a inferência dos modelos de linguagem natural corre dentro do próprio "
        "servidor ou intranet hospitalar através do <b>Ollama</b>, utilizando o modelo de pesos abertos <b>Qwen 3.5 (9.7B parâmetros)</b>. "
        "Isto significa que:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Soberania e Sigilo Médico:</b> Os relatos dos pacientes, descrições de queixas e detalhes de saúde <b>NUNCA saem do hospital nem são enviados para servidores no estrangeiro</b>.<br/>"
        "• <b>Independência de Conexão à Internet:</b> A IA local continua a processar triagens, resumos e orientações mesmo que ocorra uma quebra total no link internacional de fibra ótica.<br/>"
        "• <b>Arquitetura Híbrida Inteligente:</b> Em situações onde o sistema for implantado em servidores sem placa gráfica dedicada (ex: instância gratuita de teste no Render) ou quando o modelo local demorar mais de 12 segundos a carregar na memória, o sistema possui contingência automática para a API do <b>Google Gemini 1.5 Flash</b> ou para o motor de conhecimento residente do HCM.",
        bullet_style
    ))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECÇÃO 2: O QUE FOI USADO PARA A SUA IMPLEMENTAÇÃO
    # =========================================================================
    story.append(Paragraph("2. O Que Foi Usado para a Implementação da IA", h1_style))
    story.append(Paragraph(
        "A pilha de engenharia de IA do HospitalCare foi estruturada com componentes de ponta em código aberto e padrões de segurança médica:",
        body_style
    ))

    tech_table_data = [
        [Paragraph("Componente", th_style), Paragraph("Tecnologia / Versão", th_style), Paragraph("Função na Implementação", th_style)],
        [
            Paragraph("<b>Motor Local</b>", tb_style),
            Paragraph("Ollama v0.40+ (C++/Go)", tb_code),
            Paragraph("Runtime nativo de alta eficiência para execução local de modelos GGUF quantizados (Q4_K_M) em Windows e Linux.", tb_style)
        ],
        [
            Paragraph("<b>Modelo de Linguagem</b>", tb_style),
            Paragraph("<code>qwen3.5:latest</code> (9.7B)", tb_code),
            Paragraph("Modelo com 6.6 GB de memória, treinado em instruções em Português, raciocínio lógico e síntese de relatórios.", tb_style)
        ],
        [
            Paragraph("<b>Serviço Backend</b>", tb_style),
            Paragraph("<code>AIService</code> (Node.js/TS)", tb_code),
            Paragraph("Orquestrador assíncrono em <code>backend/src/services/ai.service.ts</code> com gestão de timeouts de 12s, abort controllers e roteamento dinâmico.", tb_style)
        ],
        [
            Paragraph("<b>Higienizador de Dados</b>", tb_style),
            Paragraph("<code>data-scrubber.ts</code>", tb_code),
            Paragraph("Módulo de anonimização médica que substitui BIs, NUITs, telefones e nomes por identificadores anónimos antes do LLM.", tb_style)
        ],
        [
            Paragraph("<b>IA em Nuvem (Backup)</b>", tb_style),
            Paragraph("<code>@google/generative-ai</code>", tb_code),
            Paragraph("SDK oficial da Google para chamadas ao Gemini 1.5 Flash quando ativado o modo elástico de contingência em nuvem.", tb_style)
        ],
        [
            Paragraph("<b>Persistência de Sessão</b>", tb_style),
            Paragraph("Mongoose / MongoDB", tb_code),
            Paragraph("Coleção <code>AIChatSession</code> que armazena mensagens higienizadas, histórico de contexto e carimbos de tempo.", tb_style)
        ],
        [
            Paragraph("<b>Motor Residente Offline</b>", tb_style),
            Paragraph("<code>AiAssistantWidget.vue</code>", tb_code),
            Paragraph("Base de conhecimento institucional embutida no frontend Quasar. Responde instantaneamente (0 ms) mesmo se o servidor estiver a despertar.", tb_style)
        ]
    ]

    tech_table = Table(tech_table_data, colWidths=[100, 120, 267])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#075985')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECÇÃO 3: ROTEIRO PRÁTICO - COMO USAR A IA PARA ESCLARECER OCORRÊNCIAS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("3. Roteiro Passo a Passo: Como Usar a IA para Esclarecer uma Ocorrência", h1_style))
    story.append(Paragraph(
        "A inteligência artificial opera em três papéis distintos: <b>para o Utente</b> (Acolhe HospitalCare), <b>para o Funcionário</b> (Copiloto IA) "
        "e <b>para a Supervisão</b> (Triagem Automática e SLA).",
        body_style
    ))

    # CENÁRIO 1: O UTENTE / CIDADÃO
    story.append(Paragraph("3.1 Roteiro do Cidadão / Utente — Esclarecimento de Ocorrências", h2_style))
    citizen_steps = [
        [Paragraph("<b>Passo</b>", th_style), Paragraph("Ação Realizada pelo Utente", th_style), Paragraph("Comportamento e Resposta da IA", th_style)],
        [
            Paragraph("<b>Passo 1</b><br/>Abrir Assistente", tb_style),
            Paragraph("No portal do cidadão (em qualquer página), clica no botão circular azul flutuante com o ícone de robô e o selo <code>IA</code>.", tb_style),
            Paragraph("Abre a janela do <b>Acolhe HospitalCare</b> com sugestões rápidas e mensagem de acolhimento personalizada.", tb_style)
        ],
        [
            Paragraph("<b>Passo 2</b><br/>Consultar Ocorrência com Código e PIN", tb_style),
            Paragraph("O cidadão digita uma dúvida: <i>«Submeti uma queixa com código #HC-2026-0012 e quero saber como acompanhar o meu processo?»</i>", tb_style),
            Paragraph("A IA instrui imediatamente: aceder ao menu <b>Consultar Processo</b>, inserir o Código e o PIN de 4 dígitos para ver despachos em tempo real.", tb_style)
        ],
        [
            Paragraph("<b>Passo 3</b><br/>Esclarecimento sobre a Farmácia", tb_style),
            Paragraph("Digita: <i>«A Farmácia Central não tinha o medicamento da receita. O que devo fazer?»</i>", tb_style),
            Paragraph("A IA orienta: explica que deve registar no formulário com departamento 'Farmácia Central' para auditoria imediata de stock e contacto.", tb_style)
        ],
        [
            Paragraph("<b>Passo 4</b><br/>Esclarecimento sobre Prazos", tb_style),
            Paragraph("Digita: <i>«Quanto tempo demora para me responderem?»</i>", tb_style),
            Paragraph("A IA informa os prazos regulamentares: <b>Casos Urgentes: até 24h a 48h</b>; <b>Casos Normais: até 5 dias úteis</b>.", tb_style)
        ]
    ]
    citizen_table = Table(citizen_steps, colWidths=[70, 190, 227])
    citizen_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0284C7')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(citizen_table)
    story.append(Spacer(1, 10))

    # CENÁRIO 2: O FUNCIONÁRIO / MÉDICO TRIADOR
    story.append(Paragraph("3.2 Roteiro do Funcionário Hospitalar — Síntese e Minutas com Copiloto IA", h2_style))
    story.append(Paragraph(
        "Quando um funcionário do HCM precisa de analisar uma ocorrência longa ou complexa apresentada por um cidadão:",
        body_style
    ))
    staff_steps = [
        [Paragraph("<b>Etapa</b>", th_style), Paragraph("Ação no Painel do Funcionário", th_style), Paragraph("Apoio Prestado pelo Copiloto IA", th_style)],
        [
            Paragraph("<b>1. Selecionar Ocorrência</b>", tb_style),
            Paragraph("O médico ou enfermeiro acede a <b>Processos Atribuídos</b> e clica no caso (ex: <code>#HC-2026-0045</code>).", tb_style),
            Paragraph("O sistema carrega os dados completos, histórico de tramitação e anexo enviado pelo cidadão.", tb_style)
        ],
        [
            Paragraph("<b>2. Resumir com IA</b>", tb_style),
            Paragraph("No painel lateral direito 'Copiloto Inteligente HCM', clica no botão <b>[Resumir com IA]</b>.", tb_style),
            Paragraph("A IA local analisa a ocorrência e sintetiza em 2 segundos: <b>Resumo em 2 frases</b>, <b>3 Pontos-Chave</b> e a <b>Avaliação de Risco Clínico</b>.", tb_style)
        ],
        [
            Paragraph("<b>3. Sugerir Parecer / Minuta</b>", tb_style),
            Paragraph("No campo de resposta, clica em <b>[Sugerir Resposta]</b>.", tb_style),
            Paragraph("O modelo redige automaticamente uma minuta institucional humanizada e educada, pronta para o profissional editar e assinar.", tb_style)
        ],
        [
            Paragraph("<b>4. Despacho e Envio</b>", tb_style),
            Paragraph("O funcionário valida a resposta e clica em <b>Enviar Resposta Oficial</b>.", tb_style),
            Paragraph("A resposta é gravada, o processo transita para 'Respondido' e o cidadão já pode consultar com o seu PIN.", tb_style)
        ]
    ]
    staff_table = Table(staff_steps, colWidths=[80, 180, 227])
    staff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#075985')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(staff_table)
    story.append(Spacer(1, 10))

    # CENÁRIO 3: SUPERVISÃO E TRIAGEM AUTOMÁTICA
    story.append(Paragraph("3.3 Roteiro de Triagem Automática (Manchester e Departamentos)", h2_style))
    story.append(Paragraph(
        "No momento em que o formulário é submetido, o endpoint <code>/api/ai/triage</code> classifica a gravidade:<br/>"
        "• <b>Prioridade URGENTE (Vermelho):</b> Ocorrências com termos como <i>sangramento ativo, risco de vida, convulsão, falta de oxigénio</i> — SLA de 12 a 24 horas.<br/>"
        "• <b>Prioridade ALTA (Laranja):</b> Falta de medicação crónica, dor intensa, demora grave na triagem — SLA de 24 horas.<br/>"
        "• <b>Prioridade NORMAL (Amarelo):</b> Atendimento geral, higiene de enfermaria, dúvidas administrativas — SLA de 48 a 72 horas.<br/>"
        "• <b>Prioridade BAIXA (Verde):</b> Elogios à equipa médica ou sugestões de fluxo — SLA de 96 horas.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECÇÃO 4: VERIFICAÇÃO TÉCNICA E COMANDOS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("4. Como Testar e Verificar a IA Local no Servidor", h1_style))
    story.append(Paragraph(
        "Para verificar o estado do motor de IA local no terminal do servidor ou no VS Code:",
        body_style
    ))

    cmd_box_data = [
        [Paragraph("<b>Comandos de Diagnóstico e Verificação do Motor de IA:</b>", tb_style)],
        [Paragraph(
            "<b>1. Verificar se o Ollama está ativo e listar modelos instalados:</b><br/>"
            "<code>ollama list</code><br/>"
            "<i>(Deve listar: qwen3.5:latest - 6.6 GB - completion vision tools thinking)</i><br/><br/>"
            "<b>2. Testar resposta direta do modelo local no terminal:</b><br/>"
            "<code>ollama run qwen3.5:latest \"Explique em 2 frases como funciona o acolhimento do HCM.\"</code><br/><br/>"
            "<b>3. Consultar o endpoint de status da API HospitalCare:</b><br/>"
            "<code>curl http://localhost:5000/api/ai/status</code><br/>"
            "<i>Resposta esperada em JSON:</i><br/>"
            "<code>{\"success\": true, \"data\": {\"configuredProvider\": \"local\", \"activeProvider\": \"local\", \"isLocalAvailable\": true, \"localModel\": \"qwen3.5:latest\"}}</code><br/><br/>"
            "<b>4. Testar o Chatbot de IA via API HTTP (PowerShell ou Bash):</b><br/>"
            "<code>curl -X POST http://localhost:5000/api/ai/chat -H \"Content-Type: application/json\" -d '{\"message\": \"Como consultar o meu processo?\"}'</code>",
            tb_code
        )]
    ]
    cmd_box = Table(cmd_box_data, colWidths=[487])
    cmd_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#075985')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cmd_box)
    story.append(Spacer(1, 14))

    # =========================================================================
    # CONCLUSÃO E GARANTIAS
    # =========================================================================
    story.append(KeepTogether([
        Paragraph("5. Garantias Institucionais de Ética e Segurança da IA", h1_style),
        Paragraph(
            "1. <b>Sem Diagnósticos Médicos Autônomos:</b> A IA do HospitalCare é estritamente programada com diretrizes que impedem prescrições terapêuticas ou diagnósticos clínicos; para emergências vitais, orienta sempre a entrada no Banco de Socorros do HCM ou ligação para o 117.<br/>"
            "2. <b>Supervisão Humana Obrigatória (Human-in-the-Loop):</b> Nenhuma resposta de esclarecimento formal a um utente é expedida pela IA sem prévia validação, edição ou aprovação de um profissional humano.<br/>"
            "3. <b>Auditoria Completa:</b> Todas as sessões de chat e sugestões automáticas são rastreadas com identificador de sessão para controle de qualidade pelo Gabinete do Utente.",
            body_style
        ),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=8, spaceAfter=8),
        Paragraph(
            "<font color='#64748B'><b>HospitalCare HCM • Documentação Técnica de Inteligência Artificial • Maputo, Moçambique • 2026</b></font>",
            ParagraphStyle('FooterNotice', fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor('#64748B'), alignment=1)
        )
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] PDF da IA gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    out_pdf = "Roteiro_e_Arquitetura_IA_HospitalCare.pdf"
    build_ai_pdf(out_pdf)
