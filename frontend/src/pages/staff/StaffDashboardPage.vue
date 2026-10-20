<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-caption text-uppercase text-weight-bold text-teal-8">
          SERVIÇO OPERACIONAL HOSPITALAR
        </div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mt-xs q-mb-none">
          Painel de Trabalho — {{ authStore.user?.fullName }}
        </h1>
        <div class="text-body2 text-slate-500 q-mt-xs">
          Acompanhamento de processos atribuídos e cumprimento de prazos de atendimento.
        </div>
      </div>

      <q-btn
        unelevated
        color="teal"
        icon="assignment"
        label="Ver Meus Processos"
        no-caps
        to="/funcionario/processos"
      />
    </div>

    <!-- Estatísticas Operacionais -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Processos Atribuídos"
          :value="assignedProcesses.length"
          icon="assignment_ind"
          color-bg="teal-1"
          color-text="teal"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Casos Urgentes"
          :value="urgentCount"
          icon="priority_high"
          color-bg="red-1"
          color-text="negative"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Em Análise"
          :value="inReviewCount"
          icon="pending_actions"
          color-bg="orange-1"
          color-text="orange-9"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Resolvidos / Fechados"
          :value="resolvedCount"
          icon="task_alt"
          color-bg="green-1"
          color-text="positive"
        />
      </div>
    </div>

    <!-- Fila Operacional Ativa -->
    <q-card class="hc-card">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-weight-bold text-slate-700">
          Fila de Atenção Imediata
        </div>
        <q-btn
          flat
          no-caps
          color="primary"
          label="Gestão Completa"
          icon-right="arrow_forward"
          to="/funcionario/processos"
        />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <LoadingState v-if="loading" />

        <EmptyState
          v-else-if="!assignedProcesses.length"
          title="Nenhum processo pendente"
          description="Excelente trabalho! Todos os processos que lhe foram atribuídos estão atualizados."
          icon="done_all"
        />

        <q-list v-else separator>
          <q-item
            v-for="proc in assignedProcesses"
            :key="proc.id"
            clickable
            v-ripple
            :to="`/funcionario/processos/${proc.id}`"
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-avatar size="40px" :color="proc.priority.code === 'HIGH' || proc.priority.code === 'URGENT' ? 'red-1' : 'blue-1'" :text-color="proc.priority.code === 'HIGH' || proc.priority.code === 'URGENT' ? 'negative' : 'primary'">
                <q-icon :name="proc.priority.code === 'HIGH' || proc.priority.code === 'URGENT' ? 'warning' : 'folder'" size="22px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="row items-center q-gutter-x-sm q-mb-xs">
                <span class="text-caption text-weight-bolder text-primary">
                  {{ proc.referenceCode }}
                </span>
                <span class="text-caption text-slate-400">•</span>
                <span class="text-caption text-weight-bold text-slate-700">
                  {{ proc.patientName }}
                </span>
                <span class="text-caption text-slate-400">•</span>
                <span class="text-caption text-slate-500">
                  {{ proc.category?.name }}
                </span>
              </div>
              <div class="text-subtitle2 text-weight-bold text-slate-800">
                {{ proc.subject }}
              </div>
              <div class="text-caption text-slate-500">
                Prazo de SLA: {{ formatDateTime(proc.slaDueAt) }}
              </div>
            </q-item-section>

            <q-item-section side class="text-right">
              <ProcessStatusBadge :status="proc.status.code" class="q-mb-xs" />
              <q-badge
                :color="proc.priority.code === 'HIGH' || proc.priority.code === 'URGENT' ? 'negative' : 'grey-7'"
                class="font-size-11"
              >
                Prioridade: {{ proc.priority.name }}
              </q-badge>
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
import type { Process } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard.vue';
import LoadingState from '../../components/common/LoadingState.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const authStore = useAuthStore();
const assignedProcesses = ref<Process[]>([]);
const loading = ref(true);

const urgentCount = computed(
  () => assignedProcesses.value.filter((p) => p.priority.code === 'HIGH' || p.priority.code === 'URGENT').length
);
const inReviewCount = computed(
  () => assignedProcesses.value.filter((p) => [3, 4, 5, 6].includes(p.statusId)).length
);
const resolvedCount = computed(
  () => assignedProcesses.value.filter((p) => [7, 8].includes(p.statusId)).length
);

onMounted(async () => {
  if (authStore.user) {
    try {
      assignedProcesses.value = await processService.getProcesses({
        assignedTo: authStore.user.id
      });
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
.font-size-11 { font-size: 11px; }
</style>
