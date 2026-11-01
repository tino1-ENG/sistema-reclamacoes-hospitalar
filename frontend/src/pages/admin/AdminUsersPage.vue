<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Gestão de Utilizadores e Colaboradores
        </h1>
        <div class="text-body2 text-slate-500">
          Controlo rigoroso de acessos institucionais. Apenas o Administrador pode registar colaboradores e atribuir departamentos e permissões.
        </div>
      </div>

      <q-btn
        unelevated
        color="red-9"
        icon="person_add"
        label="Registar Novo Colaborador"
        no-caps
        class="text-weight-bold"
        @click="openCreateModal"
      />
    </div>

    <!-- Tabela de Utilizadores -->
    <q-card class="hc-card">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-fullName="props">
          <q-td :props="props">
            <div class="text-weight-bold text-slate-800">{{ props.row.fullName }}</div>
            <div class="text-caption text-slate-500">{{ props.row.email || 'Sem email institucional' }}</div>
          </q-td>
        </template>

        <template #body-cell-roles="props">
          <q-td :props="props">
            <q-badge
              v-for="r in props.row.roles"
              :key="r"
              :color="getRoleColor(r)"
              class="q-mr-xs text-weight-bold"
            >
              {{ r }}
            </q-badge>
            <div v-if="getDepartmentName(props.row.departmentId)" class="text-caption text-slate-500 q-mt-xs">
              <q-icon name="apartment" size="12px" class="q-mr-xs" />
              {{ getDepartmentName(props.row.departmentId) }}
            </div>
          </q-td>
        </template>

        <template #body-cell-isActive="props">
          <q-td :props="props">
            <q-badge :color="props.row.isActive ? 'positive' : 'grey-6'">
              {{ props.row.isActive ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn
              flat
              dense
              round
              size="sm"
              :color="props.row.isActive ? 'negative' : 'positive'"
              :icon="props.row.isActive ? 'block' : 'check_circle'"
              @click="toggleUserActive(props.row)"
            >
              <q-tooltip>{{ props.row.isActive ? 'Desativar conta' : 'Ativar conta' }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Criação de Utilizador Interno -->
    <q-dialog v-model="showCreateModal">
      <q-card class="hc-card q-pa-lg" style="min-width: 480px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
          Registar Colaborador Hospitalar
        </div>
        <div class="text-caption text-slate-500 q-mb-md">
          Defina o perfil de acesso e o departamento de afetação do colaborador.
        </div>

        <q-form @submit.prevent="handleCreateUser">
          <q-input
            v-model="newUserName"
            label="Nome Completo *"
            placeholder="Ex.: Dr. António Sitoe"
            outlined
            dense
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-input
            v-model="newUserPhone"
            label="Telefone Institucional *"
            placeholder="+258 84 000 0000"
            outlined
            dense
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-input
            v-model="newUserEmail"
            label="Email Institucional *"
            placeholder="nome@hcm.gov.mz"
            type="email"
            outlined
            dense
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-select
            v-model="newUserRole"
            :options="internalRoleOptions"
            label="Perfil de Autorização *"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-select
            v-if="newUserRole === 'STAFF' || newUserRole === 'SUPERVISOR'"
            v-model="newUserDepartmentId"
            :options="departmentOptions"
            label="Departamento Afeto *"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Selecione o departamento do colaborador']"
          />

          <div class="text-caption text-slate-500 q-mb-md">
            Palavra-passe inicial padrão: <strong class="text-slate-800">123456</strong> (poderá ser alterada no primeiro acesso).
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              no-caps
              label="Registar e Atribuir Acesso"
              color="red-9"
              type="submit"
              class="text-weight-bold"
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
import { mockUsers, mockDepartments } from '../../services/mock/mock-data';
import { departmentService } from '../../services';
import type { User, RoleCode, Department } from '../../types';

const $q = useQuasar();

const STORAGE_KEY_ALL_USERS = 'hospitalcare_mock_registered_users';

const users = ref<User[]>([]);
const departments = ref<Department[]>([]);
const showCreateModal = ref(false);

const newUserName = ref('');
const newUserPhone = ref('+258 ');
const newUserEmail = ref('');
const newUserRole = ref<RoleCode>('STAFF');
const newUserDepartmentId = ref('');

const internalRoleOptions = [
  { label: 'Colaborador Clínico / Técnico (STAFF)', value: 'STAFF' },
  { label: 'Supervisão de Atendimento (SUPERVISOR)', value: 'SUPERVISOR' },
  { label: 'Administrador do Sistema (ADMIN)', value: 'ADMIN' }
];

const departmentOptions = computed(() =>
  departments.value.map((d) => ({ label: `${d.name} (${d.code})`, value: d.id }))
);

const columns: QTableColumn[] = [
  { name: 'fullName', label: 'Nome / Contacto', field: 'fullName', align: 'left', sortable: true },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' },
  { name: 'roles', label: 'Perfil e Departamento', field: 'roles', align: 'left' },
  { name: 'isActive', label: 'Estado', field: 'isActive', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'id', align: 'right' }
];

function loadStoredUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (stored) {
      const extraUsers: User[] = JSON.parse(stored);
      users.value = [...extraUsers, ...mockUsers.filter((mu) => !extraUsers.some((eu) => eu.id === mu.id))];
      return;
    }
  } catch {
    // fallback
  }
  users.value = [...mockUsers];
}

function persistUsers() {
  try {
    const extra = users.value.filter((u) => !mockUsers.some((mu) => mu.id === u.id));
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(extra));
  } catch {
    // quota
  }
}

onMounted(async () => {
  loadStoredUsers();
  try {
    departments.value = await departmentService.getDepartments();
  } catch {
    departments.value = [...mockDepartments];
  }
});

function getDepartmentName(deptId?: string): string {
  if (!deptId) return '';
  const d = departments.value.find((item) => item.id === deptId);
  return d ? d.name : '';
}

function getRoleColor(role: RoleCode): string {
  switch (role) {
    case 'PATIENT': return 'primary';
    case 'STAFF': return 'accent';
    case 'SUPERVISOR': return 'secondary';
    case 'ADMIN': return 'red-9';
    default: return 'grey';
  }
}

function openCreateModal() {
  newUserName.value = '';
  newUserPhone.value = '+258 ';
  newUserEmail.value = '';
  newUserRole.value = 'STAFF';
  newUserDepartmentId.value = departments.value[0]?.id || '';
  showCreateModal.value = true;
}

function handleCreateUser() {
  const newUser: User = {
    id: `user-int-${Date.now()}`,
    hospitalId: 'hosp-001',
    fullName: newUserName.value.trim(),
    phone: newUserPhone.value.trim(),
    email: newUserEmail.value ? newUserEmail.value.trim().toLowerCase() : undefined,
    departmentId: (newUserRole.value === 'STAFF' || newUserRole.value === 'SUPERVISOR') ? newUserDepartmentId.value : undefined,
    phoneVerifiedAt: new Date().toISOString(),
    emailVerifiedAt: new Date().toISOString(),
    isActive: true,
    roles: [newUserRole.value],
    createdAt: new Date().toISOString()
  };

  users.value.unshift(newUser);
  persistUsers();

  showCreateModal.value = false;
  $q.notify({
    type: 'positive',
    message: `Colaborador ${newUser.fullName} registado com sucesso!`,
    caption: `Perfil: ${newUser.roles[0]} | Palavra-passe: 123456`,
    timeout: 5000
  });
}

function toggleUserActive(user: User) {
  user.isActive = !user.isActive;
  persistUsers();
  $q.notify({
    type: 'info',
    message: `Conta de ${user.fullName} ${user.isActive ? 'ativada' : 'desativada'}.`
  });
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
