<template>
  <q-card class="hc-card q-pa-none overflow-hidden" style="max-width: 460px; width: 100%">
    <!-- Cabeçalho Institucional Oficial -->
    <div class="bg-gradient-primary text-white q-pa-lg text-center relative-position">
      <q-avatar size="54px" color="white" text-color="primary" class="q-mb-sm shadow-2">
        <q-icon name="local_hospital" size="30px" />
      </q-avatar>
      <div class="text-h5 text-weight-bolder tracking-wide">HospitalCare</div>
      <div class="text-caption text-blue-1">
        Hospital Central de Maputo — Acesso Unificado
      </div>
    </div>

    <!-- Formulário Real de Autenticação Unificada -->
    <div class="q-pa-lg">
      <div class="text-subtitle1 text-weight-bold text-slate-800 q-mb-xs">
        Iniciar Sessão
      </div>
      <div class="text-caption text-slate-600 q-mb-lg">
        Introduza os seus dados de acesso (email institucional ou número de telemóvel).
      </div>

      <q-form @submit.prevent="handleUnifiedLogin">
        <!-- Campo Único: Email ou Telemóvel -->
        <div class="q-mb-md">
          <label class="text-caption text-weight-bold text-slate-700 block q-mb-xs">
            Email ou Telemóvel *
          </label>
          <q-input
            v-model="identifier"
            placeholder="ex.: nome@hcm.gov.mz ou 84 123 4567"
            outlined
            dense
            autocomplete="username"
            :rules="[(v) => (v && v.trim().length > 0) || 'Introduza o seu email ou telemóvel']"
          >
            <template #prepend>
              <q-icon name="person_outline" color="primary" />
            </template>
          </q-input>
        </div>

        <!-- Palavra-passe -->
        <div class="q-mb-sm">
          <div class="row justify-between items-center q-mb-xs">
            <label class="text-caption text-weight-bold text-slate-700">
              Palavra-passe *
            </label>
            <router-link to="/recuperar-senha" class="text-caption text-primary text-weight-medium">
              Esqueceu a senha?
            </router-link>
          </div>
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            outlined
            dense
            autocomplete="current-password"
            :rules="[(v) => (v && v.trim().length > 0) || 'Introduza a sua palavra-passe']"
          >
            <template #prepend>
              <q-icon name="lock_outline" color="primary" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>

        <div class="q-mb-lg">
          <q-checkbox
            v-model="rememberMe"
            label="Manter sessão iniciada"
            dense
            size="sm"
            class="text-caption text-slate-600"
          />
        </div>

        <q-btn
          unelevated
          rounded
          no-caps
          type="submit"
          :loading="loading"
          class="full-width bg-gradient-primary text-white text-weight-bold q-py-sm shadow-2"
          label="Entrar no Sistema"
          icon-right="login"
        />
      </q-form>

      <q-separator class="q-my-lg" />

      <!-- Acesso de Cidadão / Paciente -->
      <div class="text-center q-mb-md">
        <span class="text-caption text-slate-600">É utente e ainda não tem conta?</span>
        <router-link to="/registar" class="text-caption text-primary text-weight-bold q-ml-xs">
          Registar Conta de Paciente
        </router-link>
      </div>

      <!-- Aviso Institucional de Governação -->
      <div class="q-pa-sm bg-blue-grey-1 rounded-borders text-center border-slate-200 q-mb-sm">
        <div class="text-caption text-slate-600" style="font-size: 11px">
          <q-icon name="shield" size="14px" class="q-mr-xs text-primary" />
          As credenciais de médicos, enfermeiros e administração são emitidas exclusivamente pela Direção do Hospital.
        </div>
      </div>

      <!-- Consulta Rápida por Código/PIN sem Login -->
      <div class="text-center q-mt-sm">
        <q-btn
          flat
          dense
          color="slate-7"
          label="Acompanhar processo com Código e PIN"
          icon="search"
          no-caps
          size="sm"
          to="/"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

// Campos limpos — sem preenchimento automático
const identifier = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);
const loading = ref(false);

async function handleUnifiedLogin() {
  if (!identifier.value || !password.value) {
    $q.notify({
      type: 'warning',
      message: 'Preencha o identificador e a palavra-passe.'
    });
    return;
  }

  loading.value = true;
  try {
    const user = await authStore.login({
      identifier: identifier.value.trim(),
      password: password.value
    });

    $q.notify({
      type: 'positive',
      message: `Bem-vindo(a), ${user.fullName}!`,
      caption: 'Autenticação validada com sucesso.'
    });

    // Se houver redirect pendente na URL (ex.: ?redirect=/admin/utilizadores)
    const redirectUrl = route.query.redirect as string;
    if (redirectUrl) {
      await router.push(redirectUrl);
      return;
    }

    // Encaminhamento Automático Baseado no Perfil Real da Base de Dados
    if (user.roles.includes('ADMIN')) {
      await router.push('/admin/dashboard');
    } else if (user.roles.includes('SUPERVISOR')) {
      await router.push('/supervisor/dashboard');
    } else if (user.roles.includes('STAFF')) {
      await router.push('/funcionario/dashboard');
    } else {
      await router.push('/paciente/dashboard');
    }
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Credenciais inválidas. Verifique os dados de acesso.',
      icon: 'error_outline',
      timeout: 4500
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 0.05em;
}
</style>
