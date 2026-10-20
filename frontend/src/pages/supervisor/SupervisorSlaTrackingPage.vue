<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Acompanhamento de Prazos (SLA)
        </h1>
        <div class="text-body2 text-slate-500">
          Monitorização de tempos de resposta e identificação proativa de potenciais incumprimentos de prazos.
        </div>
      </div>
    </div>

    <!-- Tabela de Controlo de Prazos -->
    <q-card class="hc-card">
      <q-table
        :rows="processes"
        :columns="columns"
        row-key="id"
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

        <template #body-cell-slaDueAt="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-icon
                :name="props.row.slaOverdue ? 'error' : 'schedule'"
                :color="props.row.slaOverdue ? 'negative' : 'primary'"
                size="16px"
                class="q-mr-xs"
              />
              <span :class="{ 'text-negative text-weight-bold': props.row.slaOverdue }">
                {{ formatDateTime(props.row.slaDueAt) }}
              </span>
            </div>
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
              flat
              dense
              size="sm"
              color="secondary"
              label="Abrir"
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
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { processService } from '../../services';
import type { Process } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const processes = ref<Process[]>([]);

const columns: QTableColumn[] = [
  { name: 'referenceCode', label: 'Código', field: 'referenceCode', align: 'left', sortable: true },
  { name: 'subject', label: 'Assunto', field: 'subject', align: 'left' },
  { name: 'assignedStaffName', label: 'Responsável', field: (row: Process) => row.assignedStaffName || 'Sem responsável', align: 'left' },
  { name: 'slaDueAt', label: 'Prazo Limite (SLA)', field: 'slaDueAt', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ação', field: 'id', align: 'right' }
];

onMounted(async () => {
  processes.value = await processService.getProcesses();
});
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
