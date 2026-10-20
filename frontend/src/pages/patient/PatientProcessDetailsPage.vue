<template>
  <q-page class="q-pa-lg max-w-5xl q-mx-auto">
    <div v-if="loading" class="q-py-xl">
      <LoadingState message="A carregar processo e histórico..." />
    </div>

    <div v-else-if="!process">
      <EmptyState
        title="Processo Não Encontrado"
        description="O processo solicitado não existe ou não tem autorização para visualizá-lo."
        action-label="Voltar aos Meus Processos"
        action-icon="arrow_back"
        @action="$router.push('/paciente/processos')"
      />
    </div>

    <div v-else>
      <!-- Cabeçalho e Referência -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center">
          <q-btn flat round dense icon="arrow_back" color="slate-600" to="/paciente/processos" class="q-mr-sm" />
          <div>
            <div class="row items-center q-gutter-x-sm">
              <span class="text-h5 text-weight-bolder text-primary">
                {{ process.referenceCode }}
              </span>
              <ProcessStatusBadge :status="process.status.code" />
            </div>
            <div class="text-caption text-slate-500 q-mt-xs">
              {{ process.processType.name }} • {{ process.category?.name }}
            </div>
          </div>
        </div>

        <!-- Ação de Avaliação se Concluído -->
        <div v-if="process.status.code === 'CLOSED' || process.status.code === 'ANSWERED'">
          <q-btn
            unelevated
            color="amber-9"
            icon="star"
            label="Avaliar Atendimento"
            no-caps
            :to="`/paciente/processos/${process.id}/avaliacao`"
          />
        </div>
      </div>

      <!-- Detalhes do Caso -->
      <div class="row q-col-gutter-lg q-mb-lg">
        <!-- Coluna Principal: Assunto, Descrição, Mensagens -->
        <div class="col-12 col-md-8">
          <q-card class="hc-card q-pa-lg q-mb-lg">
            <h2 class="text-h6 text-weight-bold text-slate-800 q-mb-sm">
              {{ process.subject }}
            </h2>
            <div class="text-caption text-slate-400 q-mb-md">
              Submetido a {{ formatDateTime(process.createdAt) }}
              <span v-if="process.incidentDate"> • Data do incidente: {{ formatDate(process.incidentDate) }}</span>
            </div>

            <p class="text-body1 text-slate-700 leading-relaxed q-mb-md">
              {{ process.description }}
            </p>

            <div v-if="attachments.length" class="q-mt-md q-pt-md border-t">
              <div class="text-caption text-weight-bold text-slate-600 q-mb-xs">
                Documentos Anexados:
              </div>
              <div class="row q-gutter-sm">
                <q-chip
                  v-for="att in attachments"
                  :key="att.id"
                  icon="attach_file"
                  color="blue-1"
                  text-color="primary"
                  clickable
                >
                  {{ att.originalFilename }} ({{ Math.round(att.sizeBytes / 1024) }} KB)
                </q-chip>
              </div>
            </div>
          </q-card>

          <!-- Conversação Oficial e Mensagens -->
          <q-card class="hc-card q-pa-lg">
            <div class="text-h6 text-weight-bold text-slate-800 q-mb-sm">
              Comunicação com o Hospital
            </div>
            <div class="text-caption text-slate-500 q-mb-lg">
              Registo de mensagens oficiais entre si e a equipa técnica hospitalar.
            </div>

            <!-- Fio de Mensagens -->
            <div v-if="!messages.length" class="text-center text-slate-400 q-py-md text-caption">
              Ainda não existem mensagens neste processo.
            </div>

            <q-chat-message
              v-for="msg in messages"
              :key="msg.id"
              :name="msg.authorName"
              :stamp="formatDateTime(msg.createdAt)"
              :sent="msg.authorRole === 'PATIENT'"
              :bg-color="msg.authorRole === 'PATIENT' ? 'blue-1' : 'green-1'"
              :text-color="msg.authorRole === 'PATIENT' ? 'primary' : 'accent'"
            >
              <div>{{ msg.body }}</div>
            </q-chat-message>

            <!-- Formulário para envio de resposta pelo paciente -->
            <div class="q-mt-lg q-pt-md border-t">
              <div class="text-caption text-weight-bold text-slate-600 q-mb-xs">
                Enviar Mensagem / Esclarecimento Adicional:
              </div>
              <q-input
                v-model="newMessageBody"
                type="textarea"
                rows="3"
                placeholder="Escreva a sua mensagem para a equipa hospitalar..."
                outlined
                dense
                class="q-mb-sm"
              />
              <div class="row justify-end">
                <q-btn
                  unelevated
                  color="primary"
                  icon="send"
                  label="Enviar Mensagem"
                  no-caps
                  :loading="sendingMessage"
                  :disable="!newMessageBody.trim()"
                  @click="handleSendMessage"
                />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Coluna Lateral: Linha Temporal e Dados do Hospital -->
        <div class="col-12 col-md-4">
          <!-- Linha Temporal do Processo -->
          <q-card class="hc-card q-pa-lg q-mb-lg">
            <div class="text-subtitle1 text-weight-bold text-slate-800 q-mb-md">
              Linha Temporal do Processo
            </div>

            <q-timeline color="primary" dense>
              <q-timeline-entry
                v-for="entry in history"
                :key="entry.id"
                :title="entry.toStatusName"
                :subtitle="formatDateTime(entry.createdAt)"
                icon="check"
              >
                <div v-if="entry.reason" class="text-caption text-slate-600">
                  {{ entry.reason }}
                </div>
              </q-timeline-entry>
            </q-timeline>
          </q-card>

          <!-- Dados do Hospital e Departamento -->
          <q-card class="hc-card q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-slate-800 q-mb-sm">
              Serviço Responsável
            </div>
            <div class="text-body2 text-weight-bold text-primary">
              {{ process.department?.name || 'Gabinete de Atendimento Geral' }}
            </div>
            <div class="text-caption text-slate-500 q-mt-xs">
              Hospital Central de Maputo
            </div>
            <q-separator class="q-my-md" />
            <div class="text-caption text-slate-500">
              Prazo previsto de resposta:
            </div>
            <div class="text-body2 text-weight-bold text-slate-700">
              {{ formatDateTime(process.slaDueAt) || 'Em triagem' }}
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { processService } from '../../services';
import type {
  Process,
  ProcessMessage,
  ProcessStatusHistory,
  ProcessAttachment
} from '../../types';
import { formatDateTime, formatDate } from '../../utils/formatters';
import LoadingState from '../../components/common/LoadingState.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

const process = ref<Process | null>(null);
const messages = ref<ProcessMessage[]>([]);
const history = ref<ProcessStatusHistory[]>([]);
const attachments = ref<ProcessAttachment[]>([]);
const loading = ref(true);

const newMessageBody = ref('');
const sendingMessage = ref(false);

const processId = route.params.id as string;

onMounted(async () => {
  await loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const [procRes, msgRes, histRes, attRes] = await Promise.all([
      processService.getProcessById(processId),
      processService.getMessages(processId, 'PATIENT'),
      processService.getStatusHistory(processId),
      processService.getAttachments(processId)
    ]);
    process.value = procRes;
    messages.value = msgRes;
    history.value = histRes;
    attachments.value = attRes;
  } finally {
    loading.value = false;
  }
}

async function handleSendMessage() {
  if (!newMessageBody.value.trim() || !authStore.user) return;
  sendingMessage.value = true;
  try {
    const newMsg = await processService.addMessage(
      processId,
      {
        body: newMessageBody.value,
        messageType: 'PATIENT_MESSAGE',
        isVisibleToPatient: true
      },
      authStore.user.id
    );
    messages.value.push(newMsg);
    newMessageBody.value = '';
    $q.notify({
      type: 'positive',
      message: 'Mensagem enviada à equipa hospitalar com sucesso!'
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Erro ao enviar mensagem'
    });
  } finally {
    sendingMessage.value = false;
  }
}
</script>

<style scoped>
.max-w-5xl { max-width: 1050px; }
.leading-relaxed { line-height: 1.65; }
.border-t { border-top: 1px solid #e2e8f0; }
</style>
