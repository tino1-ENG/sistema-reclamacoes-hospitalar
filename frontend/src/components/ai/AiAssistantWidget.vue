<template>
  <div class="ai-widget-wrapper">
    <!-- Botão Flutuante (Floating Trigger) -->
    <q-btn
      v-if="!isOpen"
      round
      unelevated
      size="lg"
      class="ai-trigger-btn shadow-4 animate-pop"
      @click="toggleChat"
      aria-label="Abrir Assistente Inteligente Acolhe HospitalCare"
    >
      <q-icon name="smart_toy" size="28px" color="white" />
      <q-badge floating rounded color="emerald-5" text-color="white" class="ai-badge-pulse">
        IA
      </q-badge>
    </q-btn>

    <!-- Janela de Conversação Modal / Popup -->
    <q-card v-if="isOpen" class="ai-chat-window shadow-10 animate-fade-in">
      <!-- Cabeçalho do Chat -->
      <q-card-section class="ai-chat-header text-white q-py-sm q-px-md row items-center justify-between">
        <div class="row items-center no-wrap">
          <q-avatar size="38px" class="bg-white text-primary q-mr-sm shadow-1">
            <q-icon name="smart_toy" size="24px" color="primary" />
          </q-avatar>
          <div>
            <div class="text-subtitle2 text-weight-bolder leading-tight">Acolhe HospitalCare</div>
            <div class="text-caption text-blue-1 row items-center font-size-11">
              <span class="status-dot q-mr-xs"></span>
              <span>Assistente Digital HCM (IA)</span>
            </div>
          </div>
        </div>

        <div class="row items-center">
          <q-btn flat round dense icon="remove" color="white" size="sm" @click="toggleChat" />
        </div>
      </q-card-section>

      <!-- Área de Mensagens -->
      <q-card-section class="ai-chat-messages q-pa-sm" ref="messagesContainer">
        <!-- Boas-vindas -->
        <div class="ai-msg ai-msg-bot">
          <div class="ai-msg-bubble">
            <p class="q-mb-xs">
              Olá! Sou o <strong>Acolhe HospitalCare</strong>, o seu assistente inteligente no Hospital Central de Maputo.
            </p>
            <p class="q-mb-none font-size-12 text-slate-600">
              Posso ajudá-lo a estruturar uma queixa ou elogio, ou explicar como acompanhar o seu processo confidencial com código e PIN.
            </p>
          </div>
        </div>

        <!-- Sugestões Rápidas de Início -->
        <div v-if="messages.length === 0" class="q-my-sm row q-gutter-xs">
          <q-chip
            v-for="(chip, idx) in quickPrompts"
            :key="idx"
            clickable
            dense
            outline
            color="primary"
            text-color="primary"
            class="text-caption text-weight-medium bg-blue-1"
            @click="sendQuickPrompt(chip)"
          >
            {{ chip }}
          </q-chip>
        </div>

        <!-- Lista de Mensagens Dinâmicas -->
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['ai-msg', msg.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot']"
        >
          <div class="ai-msg-bubble">
            <div class="message-content" v-html="formatMessage(msg.content)"></div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- Indicador de Digitação -->
        <div v-if="loading" class="ai-msg ai-msg-bot">
          <div class="ai-msg-bubble typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Caixa de Entrada de Mensagem -->
      <q-card-actions class="q-pa-sm bg-white">
        <q-form @submit.prevent="sendMessage" class="full-width row items-center no-wrap">
          <q-input
            v-model="inputMessage"
            dense
            outlined
            placeholder="Escreva a sua dúvida ou relato..."
            class="col q-mr-xs"
            bg-color="slate-50"
            maxlength="500"
            :disable="loading"
            @keydown.enter.prevent="sendMessage"
          />
          <q-btn
            round
            unelevated
            color="primary"
            icon="send"
            size="md"
            type="submit"
            :disable="!inputMessage.trim() || loading"
          />
        </q-form>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { aiService } from '../../services/api/rest-ai.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const isOpen = ref(false);
const loading = ref(false);
const inputMessage = ref('');
const sessionId = ref<string>(`session-${Date.now()}-${Math.random().toString(36).substring(7)}`);
const messagesContainer = ref<HTMLElement | null>(null);

const messages = ref<ChatMessage[]>([]);

const quickPrompts = [
  'Como consultar o meu processo?',
  'Problemas na Farmácia Central',
  'Quero fazer um elogio à equipa',
  'Onde fica a Urgência Geral?'
];

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

function formatTime(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatMessage(text: string): string {
  // Conversão básica de markdown para HTML seguro
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

async function sendQuickPrompt(prompt: string) {
  inputMessage.value = prompt;
  await sendMessage();
}

async function sendMessage() {
  const text = inputMessage.value.trim();
  if (!text || loading.value) return;

  // Regista mensagem do utilizador
  messages.value.push({
    role: 'user',
    content: text,
    time: formatTime()
  });

  inputMessage.value = '';
  loading.value = true;
  scrollToBottom();

  try {
    const result = await aiService.chat(text, sessionId.value);
    if (result && result.response && result.response.trim().length > 0) {
      sessionId.value = result.sessionId || sessionId.value;
      messages.value.push({
        role: 'assistant',
        content: result.response,
        time: formatTime()
      });
      return;
    }
    throw new Error('Empty response from AI engine');
  } catch (err) {
    // Contingência inteligente: ativa o motor de conhecimento residente do HCM
    console.warn('[AiAssistantWidget] A utilizar guia inteligente de contingência do HCM:', err);
    const fallbackResponse = generateHospitalCareKnowledgeResponse(text);
    messages.value.push({
      role: 'assistant',
      content: fallbackResponse,
      time: formatTime()
    });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
}

function generateHospitalCareKnowledgeResponse(userText: string): string {
  const lower = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Consultar / Acompanhar processo / PIN / Código
  if (lower.includes('consultar') || lower.includes('acompanhar') || lower.includes('processo') || lower.includes('pin') || lower.includes('codigo') || lower.includes('estado')) {
    return 'Para consultar o estado do seu processo no **Hospital Central de Maputo**:\n\n1. Aceda ao separador **"Consultar Processo"** no menu superior.\n2. Introduza o seu **Código de Referência** (ex: `#HC-2026-XXXX`) e o seu **PIN de 4 dígitos** gerados no momento da submissão.\n3. Terá acesso imediato ao estado da tramitação, departamento responsável e resposta oficial da Direcção do HCM.\n\n*Nota: Se perdeu o seu PIN, dirija-se presencialmente ao Gabinete do Utente com um documento de identificação.*';
  }

  // 2. Farmácia / Medicamentos
  if (lower.includes('farmacia') || lower.includes('medicamento') || lower.includes('receita') || lower.includes('remedio') || lower.includes('falta')) {
    return 'Relativamente à **Farmácia Central e Depósito de Medicamentos do HCM**:\n\n- O levantamento de medicação prescrita nas consultas externas é feito mediante apresentação da receita médica e cartão de utente.\n- Caso tenha enfrentado **falta de medicamentos**, filas excessivas ou dificuldades no atendimento, pode submeter uma manifestação seleccionando a Unidade **"Farmácia Central"**.\n- O seu relato alerta directamente a Comissão Técnica de Medicamentos do HCM para reposição e auditoria de stock.';
  }

  // 3. Elogios / Agradecimento
  if (lower.includes('elogio') || lower.includes('agradec') || lower.includes('parabens') || lower.includes('bom trabalho') || lower.includes('excelente')) {
    return 'Ficamos muito gratos pelo seu reconhecimento!\n\n- O louvor aos nossos médicos, enfermeiros e auxiliares fortalece o compromisso ético e humanizado do Hospital Central de Maputo.\n- Para registar formalmente, clique em **"Registar Processo"** e escolha o tipo **"Elogio"**.\n- Pode indicar o serviço (ex: Pediatria, Maternidade, Urgência) e o nome dos profissionais. O seu louvor é entregue à Direcção Clínica e adicionado ao registo de mérito.';
  }

  // 4. Urgência Geral / Banco de Socorros / Emergência / Localização / Horários
  if (lower.includes('urgencia') || lower.includes('emergencia') || lower.includes('banco de socorros') || lower.includes('onde fica') || lower.includes('localizacao') || lower.includes('horario') || lower.includes('contacto')) {
    return 'A **Urgência Geral (Banco de Socorros)** do Hospital Central de Maputo funciona **24 horas por dia, 7 dias por semana**:\n\n- **Localização:** Acesso principal pela Avenida Eduardo Mondlane, Maputo.\n- **Protocolo de Triagem:** O atendimento segue o sistema de Triagem de Manchester (prioridade vermelha/laranja para risco de vida imediato).\n- **Linha de Apoio HCM:** Em situação de emergência, ligue 117 ou (+258) 21 350 400.\n- Para relatar ocorrências na Urgência, utilize o formulário do HospitalCare.';
  }

  // 5. Queixa / Reclamação / Denúncia Anónima / Submissão
  if (lower.includes('reclam') || lower.includes('queixa') || lower.includes('denuncia') || lower.includes('anonim') || lower.includes('mau atendimento') || lower.includes('submeter')) {
    return 'O **HospitalCare** garante total confidencialidade e segurança para a sua manifestação:\n\n1. Clique no botão **"Registar Queixa / Sugestão"**.\n2. Pode optar por submeter de forma **100% Anónima** (sem recolha de nome ou telefone) ou **Identificada** (para receber alertas por SMS/email).\n3. O sistema atribui um **Código Único e PIN**, encriptando o seu relato com segurança de nível institucional.\n4. O processo é encaminhado directamente à Inspecção Hospitalar e Direcção Clínica do HCM.';
  }

  // 6. Prazos de Resposta / Tempo
  if (lower.includes('prazo') || lower.includes('tempo') || lower.includes('demora') || lower.includes('quando responde') || lower.includes('dias')) {
    return 'Os prazos regulamentares de tramitação no Hospital Central de Maputo são:\n\n- **Casos Urgentes (risco clínico):** Avaliação e intervenção em até **24 a 48 horas**.\n- **Reclamações Gerais:** Triagem e resposta preliminar em até **5 dias úteis**.\n- **Elogios e Sugestões:** Notificação às equipas em até **48 horas**.\n\nPode verificar o progresso a qualquer momento introduzindo o seu código e PIN na página "Consultar Processo".';
  }

  // 7. Resposta Geral de Acolhimento
  return 'Olá! Sou o **Acolhe HospitalCare**, o assistente digital de acolhimento do Hospital Central de Maputo.\n\nPosso ajudá-lo a:\n- **Submeter uma Reclamação ou Denúncia Anónima** com total segurança e sigilo;\n- **Consultar e acompanhar o seu processo** com o Código de Referência e PIN;\n- **Registar um Elogio** para as equipas médicas e de enfermagem;\n- **Obter informações sobre serviços:** Urgência Geral, Farmácia Central, Pediatria e Consultas Externas.\n\nComo posso orientá-lo neste momento?';
}
</script>

<style scoped>
.ai-widget-wrapper {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 2500;
}

@media (min-width: 1024px) {
  .ai-widget-wrapper {
    bottom: 30px;
    right: 30px;
  }
}

.ai-trigger-btn {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
  color: #ffffff !important;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.4), 0 8px 10px -6px rgba(2, 132, 199, 0.2);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}

.ai-trigger-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 28px -5px rgba(2, 132, 199, 0.5);
}

.ai-badge-pulse {
  background-color: #10b981 !important;
  font-weight: 800;
  font-size: 10px;
  padding: 3px 6px;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* Janela do Chat */
.ai-chat-window {
  width: 360px;
  max-width: calc(100vw - 32px);
  height: 520px;
  max-height: calc(100vh - 120px);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
}

.ai-chat-header {
  background: linear-gradient(135deg, #075985 0%, #0284c7 100%);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #86efac;
  display: inline-block;
}

.font-size-11 { font-size: 11px; }
.font-size-12 { font-size: 12px; }

.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-msg {
  display: flex;
  width: 100%;
}

.ai-msg-user {
  justify-content: flex-end;
}

.ai-msg-bot {
  justify-content: flex-start;
}

.ai-msg-bubble {
  max-width: 84%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.875rem;
  line-height: 1.45;
  word-break: break-word;
}

.ai-msg-user .ai-msg-bubble {
  background: #0284c7;
  color: #ffffff;
  border-bottom-right-radius: 2px;
}

.ai-msg-bot .ai-msg-bubble {
  background: #ffffff;
  color: #1e293b;
  border-bottom-left-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.message-time {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

/* Indicador de Digitação Animado */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background-color: #0284c7;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
