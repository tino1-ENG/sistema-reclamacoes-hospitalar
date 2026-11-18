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

    <!-- Controlo do Modo de IA por Departamento (Chefe de Departamento / Supervisor) -->
    <q-card class="hc-card q-mb-lg border-primary bg-indigo-50">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="indigo-8" text-color="white" icon="psychology" size="42px" class="shadow-2" />
            <div>
              <div class="text-subtitle1 text-weight-bold text-slate-800 row items-center">
                <span>Modo de IA e Acolhimento Automático por Departamento</span>
                <q-badge
                  :color="isAiActive ? 'positive' : 'grey-6'"
                  text-color="white"
                  :label="isAiActive ? 'Modo IA Ativo' : 'Modo Manual'"
                  class="q-ml-sm"
                />
              </div>
              <div class="text-caption text-slate-600">
                Permita que a IA assuma o esclarecimento e a geração de respostas aos casos do departamento.
              </div>
            </div>
          </div>
          <div class="q-mt-sm">
            <q-toggle
              v-model="isAiActive"
              color="positive"
              label="Ativar Modo IA"
              left-label
              class="text-weight-bold"
              @update:model-value="toggleDepartmentAiMode"
            />
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-4">
            <label class="text-caption text-weight-bold block q-mb-xs">Departamento Sob Supervisão</label>
            <q-select
              v-model="selectedDeptId"
              :options="deptOptions"
              emit-value
              map-options
              outlined
              dense
              bg-color="white"
              @update:model-value="onDeptSelected"
            />
          </div>

          <div class="col-12 col-md-5">
            <label class="text-caption text-weight-bold block q-mb-xs">Diretriz Departamental da IA</label>
            <q-input
              v-model="aiGuidelines"
              outlined
              dense
              bg-color="white"
              placeholder="Ex: Priorizar triagem de Manchester e tempo de espera inferior a 15 min."
            />
          </div>

          <div class="col-12 col-md-3 text-right">
            <q-btn
              unelevated
              color="indigo-8"
              icon="save"
              label="Guardar Configuração"
              no-caps
              :loading="savingAi"
              @click="saveAiGuidelines"
              class="full-width"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

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
import { useQuasar } from 'quasar';

const $q = useQuasar();
const metrics = ref<DashboardMetrics | null>(null);

// Gestão do Modo IA do Departamento
interface DeptItem {
  id: string;
  name: string;
  code: string;
  isAiModeActive?: boolean;
  aiAutoResponseEnabled?: boolean;
  aiSpecialtyGuidelines?: string;
}

const deptOptions = ref<{ label: string; value: string }[]>([]);
const departmentsList = ref<DeptItem[]>([]);
const selectedDeptId = ref<string>('');
const isAiActive = ref(false);
const aiGuidelines = ref('');
const savingAi = ref(false);

onMounted(async () => {
  metrics.value = await dashboardService.getMetrics('SUPERVISOR');

  try {
    const { apiClient } = await import('../../services/api/api-client');
    const res = await apiClient.get('/departments');
    if (res.data?.success && Array.isArray(res.data.data)) {
      departmentsList.value = res.data.data.map((d: any) => ({
        id: d._id || d.id,
        name: d.name,
        code: d.code,
        isAiModeActive: d.isAiModeActive || false,
        aiAutoResponseEnabled: d.aiAutoResponseEnabled || false,
        aiSpecialtyGuidelines: d.aiSpecialtyGuidelines || ''
      }));

      deptOptions.value = departmentsList.value.map((d) => ({
        label: `${d.name} (${d.code})`,
        value: d.id
      }));

      if (departmentsList.value.length > 0) {
        selectedDeptId.value = departmentsList.value[0]?.id || '';
        onDeptSelected(selectedDeptId.value);
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar departamentos para modo IA:', err);
  }
});

function onDeptSelected(id: string) {
  const dept = departmentsList.value.find((d) => d.id === id);
  if (dept) {
    isAiActive.value = !!dept.isAiModeActive;
    aiGuidelines.value = dept.aiSpecialtyGuidelines || '';
  }
}

async function toggleDepartmentAiMode(val: boolean) {
  if (!selectedDeptId.value) return;
  savingAi.value = true;
  try {
    const { apiClient } = await import('../../services/api/api-client');
    await apiClient.patch(`/departments/${selectedDeptId.value}/ai-mode`, {
      isAiModeActive: val,
      aiAutoResponseEnabled: val
    });

    const dept = departmentsList.value.find((d) => d.id === selectedDeptId.value);
    if (dept) {
      dept.isAiModeActive = val;
      dept.aiAutoResponseEnabled = val;
    }

    $q.notify({
      type: val ? 'positive' : 'info',
      message: val
        ? 'Modo de IA Ativado! A IA responderá aos casos deste departamento.'
        : 'Modo de IA Desativado. Atendimento manual ativo.',
      position: 'top'
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Falha ao atualizar Modo de IA do departamento.',
      position: 'top'
    });
  } finally {
    savingAi.value = false;
  }
}

async function saveAiGuidelines() {
  if (!selectedDeptId.value) return;
  savingAi.value = true;
  try {
    const { apiClient } = await import('../../services/api/api-client');
    await apiClient.patch(`/departments/${selectedDeptId.value}/ai-mode`, {
      isAiModeActive: isAiActive.value,
      aiAutoResponseEnabled: isAiActive.value,
      aiSpecialtyGuidelines: aiGuidelines.value
    });

    $q.notify({
      type: 'positive',
      message: 'Diretrizes de IA do departamento gravadas com sucesso!',
      position: 'top'
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Falha ao gravar diretrizes de IA.',
      position: 'top'
    });
  } finally {
    savingAi.value = false;
  }
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
