<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Distribuição & Reatribuição de Casos
        </h1>
        <div class="text-body2 text-slate-500">
          Encaminhe processos para departamentos ou transfira casos entre colaboradores autorizados.
        </div>
      </div>
    </div>

    <!-- Tabela de Casos para Reatribuição -->
    <q-card class="hc-card">
      <q-table
        :rows="processes"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-referenceCode="props">
          <q-td :props="props">
            <span class="text-weight-bold text-secondary">
              {{ props.row.referenceCode }}
            </span>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <ProcessStatusBadge :status="props.row.status.code" />
          </q-td>
        </template>

        <template #body-cell-assignedTo="props">
          <q-td :props="props">
            <span v-if="props.row.assignedStaffName" class="text-weight-medium text-slate-800">
              {{ props.row.assignedStaffName }}
            </span>
            <q-badge v-else color="amber-8">Não Atribuído</q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn
              unelevated
              dense
              size="sm"
              color="secondary"
              label="Reatribuir"
              icon="sync_alt"
              no-caps
              @click="openReassignModal(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Reatribuição -->
    <q-dialog v-model="showModal">
      <q-card class="hc-card q-pa-lg" style="min-width: 440px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
          Reatribuir Processo
        </div>
        <div class="text-caption text-slate-500 q-mb-md">
          {{ selectedProcess?.referenceCode }} — {{ selectedProcess?.subject }}
        </div>

        <q-form @submit.prevent="handleReassign">
          <q-select
            v-model="targetStaffId"
            :options="staffOptions"
            label="Colaborador Responsável *"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-md"
            :rules="[(v) => !!v || 'Selecione o colaborador']"
          />

          <q-select
            v-model="targetDepartmentId"
            :options="departmentOptions"
            label="Departamento de Destino"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-md"
          />

          <q-input
            v-model="note"
            label="Instruções ou Nota Operacional"
            type="textarea"
            rows="3"
            placeholder="Ex.: Priorizar a verificação com o médico de serviço..."
            outlined
            dense
            class="q-mb-lg"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              no-caps
              label="Confirmar Encaminhamento"
              color="secondary"
              type="submit"
              :loading="submitting"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { departmentService, processService } from '../../services';
import type { Process, Department } from '../../types';
import { mockUsers } from '../../services/mock/mock-data';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const $q = useQuasar();
const authStore = useAuthStore();

const processes = ref<Process[]>([]);
const departments = ref<Department[]>([]);
const loading = ref(true);

const showModal = ref(false);
const selectedProcess = ref<Process | null>(null);
const targetStaffId = ref('');
const targetDepartmentId = ref('');
const note = ref('');
const submitting = ref(false);

const columns: QTableColumn[] = [
  { name: 'referenceCode', label: 'Código', field: 'referenceCode', align: 'left', sortable: true },
  { name: 'subject', label: 'Assunto', field: 'subject', align: 'left' },
  { name: 'department', label: 'Departamento', field: (row: Process) => row.department?.name || 'Geral', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'assignedTo', label: 'Responsável Atual', field: 'assignedStaffName', align: 'left' },
  { name: 'actions', label: 'Ação', field: 'id', align: 'right' }
];

onMounted(async () => {
  const [pRes, dRes] = await Promise.all([
    processService.getProcesses(),
    departmentService.getDepartments()
  ]);
  processes.value = pRes;
  departments.value = dRes;
  loading.value = false;
});

const staffOptions = computed(() =>
  mockUsers
    .filter((u) => u.roles.includes('STAFF'))
    .map((u) => ({ label: `${u.fullName} (${u.phone})`, value: u.id }))
);

const departmentOptions = computed(() =>
  departments.value.map((d) => ({ label: d.name, value: d.id }))
);

function openReassignModal(proc: Process) {
  selectedProcess.value = proc;
  targetStaffId.value = proc.assignedTo || (staffOptions.value[0]?.value as string) || '';
  targetDepartmentId.value = proc.departmentId || '';
  note.value = '';
  showModal.value = true;
}

async function handleReassign() {
  if (!selectedProcess.value || !targetStaffId.value || !authStore.user) return;
  submitting.value = true;
  try {
    await processService.assignProcess(
      selectedProcess.value.id,
      targetStaffId.value,
      targetDepartmentId.value || undefined,
      note.value,
      authStore.user.id
    );

    // Atualiza a lista local
    processes.value = await processService.getProcesses();
    showModal.value = false;
    $q.notify({
      type: 'positive',
      message: 'Processo reatribuído com sucesso!',
      caption: 'O colaborador foi notificado e a ação foi registada na auditoria.'
    });
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Falha na reatribuição'
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
