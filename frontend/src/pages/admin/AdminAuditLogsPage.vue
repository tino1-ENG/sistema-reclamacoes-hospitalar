<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Registos de Auditoria
        </h1>
        <div class="text-body2 text-slate-500">
          Rastreabilidade cronológica e imutável de eventos críticos do sistema.
        </div>
      </div>
    </div>

    <q-card class="hc-card">
      <q-table
        :rows="logs"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-badge color="grey-8" class="font-mono text-weight-bold">
              {{ props.row.action }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-metadata="props">
          <q-td :props="props">
            <span class="text-caption font-mono text-slate-600">
              {{ JSON.stringify(props.row.metadata) }}
            </span>
          </q-td>
        </template>

        <template #body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDateTime(props.row.createdAt) }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { auditService } from '../../services';
import type { AuditLog } from '../../types';
import { formatDateTime } from '../../utils/formatters';

const logs = ref<AuditLog[]>([]);

const columns: QTableColumn[] = [
  { name: 'createdAt', label: 'Data e Hora', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actorName', label: 'Operador / Utilizador', field: (row: AuditLog) => row.actorName || 'Sistema', align: 'left' },
  { name: 'action', label: 'Ação Realizada', field: 'action', align: 'left' },
  { name: 'entityType', label: 'Entidade', field: 'entityType', align: 'center' },
  { name: 'metadata', label: 'Metadados / Contexto', field: 'metadata', align: 'left' }
];

onMounted(async () => {
  logs.value = await auditService.getAuditLogs();
});
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
.font-mono { font-family: monospace; }
</style>
