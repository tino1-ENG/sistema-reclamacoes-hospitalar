<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Políticas de Prazo (SLA)
        </h1>
        <div class="text-body2 text-slate-500">
          Metas hospitalares de primeiro contacto e tempo máximo de resolução.
        </div>
      </div>
    </div>

    <q-card class="hc-card">
      <q-markup-table flat separator="horizontal">
        <thead>
          <tr class="bg-slate-50 text-slate-700">
            <th class="text-left font-bold">Nome da Política</th>
            <th class="text-center font-bold">Primeiro Contacto (Horas)</th>
            <th class="text-center font-bold">Resolução Total (Horas)</th>
            <th class="text-center font-bold">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="policy in policies" :key="policy.id">
            <td class="text-weight-bold text-slate-800">{{ policy.name }}</td>
            <td class="text-center text-primary text-weight-bold">{{ policy.firstResponseHours }} horas</td>
            <td class="text-center text-teal text-weight-bold">{{ policy.resolutionHours }} horas</td>
            <td class="text-center">
              <q-badge color="positive">Ativa</q-badge>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { categoryService } from '../../services';
import type { SlaPolicy } from '../../types';

const policies = ref<SlaPolicy[]>([]);

onMounted(async () => {
  policies.value = await categoryService.getSlaPolicies();
});
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
