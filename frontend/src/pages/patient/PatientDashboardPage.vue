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
