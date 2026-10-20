<template>
  <q-page class="q-pa-lg max-w-4xl q-mx-auto">
    <div class="hc-section-header q-mb-lg">
      <div class="text-caption text-uppercase text-weight-bold text-primary">CONTA E SEGURANÇA</div>
      <h1 class="hc-title q-mt-xs">Perfil do Utente</h1>
      <p class="hc-subtitle">
        Faça a gestão dos seus dados de contacto e preferências de notificação do HospitalCare.
      </p>
    </div>

    <q-card class="hc-card q-pa-lg q-mb-lg">
      <div class="text-h6 text-weight-bold text-slate-800 q-mb-md">Dados Pessoais</div>

      <q-form @submit.prevent="handleUpdateProfile">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="fullName"
              label="Nome Completo *"
              outlined
              dense
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="phone"
              label="Número de Telefone *"
              outlined
              dense
              hint="Contacto principal para avisos por SMS"
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="email"
              label="Email (Opcional)"
              outlined
              dense
              type="email"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select
              v-model="preferredContact"
              :options="channelOptions"
              label="Canal Preferencial *"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            unelevated
            color="primary"
            label="Guardar Alterações"
            no-caps
            type="submit"
            :loading="saving"
            class="text-weight-bold"
          />
        </div>
      </q-form>
    </q-card>

    <!-- Definições de Segurança -->
    <q-card class="hc-card q-pa-lg">
      <div class="text-h6 text-weight-bold text-slate-800 q-mb-sm">Segurança da Conta</div>
      <div class="text-caption text-slate-500 q-mb-md">
        Atualize a sua palavra-passe de acesso ao HospitalCare.
      </div>

      <q-form @submit.prevent="handleUpdatePassword">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="currentPassword"
              label="Palavra-passe Atual *"
              type="password"
              outlined
              dense
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="newPassword"
              label="Nova Palavra-passe *"
              type="password"
              outlined
              dense
              :rules="[(v) => (v && v.length >= 6) || 'Mínimo de 6 caracteres']"
            />
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            outline
            color="primary"
            label="Atualizar Palavra-passe"
            no-caps
            type="submit"
            :loading="savingPassword"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';

const $q = useQuasar();
const authStore = useAuthStore();

const fullName = ref('');
const phone = ref('');
const email = ref('');
const preferredContact = ref('IN_APP');
const saving = ref(false);

const currentPassword = ref('');
const newPassword = ref('');
const savingPassword = ref(false);

const channelOptions = [
  { label: 'Notificações na Aplicação', value: 'IN_APP' },
  { label: 'SMS no Telemóvel', value: 'SMS' },
  { label: 'Correio Eletrónico (Email)', value: 'EMAIL' }
];

onMounted(() => {
  if (authStore.user) {
    fullName.value = authStore.user.fullName;
    phone.value = authStore.user.phone;
    email.value = authStore.user.email || '';
  }
});

async function handleUpdateProfile() {
  saving.value = true;
  await new Promise((r) => setTimeout(r, 400));
  if (authStore.user) {
    authStore.user.fullName = fullName.value;
    authStore.user.phone = phone.value;
    authStore.user.email = email.value || undefined;
  }
  saving.value = false;
  $q.notify({
    type: 'positive',
    message: 'Perfil atualizado com sucesso!'
  });
}

async function handleUpdatePassword() {
  savingPassword.value = true;
  await new Promise((r) => setTimeout(r, 400));
  savingPassword.value = false;
  currentPassword.value = '';
  newPassword.value = '';
  $q.notify({
    type: 'positive',
    message: 'Palavra-passe alterada com sucesso!'
  });
}
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
</style>
