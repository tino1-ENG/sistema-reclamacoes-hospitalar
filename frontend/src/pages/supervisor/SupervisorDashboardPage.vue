<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-caption text-uppercase text-weight-bold text-secondary">
          QUALIDADE & SUPERVISÃO OPERACIONAL
        </div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mt-xs q-mb-none">
          Painel de Supervisão — HospitalCare
        </h1>
        <div class="text-body2 text-slate-500 q-mt-xs">
          Indicadores consolidados em tempo real do Hospital Central Piloto de Maputo.
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          unelevated
          color="secondary"
          icon="sync_alt"
          label="Reatribuir Casos"
          no-caps
          to="/supervisor/reatribuicao"
        />
        <q-btn
          outline
          color="secondary"
          icon="schedule"
          label="Prazos SLA"
          no-caps
          to="/supervisor/prazos"
        />
      </div>
    </div>

    <!-- Indicadores Principais -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Total de Casos"
          :value="metrics?.totalProcesses ?? 0"
          subtitle="Registados no sistema"
          icon="assessment"
          color-bg="blue-1"
          color-text="primary"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Em Triagem / Pendentes"
          :value="metrics?.pendingProcesses ?? 0"
          subtitle="Aguardam encaminhamento"
          icon="hourglass_top"
          color-bg="orange-1"
          color-text="orange-9"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Casos Fora de Prazo"
          :value="metrics?.overdueProcesses ?? 0"
          subtitle="Atraso de SLA detectado"
          icon="timer_off"
          color-bg="red-1"
          color-text="negative"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Taxa de Satisfação"
          :value="`${metrics?.satisfactionRatePercent ?? 0}%`"
          subtitle="Avaliação média dos utentes"
          icon="sentiment_very_satisfied"
          color-bg="green-1"
          color-text="positive"
        />
      </div>
    </div>

    <!-- Gráficos / Distribuições Operacionais -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Distribuição por Departamento -->
      <div class="col-12 col-md-6">
        <q-card class="hc-card q-pa-lg full-height">
          <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
            Distribuição por Departamento
          </div>
          <div class="text-caption text-slate-500 q-mb-md">
            Volume de manifestações recebidas por serviço hospitalar.
          </div>

          <div v-for="d in metrics?.distributionByDepartment" :key="d.department" class="q-mb-sm">
            <div class="row justify-between text-caption q-mb-xs">
              <span class="text-weight-medium text-slate-700">{{ d.department }}</span>
              <span class="text-weight-bold text-slate-800">{{ d.count }} casos</span>
            </div>
            <q-linear-progress
              :value="metrics?.totalProcesses ? d.count / metrics.totalProcesses : 0"
              color="secondary"
              rounded
              size="8px"
            />
          </div>
        </q-card>
      </div>

      <!-- Distribuição por Estado -->
      <div class="col-12 col-md-6">
        <q-card class="hc-card q-pa-lg full-height">
          <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
            Volume por Estado do Fluxo
          </div>
          <div class="text-caption text-slate-500 q-mb-md">
            Acompanhamento do progresso de tramitação.
          </div>

          <div v-for="s in metrics?.distributionByStatus" :key="s.status" class="q-mb-sm">
            <div class="row justify-between text-caption q-mb-xs">
              <span class="text-weight-medium text-slate-700">{{ s.status }}</span>
              <span class="text-weight-bold text-slate-800">{{ s.count }}</span>
            </div>
            <q-linear-progress
              :value="metrics?.totalProcesses ? s.count / metrics.totalProcesses : 0"
              color="accent"
              rounded
              size="8px"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardService } from '../../services';
import type { DashboardMetrics } from '../../types';
import StatCard from '../../components/common/StatCard.vue';

const metrics = ref<DashboardMetrics | null>(null);

onMounted(async () => {
  metrics.value = await dashboardService.getMetrics('SUPERVISOR');
});
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
