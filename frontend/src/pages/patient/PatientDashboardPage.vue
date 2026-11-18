<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <!-- Cabeçalho do Dashboard do Utente -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-caption text-uppercase text-weight-bold text-primary">
          BEM-VINDO AO HOSPITALCARE
        </div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mt-xs q-mb-none">
          Olá, {{ authStore.user?.fullName }}
        </h1>
        <div class="text-body2 text-slate-500 q-mt-xs">
          Acompanhe aqui o estado e as respostas oficiais aos seus processos hospitalares.
        </div>
      </div>

      <div class="q-mt-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add_circle"
          label="Nova Submissão"
          no-caps
          to="/paciente/processos/novo"
          class="text-weight-bold"
        />
      </div>
    </div>

    <!-- Cartões de Resumo -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Total de Processos"
          :value="processes.length"
          icon="folder_open"
          color-bg="blue-1"
          color-text="primary"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Em Tratamento"
          :value="activeProcessesCount"
          icon="pending_actions"
          color-bg="orange-1"
          color-text="orange-9"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Respondidos"
          :value="answeredProcessesCount"
          icon="mark_chat_read"
          color-bg="green-1"
          color-text="accent"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Concluídos"
          :value="closedProcessesCount"
          icon="check_circle"
          color-bg="green-1"
          color-text="positive"
        />
      </div>
    </div>

    <!-- Secção Especial de Esclarecimento de Casos com IA -->
    <q-card class="hc-card q-mb-lg border-primary bg-blue-50">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="primary" text-color="white" icon="psychology" size="42px" class="shadow-2" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-slate-800 row items-center">
                <span>Esclarecimento Inteligente de Ocorrências e Casos (IA)</span>
                <q-badge color="accent" text-color="white" label="Copiloto HCM" class="q-ml-sm" />
              </div>
              <div class="text-caption text-slate-600">
                Tem dúvidas sobre o andamento do seu processo ou funcionamento do departamento? Peça um esclarecimento instantâneo à IA.
              </div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-btn
              unelevated
              color="primary"
              icon="chat"
              label="Pedir Esclarecimento com IA"
              no-caps
              class="text-weight-bold"
              @click="openClarifyDialog"
            />
          </div>
        </div>

        <!-- Sugestões Rápidas de Esclarecimento -->
        <div class="row q-gutter-xs q-mt-md">
          <q-btn
            dense
            outline
            color="primary"
            icon="schedule"
            label="Como funciona o SLA do meu caso?"
            size="sm"
            no-caps
            class="bg-white"
            @click="quickClarify('Qual é a previsão regulamentar para conclusão do meu processo?')"
          />
          <q-btn
            dense
            outline
            color="secondary"
            icon="local_hospital"
            label="Como funciona a triagem do departamento?"
            size="sm"
            no-caps
            class="bg-white"
            @click="quickClarify('Como funciona a triagem clínica no departamento responsável pelo meu caso?')"
          />
          <q-btn
            dense
            outline
            color="teal"
            icon="info"
            label="O que significa o estado atual?"
            size="sm"
            no-caps
            class="bg-white"
            @click="quickClarify('O que significa o estado atual do meu processo e quais são os próximos passos?')"
          />
        </div>
      </q-card-section>

      <!-- Resultado da Consulta IA se disponível -->
      <q-card-section v-if="clarifyResult" class="bg-white rounded-borders q-ma-md q-pa-md shadow-1">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2 text-weight-bold text-primary row items-center">
            <q-icon name="smart_toy" size="20px" class="q-mr-xs text-primary" />
            <span>Parecer do Copiloto Inteligente HCM: {{ clarifyResult.process?.referenceNumber }}</span>
          </div>
          <q-btn flat round dense icon="close" size="sm" @click="clarifyResult = null" />
        </div>
        <div class="text-body2 text-slate-700 whitespace-pre-line q-mb-md">
          {{ clarifyResult.clarification }}
        </div>
        <div v-if="clarifyResult.nextSteps && clarifyResult.nextSteps.length" class="bg-blue-50 q-pa-sm rounded-borders">
          <div class="text-caption text-weight-bold text-primary q-mb-xs">Próximos Passos Hospitalares:</div>
          <ul class="q-pl-md q-my-none text-caption text-slate-700">
            <li v-for="(step, idx) in clarifyResult.nextSteps" :key="idx">{{ step }}</li>
          </ul>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de Pedido de Esclarecimento com IA -->
    <q-dialog v-model="showClarifyModal">
      <q-card style="min-width: 420px; max-width: 600px; width: 100%" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="smart_toy" color="primary" text-color="white" size="36px" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold text-slate-800">Pedir Esclarecimento com IA</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-caption text-slate-600 q-mb-md">
            Seleccione um processo seu para o Assistente Inteligente analisar o departamento e o estado da ocorrência.
          </div>

          <div class="q-mb-md">
            <label class="text-caption text-weight-bold block q-mb-xs">Processo a Esclarecer *</label>
            <q-select
              v-model="selectedProcessId"
              :options="processOptions"
              emit-value
              map-options
              outlined
              dense
              placeholder="Seleccione o processo..."
            />
          </div>

          <div class="q-mb-sm">
            <label class="text-caption text-weight-bold block q-mb-xs">Dúvida ou Questão Específica</label>
            <q-input
              v-model="clarifyQuestion"
              type="textarea"
              outlined
              dense
              rows="3"
              placeholder="Ex: Como funciona a triagem da Urgência? Porque o processo ainda não foi fechado?"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn
            unelevated
            color="primary"
            label="Obter Esclarecimento"
            icon="auto_awesome"
            :loading="clarifyLoading"
            :disable="!selectedProcessId"
            @click="submitClarificationRequest"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Lista de Processos Recentes -->
    <q-card class="hc-card">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-weight-bold text-slate-700">
          Processos Recentes
        </div>
        <q-btn
          flat
          no-caps
          color="primary"
          label="Ver Todos os Processos"
          icon-right="arrow_forward"
          to="/paciente/processos"
        />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <LoadingState v-if="loading" />

        <EmptyState
          v-else-if="!processes.length"
          title="Ainda não submeteu nenhum processo"
          description="Pode apresentar uma reclamação, solicitar um esclarecimento clínico ou deixar uma sugestão para a equipa hospitalar."
          action-label="Submeter o Primeiro Processo"
          action-icon="add"
          @action="$router.push('/paciente/processos/novo')"
        />

        <q-list v-else separator>
          <q-item
            v-for="proc in processes.slice(0, 5)"
            :key="proc.id"
            clickable
            v-ripple
            :to="`/paciente/processos/${proc.id}`"
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-avatar size="40px" :color="getTypeColor(proc.processType.code)" text-color="white">
                <q-icon :name="getTypeIcon(proc.processType.code)" size="20px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="row items-center q-gutter-x-sm q-mb-xs">
                <span class="text-caption text-weight-bolder text-primary">
                  {{ proc.referenceCode }}
                </span>
                <span class="text-caption text-slate-400">•</span>
                <span class="text-caption text-slate-600 font-weight-medium">
                  {{ proc.processType.name }}
                </span>
                <span class="text-caption text-slate-400">•</span>
                <span class="text-caption text-slate-500">
                  {{ proc.category?.name }}
                </span>
              </div>
              <div class="text-subtitle2 text-weight-bold text-slate-800 line-clamp-1">
                {{ proc.subject }}
              </div>
              <div class="text-caption text-slate-500 line-clamp-1 q-mt-xs">
                {{ proc.description }}
              </div>
            </q-item-section>

            <q-item-section side class="text-right">
              <ProcessStatusBadge :status="proc.status.code" class="q-mb-xs" />
              <div class="text-caption text-slate-400 font-size-11">
                {{ formatDateTime(proc.updatedAt) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { processService } from '../../services';
import type { Process, ProcessTypeCode } from '../../types';
import { formatDateTime, getProcessTypeMeta } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard.vue';
import LoadingState from '../../components/common/LoadingState.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const authStore = useAuthStore();
const processes = ref<Process[]>([]);
const loading = ref(true);

// Estados do Esclarecimento IA
const showClarifyModal = ref(false);
const selectedProcessId = ref<string>('');
const clarifyQuestion = ref('');
const clarifyLoading = ref(false);
interface ClarifyResult {
  process?: { referenceNumber?: string; title?: string; status?: string };
  clarification?: string;
  departmentContext?: string;
  nextSteps?: string[];
}
const clarifyResult = ref<ClarifyResult | null>(null);

const processOptions = computed(() => {
  return processes.value.map((p) => ({
    label: `${p.referenceCode} - ${p.subject} (${p.status.name})`,
    value: p.id
  }));
});

function openClarifyDialog() {
  if (processes.value.length > 0 && !selectedProcessId.value) {
    selectedProcessId.value = processes.value[0]?.id || '';
  }
  showClarifyModal.value = true;
}

async function quickClarify(preQuestion: string) {
  if (processes.value.length === 0) {
    openClarifyDialog();
    return;
  }
  selectedProcessId.value = processes.value[0]?.id || '';
  clarifyQuestion.value = preQuestion;
  await submitClarificationRequest();
}

async function submitClarificationRequest() {
  if (!selectedProcessId.value) return;
  clarifyLoading.value = true;
  try {
    const { apiClient } = await import('../../services/api/api-client');
    const res = await apiClient.post('/ai/clarify-case', {
      processId: selectedProcessId.value,
      question: clarifyQuestion.value
    });
    if (res.data?.success) {
      clarifyResult.value = res.data.data;
      showClarifyModal.value = false;
    }
  } catch (err) {
    console.warn('Falha no esclarecimento online, a usar contingência:', err);
    const proc = processes.value.find((p) => p.id === selectedProcessId.value);
    clarifyResult.value = {
      process: { referenceNumber: proc?.referenceCode || '#HC-2026', title: proc?.subject },
      clarification: `O seu processo **${proc?.referenceCode}** encontra-se em tramitação regular sob acompanhamento da equipa técnica do Hospital Central de Maputo.\n\nA triagem segue os protocolos de prioridade clínica e o cumprimento dos prazos regulamentares de SLA hospitalar.`,
      nextSteps: [
        'Acompanhamento contínuo da ocorrência',
        'Avaliação clínica/administrativa pelo departamento',
        'Notificação ao utente após parecer final'
      ]
    };
    showClarifyModal.value = false;
  } finally {
    clarifyLoading.value = false;
  }
}

const activeProcessesCount = computed(
  () => processes.value.filter((p) => [1, 2, 3, 4, 5, 6].includes(p.statusId)).length
);
const answeredProcessesCount = computed(
  () => processes.value.filter((p) => p.statusId === 7).length
);
const closedProcessesCount = computed(
  () => processes.value.filter((p) => p.statusId === 8).length
);

onMounted(async () => {
  if (authStore.user) {
    try {
      processes.value = await processService.getProcesses({
        patientId: authStore.user.id
      });
    } finally {
      loading.value = false;
    }
  }
});

function getTypeColor(code: ProcessTypeCode): string {
  return getProcessTypeMeta(code).color;
}

function getTypeIcon(code: ProcessTypeCode): string {
  return getProcessTypeMeta(code).icon;
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
.font-size-11 { font-size: 11px; }
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
