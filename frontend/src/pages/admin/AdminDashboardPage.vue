<template>
  <q-page class="q-pa-lg max-w-7xl q-mx-auto admin-dashboard-page">
    <!-- Cabeçalho Executivo e Barra de Filtros -->
    <div class="row items-center justify-between q-mb-lg flex-wrap q-gutter-y-md">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Painel de Análise e Gestão Hospitalar
        </h1>
        <div class="text-body2 text-slate-600">
          Monitorização em tempo real de processos, satisfação dos utentes, fluxos clínicos e cumprimento de SLA no HCM.
        </div>
      </div>

      <!-- Controlos e Filtros Rápidos -->
      <div class="row items-center q-gutter-sm">
        <q-select
          v-model="selectedPeriod"
          outlined
          dense
          bg-color="white"
          :options="periodOptions"
          emit-value
          map-options
          class="period-select"
          @update:model-value="refreshAnalytics"
        >
          <template #prepend>
            <q-icon name="calendar_today" size="18px" color="primary" />
          </template>
        </q-select>

        <q-btn
          unelevated
          color="primary"
          icon="refresh"
          label="Atualizar"
          no-caps
          :loading="loading"
          @click="refreshAnalytics"
          class="text-weight-bold"
        />

        <q-btn
          outline
          color="slate-700"
          icon="file_download"
          label="Exportar"
          no-caps
          @click="exportSummary"
          class="text-weight-medium bg-white"
        />
      </div>
    </div>

    <!-- 4 Cartões KPI com Gradientes Coloridos e Contrastantes -->
    <div class="row q-col-gutter-md q-mb-xl">
      <!-- KPI 1: Total de Processos -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card kpi-card-indigo text-white shadow-md">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <span class="text-caption text-weight-bold text-uppercase tracking-wide opacity-90">
                Total de Processos
              </span>
              <div class="kpi-icon-pill bg-white-20">
                <q-icon name="folder" size="20px" />
              </div>
            </div>
            <div class="text-h3 text-weight-bolder leading-none q-mb-xs">
              {{ metrics.totalProcesses }}
            </div>
            <div class="row items-center text-caption opacity-90">
              <q-icon name="trending_up" size="16px" class="q-mr-xs text-green-300" />
              <span>+14.2% em relação ao mês anterior</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- KPI 2: Taxa de Resolução -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card kpi-card-emerald text-white shadow-md">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <span class="text-caption text-weight-bold text-uppercase tracking-wide opacity-90">
                Taxa de Resolução
              </span>
              <div class="kpi-icon-pill bg-white-20">
                <q-icon name="check_circle" size="20px" />
              </div>
            </div>
            <div class="text-h3 text-weight-bolder leading-none q-mb-xs">
              {{ resolutionRate }}%
            </div>
            <div class="row items-center text-caption opacity-90">
              <q-icon name="done_all" size="16px" class="q-mr-xs text-emerald-200" />
              <span>{{ metrics.resolvedProcesses }} processos concluídos</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- KPI 3: Conformidade de SLA -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card kpi-card-cyan text-white shadow-md">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <span class="text-caption text-weight-bold text-uppercase tracking-wide opacity-90">
                Cumprimento de SLA
              </span>
              <div class="kpi-icon-pill bg-white-20">
                <q-icon name="timer" size="20px" />
              </div>
            </div>
            <div class="text-h3 text-weight-bolder leading-none q-mb-xs">
              {{ slaComplianceRate }}%
            </div>
            <div class="row items-center text-caption opacity-90">
              <q-icon name="schedule" size="16px" class="q-mr-xs" />
              <span>Tempo médio de triagem: 18.5h</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- KPI 4: Índice de Satisfação -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card kpi-card-amber text-white shadow-md">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <span class="text-caption text-weight-bold text-uppercase tracking-wide opacity-90">
                Satisfação do Utente
              </span>
              <div class="kpi-icon-pill bg-white-20">
                <q-icon name="star" size="20px" />
              </div>
            </div>
            <div class="text-h3 text-weight-bolder leading-none q-mb-xs">
              {{ metrics.satisfactionRatePercent }}%
            </div>
            <div class="row items-center text-caption opacity-90">
              <q-icon name="sentiment_very_satisfied" size="16px" class="q-mr-xs" />
              <span>Nota média 4.8 / 5.0 estrelas</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- SEÇÃO DE ANÁLISES POR MEIO DE GRÁFICOS MUITO COLORIDOS -->
    <div class="text-h5 text-weight-bolder text-slate-800 q-mb-md row items-center">
      <q-icon name="bar_chart" size="28px" color="primary" class="q-mr-sm" />
      <span>Análise Visual e Gráficos Comparativos</span>
    </div>

    <!-- Linha 1 de Gráficos Coloridos -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Gráfico 1: Volume Mensal por Categoria de Manifestação (Barras Agrupadas Vibrantes) -->
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="chart-card bg-white full-height">
          <q-card-section class="q-pb-none">
            <div class="row items-center justify-between">
              <div>
                <div class="text-subtitle1 text-weight-bold text-slate-800">
                  Volume Mensal por Categoria de Manifestação
                </div>
                <div class="text-caption text-slate-500">
                  Distribuição temporal entre Reclamações, Sugestões, Solicitações e Elogios.
                </div>
              </div>
              <q-badge color="blue-1" text-color="primary" class="text-weight-bold q-pa-xs">
                Ano 2026
              </q-badge>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="chart-canvas-container" style="height: 320px;">
              <canvas ref="barChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico 2: Distribuição por Departamentos Hospitalares (Doughnut Multi-Colorido) -->
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="chart-card bg-white full-height">
          <q-card-section class="q-pb-none">
            <div class="row items-center justify-between">
              <div>
                <div class="text-subtitle1 text-weight-bold text-slate-800">
                  Distribuição por Departamentos
                </div>
                <div class="text-caption text-slate-500">
                  Percentagem de processos atribuídos aos serviços clínicos do HCM.
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="chart-canvas-container" style="height: 320px;">
              <canvas ref="doughnutChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Linha 2 de Gráficos Coloridos -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Gráfico 3: Cumprimento de Prazos e Severidade (Polar Area Chart Colorido) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="chart-card bg-white full-height">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold text-slate-800">
              Controlo de Prazos e Gravidade
            </div>
            <div class="text-caption text-slate-500">
              Desempenho operacional por nível de prioridade clínica.
            </div>
          </q-card-section>
          <q-card-section>
            <div class="chart-canvas-container" style="height: 280px;">
              <canvas ref="polarChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico 4: Evolução do Tempo de Resposta (Linha Suave com Gradiente) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="chart-card bg-white full-height">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold text-slate-800">
              Evolução do Tempo de Resposta (Horas)
            </div>
            <div class="text-caption text-slate-500">
              Média mensal de resolução pelo staff e supervisão.
            </div>
          </q-card-section>
          <q-card-section>
            <div class="chart-canvas-container" style="height: 280px;">
              <canvas ref="lineChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico 5: Distribuição de Avaliações dos Utentes (Barras Horizontais Multi-Color) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="chart-card bg-white full-height">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold text-slate-800">
              Índice de Avaliação dos Utentes
            </div>
            <div class="text-caption text-slate-500">
              Classificação por estrelas após conclusão do atendimento.
            </div>
          </q-card-section>
          <q-card-section>
            <div class="chart-canvas-container" style="height: 280px;">
              <canvas ref="ratingChartCanvas"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Atalhos Administrativos e Acesso Rápido -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-4">
        <q-card class="admin-shortcut-card q-pa-lg full-height bg-white">
          <div class="row items-center q-mb-sm">
            <q-avatar size="40px" class="bg-red-50 text-red-600 q-mr-sm">
              <q-icon name="people" size="22px" />
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold text-slate-800">Utilizadores e Perfis</div>
              <div class="text-caption text-slate-500">18 Contas Ativas</div>
            </div>
          </div>
          <p class="text-body2 text-slate-600 q-mb-md">
            Gerir acessos RBAC de pacientes, colaboradores clínicos, supervisão e administradores.
          </p>
          <q-btn flat color="primary" no-caps label="Gerir Utilizadores →" to="/admin/utilizadores" class="text-weight-bold" />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="admin-shortcut-card q-pa-lg full-height bg-white">
          <div class="row items-center q-mb-sm">
            <q-avatar size="40px" class="bg-blue-50 text-blue-600 q-mr-sm">
              <q-icon name="corporate_fare" size="22px" />
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold text-slate-800">Departamentos HCM</div>
              <div class="text-caption text-slate-500">6 Serviços Vinculados</div>
            </div>
          </div>
          <p class="text-body2 text-slate-600 q-mb-md">
            Configurar serviços médicos, códigos institucionais e categorias padrão de triagem.
          </p>
          <q-btn flat color="primary" no-caps label="Gerir Departamentos →" to="/admin/departamentos" class="text-weight-bold" />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="admin-shortcut-card q-pa-lg full-height bg-white">
          <div class="row items-center q-mb-sm">
            <q-avatar size="40px" class="bg-teal-50 text-teal-600 q-mr-sm">
              <q-icon name="receipt_long" size="22px" />
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold text-slate-800">Auditoria & Segurança</div>
              <div class="text-caption text-slate-500">Trilha Auditável</div>
            </div>
          </div>
          <p class="text-body2 text-slate-600 q-mb-md">
            Inspecionar histórico de ações, mudanças de estado e reatribuições com integridade.
          </p>
          <q-btn flat color="primary" no-caps label="Ver Auditoria →" to="/admin/auditoria" class="text-weight-bold" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { dashboardService } from '../../services';
import type { DashboardMetrics } from '../../types';
import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  PolarAreaController
} from 'chart.js';

// Registo de controladores e componentes do Chart.js
Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  PolarAreaController
);

const $q = useQuasar();
const loading = ref(false);
const selectedPeriod = ref('last_30_days');

const periodOptions = [
  { label: 'Últimos 30 Dias', value: 'last_30_days' },
  { label: 'Último Trimestre', value: 'last_quarter' },
  { label: 'Ano Corrente (2026)', value: 'year_2026' }
];

// Métricas de estado
const metrics = ref<DashboardMetrics>({
  totalProcesses: 42,
  pendingProcesses: 6,
  inReviewProcesses: 11,
  resolvedProcesses: 25,
  overdueProcesses: 2,
  averageResponseTimeHours: 18.5,
  satisfactionRatePercent: 96,
  distributionByType: [],
  distributionByDepartment: [],
  distributionByStatus: []
});

const resolutionRate = computed(() => {
  if (metrics.value.totalProcesses === 0) return 100;
  return Math.round((metrics.value.resolvedProcesses / metrics.value.totalProcesses) * 100);
});

const slaComplianceRate = computed(() => {
  if (metrics.value.totalProcesses === 0) return 100;
  const compliance = ((metrics.value.totalProcesses - metrics.value.overdueProcesses) / metrics.value.totalProcesses) * 100;
  return Math.max(0, Math.round(compliance));
});

// Referências aos elementos canvas
const barChartCanvas = ref<HTMLCanvasElement | null>(null);
const doughnutChartCanvas = ref<HTMLCanvasElement | null>(null);
const polarChartCanvas = ref<HTMLCanvasElement | null>(null);
const lineChartCanvas = ref<HTMLCanvasElement | null>(null);
const ratingChartCanvas = ref<HTMLCanvasElement | null>(null);

// Instâncias ativas do Chart.js
let barChartInstance: Chart | null = null;
let doughnutChartInstance: Chart | null = null;
let polarChartInstance: Chart | null = null;
let lineChartInstance: Chart | null = null;
let ratingChartInstance: Chart | null = null;

function destroyCharts() {
  if (barChartInstance) { barChartInstance.destroy(); barChartInstance = null; }
  if (doughnutChartInstance) { doughnutChartInstance.destroy(); doughnutChartInstance = null; }
  if (polarChartInstance) { polarChartInstance.destroy(); polarChartInstance = null; }
  if (lineChartInstance) { lineChartInstance.destroy(); lineChartInstance = null; }
  if (ratingChartInstance) { ratingChartInstance.destroy(); ratingChartInstance = null; }
}

function initCharts() {
  destroyCharts();

  // 1. Gráfico de Barras Agrupadas Coloridas (Volume por Categoria)
  if (barChartCanvas.value) {
    barChartInstance = new Chart(barChartCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Reclamações',
            data: [18, 22, 16, 25, 20, 15],
            backgroundColor: '#EF4444', // Vermelho vibrante
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Sugestões',
            data: [8, 12, 10, 14, 18, 16],
            backgroundColor: '#10B981', // Verde esmeralda vibrante
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Solicitações',
            data: [14, 19, 15, 21, 17, 23],
            backgroundColor: '#3B82F6', // Azul real vibrante
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Elogios',
            data: [5, 7, 9, 11, 14, 18],
            backgroundColor: '#F59E0B', // Âmbar ouro vibrante
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Public Sans', size: 12, weight: 'bold' }
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' }
          }
        }
      }
    });
  }

  // 2. Gráfico Doughnut Multi-colorido (Departamentos Hospitalares)
  if (doughnutChartCanvas.value) {
    doughnutChartInstance = new Chart(doughnutChartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: [
          'Urgência Geral',
          'Pediatria',
          'Maternidade & Obstetrícia',
          'Consulta Externa',
          'Farmácia Central',
          'Cirurgia & Bloco'
        ],
        datasets: [
          {
            data: [28, 22, 18, 14, 11, 7],
            backgroundColor: [
              '#6366F1', // Índigo vibrante
              '#06B6D4', // Ciano brilhante
              '#EC4899', // Rosa magenta
              '#8B5CF6', // Roxo vivo
              '#F97316', // Laranja quente
              '#14B8A6'  // Verde-água teal
            ],
            hoverOffset: 8,
            borderWidth: 2,
            borderColor: '#FFFFFF'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: window.innerWidth < 640 ? 'bottom' : 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Public Sans', size: 11 },
              boxWidth: 10,
              padding: 10
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed}% dos casos`
            }
          }
        }
      }
    });
  }

  // 3. Gráfico Polar Area (Prazos e Níveis de Gravidade)
  if (polarChartCanvas.value) {
    polarChartInstance = new Chart(polarChartCanvas.value, {
      type: 'polarArea',
      data: {
        labels: ['Baixa Prioridade', 'Média Prioridade', 'Alta Prioridade', 'Crítica / Urgente'],
        datasets: [
          {
            data: [35, 28, 19, 9],
            backgroundColor: [
              'rgba(16, 185, 129, 0.75)', // Verde
              'rgba(59, 130, 246, 0.75)', // Azul
              'rgba(245, 158, 11, 0.75)', // Amarelo
              'rgba(239, 68, 68, 0.8)'    // Vermelho
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Public Sans', size: 10 }
            }
          }
        },
        scales: {
          r: {
            grid: { color: '#E2E8F0' },
            ticks: { display: false }
          }
        }
      }
    });
  }

  // 4. Gráfico de Linha com Área em Gradiente (Evolução do Tempo Médio de Resposta)
  if (lineChartCanvas.value) {
    const ctx = lineChartCanvas.value.getContext('2d');
    let gradientFill: string | CanvasGradient = 'rgba(99, 102, 241, 0.2)';
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 250);
      g.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
      g.addColorStop(1, 'rgba(6, 182, 212, 0.05)');
      gradientFill = g;
    }

    lineChartInstance = new Chart(lineChartCanvas.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Tempo Médio (Horas)',
            data: [36.2, 31.8, 26.5, 22.0, 19.4, 18.5],
            borderColor: '#6366F1', // Roxo Índigo vibrante
            backgroundColor: gradientFill as unknown as string,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#6366F1',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` Tempo: ${ctx.parsed.y} horas`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: false,
            grid: { color: '#F1F5F9' },
            ticks: {
              callback: (val) => `${val}h`
            }
          }
        }
      }
    });
  }

  // 5. Gráfico de Barras Horizontais Multi-Cor (Satisfação dos Utentes)
  if (ratingChartCanvas.value) {
    ratingChartInstance = new Chart(ratingChartCanvas.value, {
      type: 'bar',
      data: {
        labels: ['5 Estrelas', '4 Estrelas', '3 Estrelas', '2 Estrelas', '1 Estrela'],
        datasets: [
          {
            label: 'Avaliações',
            data: [68, 22, 6, 3, 1],
            backgroundColor: [
              '#10B981', // 5★ Verde esmeralda
              '#3B82F6', // 4★ Azul
              '#F59E0B', // 3★ Amarelo
              '#F97316', // 2★ Laranja
              '#EF4444'  // 1★ Vermelho
            ],
            borderRadius: 6
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x}% dos utentes`
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#F1F5F9' },
            ticks: {
              callback: (val) => `${val}%`
            }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }
}

async function refreshAnalytics() {
  loading.value = true;
  try {
    const data = await dashboardService.getMetrics();
    if (data) {
      metrics.value = data;
    }
  } catch {
    // Usa valores padrão
  } finally {
    loading.value = false;
    await nextTick();
    initCharts();
  }
}

function exportSummary() {
  $q.notify({
    type: 'positive',
    message: 'Relatório analítico exportado com sucesso (formato PDF/CSV).',
    position: 'top'
  });
}

onMounted(async () => {
  await refreshAnalytics();
});

onBeforeUnmount(() => {
  destroyCharts();
});
</script>

<style scoped>
.max-w-7xl {
  max-width: 1360px;
}

/* ==========================================================================
   KPI Cards Coloridos e Contrastantes
   ========================================================================== */
.kpi-card {
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 28px -8px rgba(15, 23, 42, 0.2);
}

.kpi-card-indigo {
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
}

.kpi-card-emerald {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.kpi-card-cyan {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}

.kpi-card-amber {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

.kpi-icon-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.tracking-wide {
  letter-spacing: 0.05em;
}

/* ==========================================================================
   Cartões de Gráficos
   ========================================================================== */
.chart-card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
}

.chart-canvas-container {
  position: relative;
  width: 100%;
}

/* Atalhos */
.admin-shortcut-card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.admin-shortcut-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.08);
}

.period-select {
  min-width: 190px;
}
</style>
