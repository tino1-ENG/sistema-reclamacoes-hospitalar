<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Relatórios & Indicadores
        </h1>
        <div class="text-body2 text-slate-500">
          Análise periódica de ocorrências, tempos de resposta e resolução do hospital.
        </div>
      </div>

      <q-btn
        outline
        color="secondary"
        icon="file_download"
        label="Exportar Relatório (CSV)"
        no-caps
        @click="exportReport"
      />
    </div>

    <!-- Filtros de Período -->
    <q-card class="hc-card q-pa-md q-mb-lg">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-4">
          <q-select
            v-model="selectedPeriod"
            :options="periodOptions"
            outlined
            dense
            label="Período de Análise"
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="startDate" type="date" label="Data de Início" outlined dense />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="endDate" type="date" label="Data de Fim" outlined dense />
        </div>
      </div>
    </q-card>

    <!-- Resumo de Desempenho por Departamento -->
    <q-card class="hc-card q-pa-lg">
      <div class="text-h6 text-weight-bold text-slate-800 q-mb-md">
        Desempenho por Departamento
      </div>

      <q-markup-table flat separator="horizontal">
        <thead>
          <tr class="bg-slate-50 text-slate-700">
            <th class="text-left font-bold">Departamento</th>
            <th class="text-center font-bold">Total Processos</th>
            <th class="text-center font-bold">Resolvidos no Prazo</th>
            <th class="text-center font-bold">Tempo Médio (h)</th>
            <th class="text-center font-bold">Taxa Cumprimento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dept in departmentMetrics" :key="dept.name">
            <td class="text-weight-bold text-slate-800">{{ dept.name }}</td>
            <td class="text-center">{{ dept.total }}</td>
            <td class="text-center text-positive text-weight-bold">{{ dept.onTime }}</td>
            <td class="text-center">{{ dept.avgHours }}h</td>
            <td class="text-center">
              <q-badge :color="dept.rate >= 90 ? 'positive' : 'warning'">
                {{ dept.rate }}%
              </q-badge>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const selectedPeriod = ref('Últimos 30 Dias');
const periodOptions = ['Últimos 7 Dias', 'Últimos 30 Dias', 'Último Trimestre', 'Ano Corrente'];

const startDate = ref('2026-09-15');
const endDate = ref('2026-10-14');

const departmentMetrics = [
  { name: 'Triagem e Urgências', total: 42, onTime: 39, avgHours: 14, rate: 93 },
  { name: 'Farmácia Hospitalar', total: 28, onTime: 27, avgHours: 8, rate: 96 },
  { name: 'Consultas Externas', total: 35, onTime: 31, avgHours: 22, rate: 88 },
  { name: 'Maternidade e Obstetrícia', total: 18, onTime: 18, avgHours: 6, rate: 100 },
  { name: 'Laboratório de Análises', total: 24, onTime: 22, avgHours: 16, rate: 91 },
  { name: 'Atendimento Administrativo', total: 15, onTime: 14, avgHours: 12, rate: 93 }
];

function exportReport() {
  $q.notify({
    type: 'positive',
    message: 'Relatório exportado em formato CSV!',
    caption: 'hospitalcare_relatorio_outubro_2026.csv gerado com sucesso.'
  });
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
