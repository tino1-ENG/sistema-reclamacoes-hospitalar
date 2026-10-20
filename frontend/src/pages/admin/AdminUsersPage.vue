<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Gestão de Utilizadores
        </h1>
        <div class="text-body2 text-slate-500">
          Contas hospitalares internas, perfis de autorização e estado de ativação.
        </div>
      </div>

      <q-btn
        unelevated
        color="red-9"
        icon="person_add"
        label="Criar Utilizador Interno"
        no-caps
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
            <div class="text-caption text-slate-500">{{ props.row.email || 'Sem email' }}</div>
          </q-td>
        </template>

        <template #body-cell-roles="props">
          <q-td :props="props">
            <q-badge
              v-for="r in props.row.roles"
              :key="r"
              :color="getRoleColor(r)"
              class="q-mr-xs"
            >
              {{ r }}
            </q-badge>
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
      <q-card class="hc-card q-pa-lg" style="min-width: 440px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
          Novo Utilizador Hospitalar
        </div>
        <div class="text-caption text-slate-500 q-mb-md">
          Apenas perfis autorizados (STAFF, SUPERVISOR, ADMIN).
        </div>

        <q-form @submit.prevent="handleCreateUser">
          <q-input
            v-model="newUserName"
            label="Nome Completo *"
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
            label="Email Institucional"
            type="email"
            outlined
            dense
            class="q-mb-sm"
          />

          <q-select
            v-model="newUserRole"
            :options="internalRoleOptions"
            label="Perfil de Acesso *"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-lg"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              unelevated
              no-caps
              label="Registar Utilizador"
              color="red-9"
              type="submit"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { mockUsers } from '../../services/mock/mock-data';
import type { User, RoleCode } from '../../types';

const $q = useQuasar();

const users = ref<User[]>([...mockUsers]);
const showCreateModal = ref(false);

const newUserName = ref('');
const newUserPhone = ref('+258 ');
const newUserEmail = ref('');
const newUserRole = ref<RoleCode>('STAFF');

const internalRoleOptions = [
  { label: 'STAFF (Colaborador Técnico)', value: 'STAFF' },
  { label: 'SUPERVISOR (Supervisão Clínica)', value: 'SUPERVISOR' },
  { label: 'ADMIN (Administrador Geral)', value: 'ADMIN' }
];

const columns: QTableColumn[] = [
  { name: 'fullName', label: 'Nome / Contacto', field: 'fullName', align: 'left', sortable: true },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' },
  { name: 'roles', label: 'Perfis', field: 'roles', align: 'left' },
  { name: 'isActive', label: 'Estado', field: 'isActive', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'id', align: 'right' }
];

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
  showCreateModal.value = true;
}

function handleCreateUser() {
  const newUser: User = {
    id: `user-int-${Date.now()}`,
    hospitalId: 'hosp-001',
    fullName: newUserName.value,
    phone: newUserPhone.value,
    email: newUserEmail.value || undefined,
    phoneVerifiedAt: new Date().toISOString(),
    emailVerifiedAt: new Date().toISOString(),
    isActive: true,
    roles: [newUserRole.value],
    createdAt: new Date().toISOString()
  };
  users.value.unshift(newUser);
  showCreateModal.value = false;
  $q.notify({
    type: 'positive',
    message: `Conta criada com sucesso para ${newUser.fullName}!`
  });
}

function toggleUserActive(user: User) {
  user.isActive = !user.isActive;
  $q.notify({
    type: 'info',
    message: `Conta de ${user.fullName} ${user.isActive ? 'ativada' : 'desativada'}.`
  });
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
