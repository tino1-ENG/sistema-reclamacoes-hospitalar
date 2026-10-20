<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Processos Atribuídos
        </h1>
        <div class="text-body2 text-slate-500">
          Fila de trabalho operacional para tratamento, esclarecimento e alteração de estado.
        </div>
      </div>
    </div>

    <!-- Filtros de Pesquisa -->
    <q-card class="hc-card q-pa-md q-mb-lg">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-4">
          <q-input
            v-model="searchTerm"
            outlined
            dense
            placeholder="Pesquisar utente, código ou assunto..."
            clearable
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>

        <div class="col-12 col-sm-3">
          <q-select
            v-model="selectedStatusId"
            :options="statusOptions"
            outlined
            dense
            emit-value
            map-options
            clearable
            label="Estado"
          />
        </div>

        <div class="col-12 col-sm-3">
          <q-select
            v-model="selectedPriorityId"
            :options="priorityOptions"
            outlined
            dense
            emit-value
            map-options
            clearable
            label="Prioridade"
          />
        </div>

        <div class="col-12 col-sm-2 text-right">
          <q-btn flat no-caps color="grey-7" label="Limpar" @click="clearFilters" />
        </div>
      </div>
    </q-card>

    <!-- Tabela Quasar QTable -->
    <q-card class="hc-card">
      <q-table
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-referenceCode="props">
          <q-td :props="props">
            <router-link
              :to="`/funcionario/processos/${props.row.id}`"
              class="text-weight-bold text-teal-9 text-decoration-none"
            >
              {{ props.row.referenceCode }}
            </router-link>
          </q-td>
        </template>

        <template #body-cell-priority="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.priority.code === 'HIGH' || props.row.priority.code === 'URGENT' ? 'negative' : 'grey-7'"
            >
              {{ props.row.priority.name }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <ProcessStatusBadge :status="props.row.status.code" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn
              unelevated
              dense
              size="sm"
              color="teal"
              label="Tratar Processo"
              icon="open_in_new"
              no-caps
              :to="`/funcionario/processos/${props.row.id}`"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { categoryService, processService } from '../../services';
import type { Process, ProcessStatus, Priority } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const authStore = useAuthStore();
const processes = ref<Process[]>([]);
const statuses = ref<ProcessStatus[]>([]);
const priorities = ref<Priority[]>([]);
const loading = ref(true);

const searchTerm = ref('');
const selectedStatusId = ref<number | null>(null);
const selectedPriorityId = ref<number | null>(null);

const columns: QTableColumn[] = [
  { name: 'referenceCode', label: 'Código', field: 'referenceCode', align: 'left', sortable: true },
  { name: 'patientName', label: 'Utente / Contacto', field: (row: Process) => `${row.patientName || 'Anónimo'} (${row.patientPhone})`, align: 'left' },
  { name: 'subject', label: 'Assunto', field: 'subject', align: 'left', style: 'max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' },
  { name: 'priority', label: 'Prioridade', field: 'priority', align: 'center', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center', sortable: true },
  { name: 'updatedAt', label: 'Última Atualização', field: (row: Process) => formatDateTime(row.updatedAt), align: 'left', sortable: true },
  { name: 'actions', label: 'Ações', field: 'id', align: 'right' }
];

onMounted(async () => {
  if (authStore.user) {
    try {
      const [pRes, sRes, prRes] = await Promise.all([
        processService.getProcesses({ assignedTo: authStore.user.id }),
        categoryService.getStatuses(),
        categoryService.getPriorities()
      ]);
      processes.value = pRes;
      statuses.value = sRes;
      priorities.value = prRes;
    } finally {
      loading.value = false;
    }
  }
});

const statusOptions = computed(() =>
  statuses.value.map((s) => ({ label: s.name, value: s.id }))
);

const priorityOptions = computed(() =>
  priorities.value.map((p) => ({ label: p.name, value: p.id }))
);

const filteredRows = computed(() => {
  let list = processes.value;
  if (selectedStatusId.value) {
    list = list.filter((p) => p.statusId === selectedStatusId.value);
  }
  if (selectedPriorityId.value) {
    list = list.filter((p) => p.priorityId === selectedPriorityId.value);
  }
  if (searchTerm.value && searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.referenceCode.toLowerCase().includes(term) ||
        p.subject.toLowerCase().includes(term) ||
        (p.patientName && p.patientName.toLowerCase().includes(term))
    );
  }
  return list;
});

function clearFilters() {
  searchTerm.value = '';
  selectedStatusId.value = null;
  selectedPriorityId.value = null;
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
.text-decoration-none { text-decoration: none; }
</style>
