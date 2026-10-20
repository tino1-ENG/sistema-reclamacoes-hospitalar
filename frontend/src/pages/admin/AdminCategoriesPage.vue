<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Categorias & Tipos de Manifestação
        </h1>
        <div class="text-body2 text-slate-500">
          Classificação temática de reclamações, esclarecimentos e sugestões.
        </div>
      </div>
    </div>

    <q-card class="hc-card">
      <q-table
        :rows="categories"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-code="props">
          <q-td :props="props">
            <q-badge color="grey-3" text-color="grey-9">{{ props.row.code }}</q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { categoryService } from '../../services';
import type { Category } from '../../types';

const categories = ref<Category[]>([]);

const columns: QTableColumn[] = [
  { name: 'name', label: 'Nome da Categoria', field: 'name', align: 'left', sortable: true },
  { name: 'code', label: 'Código', field: 'code', align: 'center' },
  { name: 'description', label: 'Descrição / Finalidade', field: 'description', align: 'left' }
];

onMounted(async () => {
  categories.value = await categoryService.getCategories();
});
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
