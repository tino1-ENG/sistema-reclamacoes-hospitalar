<template>
  <q-page class="q-pa-lg max-w-5xl q-mx-auto">
    <div v-if="loading" class="q-py-xl">
      <LoadingState message="A carregar processo operacional..." />
    </div>

    <div v-else-if="!process">
      <EmptyState
        title="Processo Não Encontrado"
        description="O processo solicitado não existe ou não está atribuído à sua área."
        action-label="Voltar à Fila"
        action-icon="arrow_back"
        @action="$router.push('/funcionario/processos')"
      />
    </div>

    <div v-else>
      <!-- Cabeçalho -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center">
          <q-btn flat round dense icon="arrow_back" color="slate-600" to="/funcionario/processos" class="q-mr-sm" />
          <div>
            <div class="row items-center q-gutter-x-sm">
              <span class="text-h5 text-weight-bolder text-primary">
                {{ process.referenceCode }}
              </span>
              <ProcessStatusBadge :status="process.status.code" />
              <q-badge
                :color="process.priority.code === 'HIGH' || process.priority.code === 'URGENT' ? 'negative' : 'grey-7'"
              >
                {{ process.priority.name }}
              </q-badge>
            </div>
            <div class="text-caption text-slate-500 q-mt-xs">
              Utente: <strong class="text-slate-800">{{ process.patientName }}</strong> ({{ process.patientPhone }})
            </div>
          </div>
        </div>

        <!-- Botão para Atualização de Estado -->
        <q-btn
          unelevated
          color="primary"
          icon="edit"
          label="Alterar Estado"
          no-caps
          @click="showStatusModal = true"
        />
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Coluna Principal -->
        <div class="col-12 col-md-8">
          <!-- Detalhes da Manifestação -->
          <q-card class="hc-card q-pa-lg q-mb-lg">
            <div class="row justify-between items-start q-mb-sm">
              <h2 class="text-h6 text-weight-bold text-slate-800 q-mb-none">
                {{ process.subject }}
              </h2>
              <span class="text-caption text-slate-500">
                {{ formatDate(process.createdAt) }}
              </span>
            </div>
            <div class="text-caption text-primary text-weight-bold q-mb-md">
              {{ process.processType.name }} • {{ process.category?.name }}
            </div>

            <p class="text-body1 text-slate-700 leading-relaxed q-mb-md">
              {{ process.description }}
            </p>

            <div v-if="attachments.length" class="q-mt-md q-pt-md border-t">
              <div class="text-caption text-weight-bold text-slate-600 q-mb-xs">
                Anexos Submetidos pelo Paciente:
              </div>
              <div class="row q-gutter-sm">
                <q-chip
                  v-for="att in attachments"
                  :key="att.id"
                  icon="attach_file"
                  color="blue-grey-1"
                  text-color="secondary"
                  clickable
                >
                  {{ att.originalFilename }} ({{ Math.round(att.sizeBytes / 1024) }} KB)
                </q-chip>
              </div>
            </div>
          </q-card>

          <!-- Conversação e Notas Internas -->
          <q-card class="hc-card q-pa-lg">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6 text-weight-bold text-slate-800">
                Histórico de Mensagens & Notas
              </div>
              <q-badge color="grey-3" text-color="grey-9" class="q-pa-xs">
                <q-icon name="visibility" size="14px" class="q-mr-xs" />
                Notas internas visíveis apenas para colaboradores
              </q-badge>
            </div>

            <!-- Lista de Mensagens -->
            <div v-for="msg in messages" :key="msg.id" class="q-mb-md">
              <!-- Nota Interna Confidencial -->
              <div v-if="msg.messageType === 'INTERNAL_NOTE'" class="q-pa-md bg-amber-1 rounded-borders border-amber-3">
                <div class="row items-center justify-between text-caption text-amber-9 text-weight-bold q-mb-xs">
                  <span class="row items-center">
                    <q-icon name="lock" size="16px" class="q-mr-xs" />
                    NOTA INTERNA CONFIDENCIAL — {{ msg.authorName }}
                  </span>
                  <span>{{ formatDateTime(msg.createdAt) }}</span>
                </div>
                <div class="text-body2 text-slate-800">{{ msg.body }}</div>
              </div>

              <!-- Mensagem Pública / Paciente -->
              <q-chat-message
                v-else
                :name="msg.authorName + (msg.authorRole === 'PATIENT' ? ' (Utente)' : ' (Hospital)')"
                :stamp="formatDateTime(msg.createdAt)"
                :sent="msg.authorRole !== 'PATIENT'"
                :bg-color="msg.authorRole === 'PATIENT' ? 'blue-1' : 'green-1'"
                :text-color="msg.authorRole === 'PATIENT' ? 'primary' : 'accent'"
              >
                <div>{{ msg.body }}</div>
              </q-chat-message>
            </div>

            <!-- Envio de Mensagem ou Nota -->
            <div class="q-mt-lg q-pt-md border-t">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-caption text-weight-bold text-slate-700">Registar Comunicação:</span>
                <q-btn-toggle
                  v-model="isInternalNote"
                  no-caps
                  dense
                  rounded
                  unelevated
                  toggle-color="primary"
                  color="grey-3"
                  text-color="grey-8"
                  :options="[
                    { label: 'Resposta Oficial ao Paciente', value: false },
                    { label: 'Nota Interna (Confidencial)', value: true }
                  ]"
                />
              </div>

              <div v-if="isInternalNote" class="text-caption text-amber-9 q-mb-xs">
                <q-icon name="lock" /> Esta nota NÃO será visualizada pelo paciente. Ficará restrita à equipa hospitalar.
              </div>
              <div v-else class="text-caption text-accent q-mb-xs">
                <q-icon name="public" /> Esta resposta será visualizada diretamente pelo utente no portal.
              </div>

              <q-input
                v-model="newMessageText"
                type="textarea"
                rows="3"
                :placeholder="isInternalNote ? 'Escreva uma nota técnica ou observação para a equipa...' : 'Escreva a resposta formal que será transmitida ao paciente...'"
                outlined
                dense
                class="q-mb-sm"
              />

              <div class="row justify-end">
                <q-btn
                  unelevated
                  :color="isInternalNote ? 'amber-9' : 'primary'"
                  :icon="isInternalNote ? 'lock' : 'send'"
                  :label="isInternalNote ? 'Registar Nota Interna' : 'Enviar Resposta ao Paciente'"
                  no-caps
                  :loading="submittingMessage"
                  :disable="!newMessageText.trim()"
                  @click="handleSendMessage"
                />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Coluna Lateral -->
        <div class="col-12 col-md-4">
          <!-- Gestão de SLA -->
          <q-card class="hc-card q-pa-lg q-mb-lg">
            <div class="text-subtitle1 text-weight-bold text-slate-800 q-mb-sm">
              Prazo e Conformidade
            </div>
            <div class="text-caption text-slate-500">Data Limite de SLA:</div>
            <div class="text-body1 text-weight-bolder text-slate-800 q-mb-sm">
              {{ formatDateTime(process.slaDueAt) }}
            </div>
            <div class="text-caption text-slate-500">Departamento:</div>
            <div class="text-body2 text-weight-bold text-primary">
              {{ process.department?.name }}
            </div>
          </q-card>

          <!-- Histórico de Transições -->
          <q-card class="hc-card q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-slate-800 q-mb-md">
              Histórico Operacional
            </div>
            <q-timeline color="primary" dense>
              <q-timeline-entry
                v-for="entry in history"
                :key="entry.id"
                :title="entry.toStatusName"
                :subtitle="formatDateTime(entry.createdAt)"
                icon="check"
              >
                <div class="text-caption text-slate-500">Por: {{ entry.changerName }}</div>
                <div v-if="entry.reason" class="text-caption text-slate-600 q-mt-xs">
                  {{ entry.reason }}
                </div>
              </q-timeline-entry>
            </q-timeline>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Modal para Alterar Estado -->
    <q-dialog v-model="showStatusModal">
      <q-card class="hc-card q-pa-lg" style="min-width: 420px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-sm">
          Alterar Estado do Processo
        </div>
        <div class="text-caption text-slate-500 q-mb-md">
          Selecione o novo estado operacional e justifique a transição.
        </div>

        <q-form @submit.prevent="handleUpdateStatus">
          <q-select
            v-model="newStatusId"
            :options="statusOptions"
            label="Novo Estado *"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-md"
            :rules="[(v) => !!v || 'Selecione um estado']"
          />

          <q-input
            v-model="statusReason"
            label="Justificação / Parecer *"
            type="textarea"
            rows="3"
            outlined
            dense
            class="q-mb-lg"
            :rules="[(v) => !!v || 'A justificação é obrigatória para o histórico']"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              no-caps
              label="Confirmar Transição"
              color="primary"
              type="submit"
              :loading="updatingStatus"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { categoryService, processService } from '../../services';
import type {
  Process,
  ProcessMessage,
  ProcessStatusHistory,
  ProcessAttachment,
  ProcessStatus
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
const statuses = ref<ProcessStatus[]>([]);
const loading = ref(true);

const isInternalNote = ref(false);
const newMessageText = ref('');
const submittingMessage = ref(false);

const showStatusModal = ref(false);
const newStatusId = ref<number | null>(null);
const statusReason = ref('');
const updatingStatus = ref(false);

const processId = route.params.id as string;

onMounted(async () => {
  await loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const [procRes, msgRes, histRes, attRes, statRes] = await Promise.all([
      processService.getProcessById(processId),
      // Role 'STAFF' acede tanto às respostas públicas como às notas internas
      processService.getMessages(processId, 'STAFF'),
      processService.getStatusHistory(processId),
      processService.getAttachments(processId),
      categoryService.getStatuses()
    ]);
    process.value = procRes;
    messages.value = msgRes;
    history.value = histRes;
    attachments.value = attRes;
    statuses.value = statRes;
    if (procRes) newStatusId.value = procRes.statusId;
  } finally {
    loading.value = false;
  }
}

const statusOptions = computed(() =>
  statuses.value.map((s) => ({ label: s.name, value: s.id }))
);

async function handleSendMessage() {
  if (!newMessageText.value.trim() || !authStore.user) return;
  submittingMessage.value = true;
  try {
    const msg = await processService.addMessage(
      processId,
      {
        body: newMessageText.value,
        messageType: isInternalNote.value ? 'INTERNAL_NOTE' : 'PUBLIC_REPLY',
        isVisibleToPatient: !isInternalNote.value
      },
      authStore.user.id
    );
    messages.value.push(msg);
    newMessageText.value = '';
    $q.notify({
      type: 'positive',
      message: isInternalNote.value ? 'Nota interna registada com sucesso!' : 'Resposta oficial enviada ao utente!'
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Falha ao registar mensagem'
    });
  } finally {
    submittingMessage.value = false;
  }
}

async function handleUpdateStatus() {
  if (!newStatusId.value || !statusReason.value.trim() || !authStore.user) return;
  updatingStatus.value = true;
  try {
    const updated = await processService.updateStatus(
      processId,
      newStatusId.value,
      statusReason.value,
      authStore.user.id
    );
    process.value = updated;
    history.value = await processService.getStatusHistory(processId);
    showStatusModal.value = false;
    statusReason.value = '';
    $q.notify({
      type: 'positive',
      message: 'Estado do processo atualizado com sucesso!'
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Falha ao atualizar estado'
    });
  } finally {
    updatingStatus.value = false;
  }
}
</script>

<style scoped>
.max-w-5xl { max-width: 1050px; }
.leading-relaxed { line-height: 1.65; }
.border-t { border-top: 1px solid #e2e8f0; }
.border-amber-3 { border: 1px solid #fcd34d; }
</style>
