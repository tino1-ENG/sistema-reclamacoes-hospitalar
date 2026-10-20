<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Os Meus Processos
        </h1>
        <div class="text-body2 text-slate-500">
          Consulte o histórico de todas as reclamações, esclarecimentos e sugestões submetidas.
        </div>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Nova Submissão"
        no-caps
        to="/paciente/processos/novo"
      />
    </div>

    <!-- Filtros e Barra de Pesquisa -->
    <q-card class="hc-card q-pa-md q-mb-lg">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-5">
          <q-input
            v-model="searchTerm"
            outlined
            dense
            placeholder="Pesquisar por código, assunto ou texto..."
            clearable
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>

        <div class="col-12 col-sm-4">
          <q-select
            v-model="selectedStatusId"
            :options="statusFilterOptions"
            outlined
            dense
            emit-value
            map-options
            clearable
            label="Filtrar por Estado"
          />
        </div>

        <div class="col-12 col-sm-3">
          <q-select
            v-model="selectedTypeId"
            :options="typeFilterOptions"
            outlined
            dense
            emit-value
            map-options
            clearable
            label="Tipo de Processo"
          />
        </div>
      </div>
    </q-card>

    <!-- Lista de Processos -->
    <q-card class="hc-card">
      <LoadingState v-if="loading" />

      <EmptyState
        v-else-if="!filteredProcesses.length"
        title="Nenhum processo localizado"
        description="Não existem registos que correspondam aos filtros selecionados."
        action-label="Limpar Filtros"
        @action="clearFilters"
      />

      <q-list v-else separator>
        <q-item
          v-for="proc in paginatedProcesses"
          :key="proc.id"
          clickable
          v-ripple
          :to="`/paciente/processos/${proc.id}`"
          class="q-py-md"
        >
          <q-item-section avatar>
            <q-avatar size="44px" :color="getTypeColor(proc.processType.code)" text-color="white">
              <q-icon :name="getTypeIcon(proc.processType.code)" size="22px" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="row items-center q-gutter-x-sm q-mb-xs">
              <span class="text-caption text-weight-bolder text-primary">
                {{ proc.referenceCode }}
              </span>
              <span class="text-caption text-slate-400">•</span>
              <span class="text-caption text-slate-600 font-weight-medium">
                {{ proc.processType.name }}
              </span>
              <span class="text-caption text-slate-400">•</span>
              <span class="text-caption text-slate-500">
                {{ proc.category?.name }}
              </span>
            </div>
            <div class="text-subtitle1 text-weight-bold text-slate-800 line-clamp-1">
              {{ proc.subject }}
            </div>
            <div class="text-body2 text-slate-500 line-clamp-2 q-mt-xs">
              {{ proc.description }}
            </div>
          </q-item-section>

          <q-item-section side class="text-right">
            <ProcessStatusBadge :status="proc.status.code" class="q-mb-xs" />
            <div class="text-caption text-slate-400 font-size-11">
              Submetido: {{ formatDate(proc.createdAt) }}
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Paginação -->
      <div v-if="filteredProcesses.length > pageSize" class="q-pa-md flex flex-center border-t">
        <q-pagination
          v-model="page"
          :max="Math.ceil(filteredProcesses.length / pageSize)"
          direction-links
          boundary-links
          color="primary"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { categoryService, processService } from '../../services';
import type { Process, ProcessStatus, ProcessType, ProcessTypeCode } from '../../types';
import { formatDate, getProcessTypeMeta } from '../../utils/formatters';
import LoadingState from '../../components/common/LoadingState.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

const authStore = useAuthStore();
const processes = ref<Process[]>([]);
const statuses = ref<ProcessStatus[]>([]);
const processTypes = ref<ProcessType[]>([]);
const loading = ref(true);

const searchTerm = ref('');
const selectedStatusId = ref<number | null>(null);
const selectedTypeId = ref<number | null>(null);
const page = ref(1);
const pageSize = 6;

onMounted(async () => {
  if (authStore.user) {
    try {
      const [pRes, sRes, tRes] = await Promise.all([
        processService.getProcesses({ patientId: authStore.user.id }),
        categoryService.getStatuses(),
        categoryService.getProcessTypes()
      ]);
      processes.value = pRes;
      statuses.value = sRes;
      processTypes.value = tRes;
    } finally {
      loading.value = false;
    }
  }
});

const statusFilterOptions = computed(() =>
  statuses.value.filter((s) => s.isPatientVisible).map((s) => ({ label: s.name, value: s.id }))
);

const typeFilterOptions = computed(() =>
  processTypes.value.map((t) => ({ label: t.name, value: t.id }))
);

const filteredProcesses = computed(() => {
  let list = processes.value;

  if (selectedStatusId.value) {
    list = list.filter((p) => p.statusId === selectedStatusId.value);
  }
  if (selectedTypeId.value) {
    list = list.filter((p) => p.processTypeId === selectedTypeId.value);
  }
  if (searchTerm.value && searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.referenceCode.toLowerCase().includes(term) ||
        p.subject.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  return list;
});

const paginatedProcesses = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredProcesses.value.slice(start, start + pageSize);
});

function clearFilters() {
  searchTerm.value = '';
  selectedStatusId.value = null;
  selectedTypeId.value = null;
}

function getTypeColor(code: ProcessTypeCode): string {
  return getProcessTypeMeta(code).color;
}

function getTypeIcon(code: ProcessTypeCode): string {
  return getProcessTypeMeta(code).icon;
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
.font-size-11 { font-size: 11px; }
.border-t { border-top: 1px solid #e2e8f0; }
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
