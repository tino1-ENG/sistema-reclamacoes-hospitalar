<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Departamentos & Serviços Hospitalares
        </h1>
        <div class="text-body2 text-slate-500">
          Configuração dos serviços clínicos e áreas de triagem do hospital piloto.
        </div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="add_business"
        label="Adicionar Departamento"
        no-caps
        @click="openModal"
      />
    </div>

    <!-- Tabela de Departamentos -->
    <q-card class="hc-card">
      <q-table
        :rows="departments"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-code="props">
          <q-td :props="props">
            <q-badge color="blue-2" text-color="primary" class="text-weight-bold">
              {{ props.row.code }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round dense size="sm" icon="edit" color="primary" @click="editDept(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Criação / Edição -->
    <q-dialog v-model="showModal">
      <q-card class="hc-card q-pa-lg" style="min-width: 420px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-sm">
          {{ editingId ? 'Editar Departamento' : 'Novo Departamento' }}
        </div>

        <q-form @submit.prevent="saveDept">
          <q-input
            v-model="deptName"
            label="Nome do Departamento *"
            outlined
            dense
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-input
            v-model="deptCode"
            label="Código Identificador *"
            placeholder="Ex.: URG, FARM, CONS"
            outlined
            dense
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-input
            v-model="deptDesc"
            label="Descrição / Âmbito do Serviço"
            type="textarea"
            rows="3"
            outlined
            dense
            class="q-mb-lg"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              no-caps
              label="Guardar"
              color="primary"
              type="submit"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { departmentService } from '../../services';
import type { Department } from '../../types';

const $q = useQuasar();

const departments = ref<Department[]>([]);
const showModal = ref(false);
const editingId = ref<string | null>(null);
const deptName = ref('');
const deptCode = ref('');
const deptDesc = ref('');

const columns: QTableColumn[] = [
  { name: 'name', label: 'Nome do Serviço', field: 'name', align: 'left', sortable: true },
  { name: 'code', label: 'Código', field: 'code', align: 'center', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'id', align: 'right' }
];

onMounted(async () => {
  departments.value = await departmentService.getDepartments();
});

function openModal() {
  editingId.value = null;
  deptName.value = '';
  deptCode.value = '';
  deptDesc.value = '';
  showModal.value = true;
}

function editDept(d: Department) {
  editingId.value = d.id;
  deptName.value = d.name;
  deptCode.value = d.code;
  deptDesc.value = d.description || '';
  showModal.value = true;
}

async function saveDept() {
  if (editingId.value) {
    await departmentService.updateDepartment(editingId.value, {
      name: deptName.value,
      code: deptCode.value,
      description: deptDesc.value
    });
    $q.notify({ type: 'positive', message: 'Departamento atualizado com sucesso!' });
  } else {
    await departmentService.createDepartment({
      hospitalId: 'hosp-001',
      name: deptName.value,
      code: deptCode.value,
      description: deptDesc.value,
      isActive: true
    });
    $q.notify({ type: 'positive', message: 'Departamento criado com sucesso!' });
  }
  departments.value = await departmentService.getDepartments();
  showModal.value = false;
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
