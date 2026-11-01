<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <!-- Cabeçalho -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Gestão de Utilizadores e Contas
        </h1>
        <div class="text-body2 text-slate-500">
          Visualização unificada de todos os utentes/pacientes registados, colaboradores hospitalares e equipa de administração.
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="slate-7"
          icon="refresh"
          label="Atualizar"
          no-caps
          :loading="loading"
          @click="loadUsers"
        />
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
    </div>

    <!-- Barra de Abas e Filtros por Perfil -->
    <q-card class="hc-card q-mb-md q-pa-none">
      <div class="row items-center justify-between q-pa-md border-b">
        <q-tabs
          v-model="selectedRoleTab"
          dense
          no-caps
          active-color="primary"
          indicator-color="primary"
          class="text-grey-7"
        >
          <q-tab name="ALL" label="Todos" icon="group">
            <q-badge color="primary" class="q-ml-xs">{{ allUsers.length }}</q-badge>
          </q-tab>
          <q-tab name="PATIENT" label="Pacientes / Utentes" icon="personal_injury">
            <q-badge color="blue-8" class="q-ml-xs">{{ patientCount }}</q-badge>
          </q-tab>
          <q-tab name="STAFF" label="Colaboradores (Staff)" icon="badge">
            <q-badge color="teal-8" class="q-ml-xs">{{ staffCount }}</q-badge>
          </q-tab>
          <q-tab name="SUPERVISOR" label="Supervisores" icon="supervisor_account">
            <q-badge color="purple-8" class="q-ml-xs">{{ supervisorCount }}</q-badge>
          </q-tab>
          <q-tab name="ADMIN" label="Administradores" icon="admin_panel_settings">
            <q-badge color="red-9" class="q-ml-xs">{{ adminCount }}</q-badge>
          </q-tab>
        </q-tabs>
      </div>

      <!-- Barra de Pesquisa Rápida -->
      <div class="q-pa-md">
        <q-input
          v-model="searchTerm"
          dense
          outlined
          placeholder="Pesquisar utilizador por nome, telefone (+258...) ou email..."
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </q-card>

    <!-- Tabela de Utilizadores -->
    <q-card class="hc-card">
      <q-table
        :rows="filteredUsers"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="{ rowsPerPage: 15 }"
        no-data-label="Nenhum utilizador encontrado para este critério."
      >
        <template #body-cell-fullName="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-x-sm">
              <q-avatar size="32px" :color="getRoleAvatarColor(props.row.roles)" text-color="white" class="text-weight-bold">
                {{ (props.row.fullName || 'U').charAt(0).toUpperCase() }}
              </q-avatar>
              <div>
                <div class="text-weight-bold text-slate-800">{{ props.row.fullName }}</div>
                <div class="text-caption text-slate-500">{{ props.row.email || 'Sem email registado' }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-phone="props">
          <q-td :props="props">
            <span class="text-weight-medium text-slate-700 font-mono">
              {{ props.row.phone }}
            </span>
          </q-td>
        </template>

        <template #body-cell-roles="props">
          <q-td :props="props">
            <q-badge
              v-for="r in props.row.roles"
              :key="r"
              :color="getRoleColor(r)"
              class="q-mr-xs text-weight-bold q-pa-xs"
            >
              {{ formatRoleLabel(r) }}
            </q-badge>
            <div v-if="props.row.departmentName || getDepartmentName(props.row.departmentId)" class="text-caption text-slate-600 q-mt-xs">
              <q-icon name="apartment" size="13px" class="q-mr-xs text-teal-8" />
              {{ props.row.departmentName || getDepartmentName(props.row.departmentId) }}
            </div>
          </q-td>
        </template>

        <template #body-cell-createdAt="props">
          <q-td :props="props">
            <div class="text-caption text-slate-600">
              {{ formatDateTime(props.row.createdAt) }}
            </div>
          </q-td>
        </template>

        <template #body-cell-isActive="props">
          <q-td :props="props" align="center">
            <q-badge :color="props.row.isActive ? 'positive' : 'grey-6'" class="text-weight-bold">
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
              <q-tooltip>{{ props.row.isActive ? 'Suspender conta' : 'Reativar conta' }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de Criação de Colaborador Interno -->
    <q-dialog v-model="showCreateModal">
      <q-card class="hc-card q-pa-lg" style="min-width: 480px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
          Registar Colaborador Hospitalar
        </div>
        <div class="text-caption text-slate-500 q-mb-md">
          Apenas perfis autorizados (STAFF, SUPERVISOR, ADMIN).
        </div>

        <q-form @submit.prevent="handleCreateUser">
          <q-input
            v-model="newUserName"
            label="Nome Completo *"
            placeholder="Ex.: Dra. Joana Matsinhe"
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
import { departmentService, apiClient } from '../../services';
import type { User, RoleCode, Department } from '../../types';
import { formatDateTime } from '../../utils/formatters';

const $q = useQuasar();

const STORAGE_KEY_ALL_USERS = 'hospitalcare_mock_registered_users';

const allUsers = ref<User[]>([]);
const departments = ref<Department[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);

const selectedRoleTab = ref<string>('ALL');
const searchTerm = ref('');

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
  { name: 'fullName', label: 'Nome e Email', field: 'fullName', align: 'left', sortable: true },
  { name: 'phone', label: 'Telemóvel', field: 'phone', align: 'left' },
  { name: 'roles', label: 'Perfil / Departamento', field: 'roles', align: 'left' },
  { name: 'createdAt', label: 'Data de Registo', field: 'createdAt', align: 'left', sortable: true },
  { name: 'isActive', label: 'Estado', field: 'isActive', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'id', align: 'right' }
];

// Contadores de perfil
const patientCount = computed(() => allUsers.value.filter((u) => u.roles.includes('PATIENT')).length);
const staffCount = computed(() => allUsers.value.filter((u) => u.roles.includes('STAFF')).length);
const supervisorCount = computed(() => allUsers.value.filter((u) => u.roles.includes('SUPERVISOR')).length);
const adminCount = computed(() => allUsers.value.filter((u) => u.roles.includes('ADMIN')).length);

// Lista filtrada
const filteredUsers = computed(() => {
  return allUsers.value.filter((u) => {
    // Filtro por aba de perfil
    if (selectedRoleTab.value !== 'ALL') {
      if (!u.roles.includes(selectedRoleTab.value as RoleCode)) {
        return false;
      }
    }

    // Filtro por termo de pesquisa
    if (searchTerm.value.trim()) {
      const q = searchTerm.value.toLowerCase().trim();
      const name = (u.fullName || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !email.includes(q)) {
        return false;
      }
    }

    return true;
  });
});

async function loadUsers() {
  loading.value = true;
  try {
    // Tenta carregar utilizadores da API REST do backend
    const res = await apiClient.get('/admin/users');
    if (res.data?.success && Array.isArray(res.data.data)) {
      allUsers.value = res.data.data;
      return;
    }
  } catch {
    // Fallback gracioso para modo Mock / Estático
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      if (stored) {
        const extraUsers: User[] = JSON.parse(stored);
        allUsers.value = [
          ...extraUsers,
          ...mockUsers.filter((mu) => !extraUsers.some((eu) => eu.id === mu.id))
        ];
        return;
      }
    } catch {
      // quota
    }
    allUsers.value = [...mockUsers];
  } finally {
    loading.value = false;
  }
}

function persistUsersLocally() {
  try {
    const extra = allUsers.value.filter((u) => !mockUsers.some((mu) => mu.id === u.id));
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(extra));
  } catch {
    // quota
  }
}

onMounted(async () => {
  await loadUsers();
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

function formatRoleLabel(role: RoleCode): string {
  switch (role) {
    case 'PATIENT': return 'Paciente / Utente';
    case 'STAFF': return 'Colaborador Clínico';
    case 'SUPERVISOR': return 'Supervisão';
    case 'ADMIN': return 'Administrador';
    default: return role;
  }
}

function getRoleColor(role: RoleCode): string {
  switch (role) {
    case 'PATIENT': return 'primary';
    case 'STAFF': return 'teal-8';
    case 'SUPERVISOR': return 'purple-8';
    case 'ADMIN': return 'red-9';
    default: return 'grey';
  }
}

function getRoleAvatarColor(roles: RoleCode[]): string {
  if (roles.includes('ADMIN')) return 'red-9';
  if (roles.includes('SUPERVISOR')) return 'purple-8';
  if (roles.includes('STAFF')) return 'teal-8';
  return 'primary';
}

function openCreateModal() {
  newUserName.value = '';
  newUserPhone.value = '+258 ';
  newUserEmail.value = '';
  newUserRole.value = 'STAFF';
  newUserDepartmentId.value = departments.value[0]?.id || '';
  showCreateModal.value = true;
}

async function handleCreateUser() {
  const payload = {
    fullName: newUserName.value.trim(),
    phone: newUserPhone.value.trim(),
    email: newUserEmail.value ? newUserEmail.value.trim().toLowerCase() : undefined,
    roles: [newUserRole.value],
    departmentId: (newUserRole.value === 'STAFF' || newUserRole.value === 'SUPERVISOR') ? newUserDepartmentId.value : undefined,
    password: '123456'
  };

  try {
    // Tentar gravar no backend MongoDB
    const res = await apiClient.post('/admin/users', payload);
    if (res.data?.success && res.data.data) {
      allUsers.value.unshift(res.data.data);
    }
  } catch {
    // Gravar no mock local
    const newUser: User = {
      id: `user-int-${Date.now()}`,
      hospitalId: 'hosp-001',
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      departmentId: payload.departmentId,
      phoneVerifiedAt: new Date().toISOString(),
      emailVerifiedAt: new Date().toISOString(),
      isActive: true,
      roles: payload.roles as RoleCode[],
      createdAt: new Date().toISOString()
    };
    allUsers.value.unshift(newUser);
    persistUsersLocally();
  }

  showCreateModal.value = false;
  $q.notify({
    type: 'positive',
    message: `Colaborador ${payload.fullName} registado com sucesso!`,
    caption: `Perfil: ${payload.roles[0]} | Palavra-passe inicial: 123456`,
    timeout: 5000
  });
}

async function toggleUserActive(user: User) {
  try {
    const res = await apiClient.patch(`/admin/users/${user.id}/toggle`);
    if (res.data?.success) {
      user.isActive = res.data.data.isActive;
    }
  } catch {
    user.isActive = !user.isActive;
    persistUsersLocally();
  }

  $q.notify({
    type: 'info',
    message: `Conta de ${user.fullName} ${user.isActive ? 'ativada' : 'desativada'}.`
  });
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
.border-b { border-bottom: 1px solid #e2e8f0; }
</style>
