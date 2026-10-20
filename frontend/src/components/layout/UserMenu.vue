<template>
  <div class="row items-center q-gutter-sm">
    <!-- Indicador Oficial do Perfil Atual (Apenas Leitura, Sem Acesso a Outras Contas) -->
    <div
      class="role-indicator-badge row items-center q-px-sm q-py-xs rounded-borders text-caption text-weight-bold"
      :class="`role-badge-${authStore.primaryRole?.toLowerCase() || 'patient'}`"
    >
      <q-icon :name="roleIcon" size="16px" class="q-mr-xs" />
      <span>{{ roleLabel }}</span>
    </div>

    <!-- Notificações -->
    <q-btn flat round dense icon="notifications" color="slate-700">
      <q-badge v-if="unreadCount > 0" color="negative" floating rounded>
        {{ unreadCount }}
      </q-badge>
      <q-menu anchor="bottom right" self="top right" style="width: 320px">
        <q-card flat class="q-pa-none">
          <q-card-section class="row items-center justify-between q-py-sm bg-slate-50 border-b">
            <span class="text-subtitle2 text-weight-bold">Notificações</span>
            <q-btn
              v-if="unreadCount > 0"
              flat
              dense
              no-caps
              label="Marcar todas"
              class="text-caption text-primary"
              @click="markAllRead"
            />
          </q-card-section>
          <q-list separator>
            <q-item
              v-for="notif in notifications.slice(0, 4)"
              :key="notif.id"
              :class="{ 'bg-blue-1': !notif.readAt }"
              clickable
              @click="onNotificationClick(notif.id)"
            >
              <q-item-section avatar>
                <q-icon name="info" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-caption">{{ notif.title }}</q-item-label>
                <q-item-label caption lines="2">{{ notif.body }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!notifications.length">
              <q-item-section class="text-center text-caption text-grey-6 q-pa-md">
                Sem notificações no momento
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-menu>
    </q-btn>

    <!-- Avatar e Nome do Utilizador -->
    <q-btn flat no-caps class="q-pa-xs">
      <q-avatar size="32px" color="primary" text-color="white" class="text-weight-bold">
        {{ initials }}
      </q-avatar>
      <div class="q-ml-sm text-left gt-xs">
        <div class="text-caption text-weight-bold text-slate-700 leading-none">
          {{ user?.fullName || 'Utilizador' }}
        </div>
        <div class="text-grey-6 font-size-11">{{ user?.phone }}</div>
      </div>
      <q-icon name="arrow_drop_down" size="18px" color="grey-7" />

      <q-menu anchor="bottom right" self="top right">
        <q-list style="min-width: 180px">
          <q-item clickable v-close-popup :to="profileRoute">
            <q-item-section avatar>
              <q-icon name="person" size="20px" />
            </q-item-section>
            <q-item-section>O Meu Perfil</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" size="20px" />
            </q-item-section>
            <q-item-section class="text-negative">Terminar Sessão</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { useNotificationStore } from '../../stores/notification.store';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const user = computed(() => authStore.user);
const unreadCount = computed(() => notificationStore.unreadCount);
const notifications = computed(() => notificationStore.notifications);

const initials = computed(() => {
  if (!user.value?.fullName) return 'HC';
  const parts = user.value.fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'HC';
  const first = parts[0] ?? '';
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] ?? '';
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase();
});

const roleLabel = computed(() => {
  switch (authStore.primaryRole) {
    case 'PATIENT':
      return 'Paciente';
    case 'STAFF':
      return 'Funcionário';
    case 'SUPERVISOR':
      return 'Supervisor';
    case 'ADMIN':
      return 'Administrador';
    default:
      return 'Perfil';
  }
});

const roleIcon = computed(() => {
  switch (authStore.primaryRole) {
    case 'PATIENT':
      return 'person';
    case 'STAFF':
      return 'badge';
    case 'SUPERVISOR':
      return 'supervisor_account';
    case 'ADMIN':
      return 'admin_panel_settings';
    default:
      return 'account_circle';
  }
});

const profileRoute = computed(() => {
  switch (authStore.primaryRole) {
    case 'PATIENT':
      return '/paciente/perfil';
    default:
      return '/';
  }
});

onMounted(async () => {
  if (!authStore.user) {
    await authStore.init();
  }
  if (authStore.user) {
    await notificationStore.loadUserNotifications(authStore.user.id);
  }
});

async function markAllRead() {
  if (authStore.user) {
    await notificationStore.markAllAsRead(authStore.user.id);
  }
}

async function onNotificationClick(id: string) {
  await notificationStore.markAsRead(id);
}

async function handleLogout() {
  await authStore.logout();
  $q.notify({
    type: 'info',
    message: 'Sessão terminada com sucesso'
  });
  await router.push('/entrar');
}
</script>

<style scoped>
.font-size-11 {
  font-size: 11px;
}
.leading-none {
  line-height: 1.2;
}

.role-indicator-badge {
  font-size: 12px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  letter-spacing: 0.02em;
}

.role-badge-patient {
  background-color: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

.role-badge-staff {
  background-color: #f0fdf4;
  color: #15803d;
  border-color: #bbf7d0;
}

.role-badge-supervisor {
  background-color: #f0f9ff;
  color: #0369a1;
  border-color: #bae6fd;
}

.role-badge-admin {
  background-color: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}
</style>
