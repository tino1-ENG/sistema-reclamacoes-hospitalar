<template>
  <q-card class="hc-card q-pa-lg">
    <div class="text-center q-mb-lg">
      <q-avatar size="44px" color="primary" text-color="white" class="q-mb-xs">
        <q-icon name="person_add" size="24px" />
      </q-avatar>
      <div class="text-h5 text-weight-bolder text-slate-800">Registo de Paciente</div>
      <div class="text-caption text-slate-500">
        Crie a sua conta para submeter e acompanhar os seus processos
      </div>
    </div>

    <q-form @submit.prevent="handleRegister">
      <q-input
        v-model="fullName"
        label="Nome Completo *"
        placeholder="Ex.: Amélia Graça Mondlane"
        outlined
        dense
        class="q-mb-sm"
        :rules="[(v) => (v && v.length >= 3) || 'Introduza o seu nome completo']"
      >
        <template #prepend><q-icon name="badge" /></template>
      </q-input>

      <q-input
        v-model="phone"
        label="Número de Telefone (Moçambique) *"
        placeholder="+258 84 123 4567"
        outlined
        dense
        class="q-mb-sm"
        :rules="[(v) => (v && v.length >= 9) || 'Introduza um número de contacto válido']"
      >
        <template #prepend><q-icon name="smartphone" /></template>
      </q-input>

      <q-input
        v-model="email"
        label="Email (Opcional)"
        placeholder="exemplo@dominio.mz"
        type="email"
        outlined
        dense
        class="q-mb-sm"
      >
        <template #prepend><q-icon name="email" /></template>
      </q-input>

      <div class="q-mb-sm">
        <label class="text-caption text-weight-medium text-slate-700 q-mb-xs block">
          Canal preferencial de aviso sobre o estado:
        </label>
        <q-select
          v-model="contactChannel"
          :options="contactChannelOptions"
          outlined
          dense
          emit-value
          map-options
        />
      </div>

      <q-input
        v-model="password"
        label="Palavra-passe *"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        class="q-mb-sm"
        :rules="[(v) => (v && v.length >= 6) || 'Mínimo de 6 caracteres']"
      >
        <template #prepend><q-icon name="lock" /></template>
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-input
        v-model="confirmPassword"
        label="Confirmar Palavra-passe *"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        class="q-mb-md"
        :rules="[(v) => v === password || 'As palavras-passe não coincidem']"
      >
        <template #prepend><q-icon name="lock_clock" /></template>
      </q-input>

      <q-checkbox
        v-model="acceptTerms"
        label="Declaro que li e aceito as condições e política de privacidade do HospitalCare"
        dense
        size="sm"
        class="text-caption text-slate-600 q-mb-md"
      />

      <q-btn
        unelevated
        color="primary"
        label="Criar Conta de Utente"
        no-caps
        type="submit"
        :loading="loading"
        :disable="!acceptTerms"
        class="full-width text-weight-bold q-py-sm"
      />
    </q-form>

    <div class="text-center q-mt-lg text-body2 text-slate-600">
      Já tem uma conta?
      <router-link to="/entrar" class="text-primary text-weight-bold q-ml-xs">
        Entrar no Sistema
      </router-link>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const fullName = ref('');
const phone = ref('+258 ');
const email = ref('');
const contactChannel = ref<'IN_APP' | 'SMS' | 'EMAIL'>('IN_APP');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const acceptTerms = ref(false);
const loading = ref(false);

const contactChannelOptions = [
  { label: 'Na aplicação (Notificações do Sistema)', value: 'IN_APP' },
  { label: 'Mensagem SMS para o telemóvel', value: 'SMS' },
  { label: 'Correio eletrónico (Email)', value: 'EMAIL' }
];

async function handleRegister() {
  if (!acceptTerms.value) {
    $q.notify({ type: 'warning', message: 'Deve aceitar os termos de utilização.' });
    return;
  }

  loading.value = true;
  try {
    const user = await authStore.register({
      fullName: fullName.value,
      phone: phone.value,
      ...(email.value.trim() ? { email: email.value.trim() } : {}),
      preferredContactChannel: contactChannel.value,
      password: password.value
    });

    $q.notify({
      type: 'positive',
      message: `Conta criada com sucesso!`,
      caption: `Bem-vindo(a), ${user.fullName}`
    });

    // Encaminha para confirmação de telefone ou direto ao dashboard
    await router.push('/verificar-contacto');
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Erro ao criar conta'
    });
  } finally {
    loading.value = false;
  }
}
</script>
