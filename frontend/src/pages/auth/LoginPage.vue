<template>
  <q-card class="hc-card q-pa-none overflow-hidden" style="max-width: 480px; width: 100%">
    <!-- Cabeçalho Institucional -->
    <div class="bg-primary text-white q-pa-lg text-center relative-position">
      <q-avatar size="56px" color="white" text-color="primary" class="q-mb-sm shadow-2">
        <q-icon name="local_hospital" size="32px" />
      </q-avatar>
      <div class="text-h5 text-weight-bolder tracking-wide">HospitalCare</div>
      <div class="text-caption text-blue-1">
        Hospital Central de Maputo — Portal de Atendimento
      </div>

      <!-- Botão discreto para contas de demonstração -->
      <q-btn
        flat
        round
        dense
        icon="help_outline"
        color="white"
        class="absolute-top-right q-ma-sm"
        title="Contas de Demonstração"
      >
        <q-tooltip class="bg-slate-800 text-caption">Ver contas de teste rápido</q-tooltip>
        <q-menu anchor="bottom right" self="top right" class="q-pa-sm" style="min-width: 260px">
          <div class="text-caption text-weight-bold text-slate-700 q-mb-xs">
            Preenchimento Rápido (Demo):
          </div>
          <q-list dense separator>
            <q-item clickable v-close-popup @click="applyDemo('PATIENT')">
              <q-item-section avatar>
                <q-icon name="person" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Paciente</q-item-label>
                <q-item-label caption>Maria Tembe (+258 84 912 3456)</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="applyDemo('STAFF')">
              <q-item-section avatar>
                <q-icon name="badge" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Colaborador Clínico</q-item-label>
                <q-item-label caption>carlos.mondlane@hcm.gov.mz</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="applyDemo('SUPERVISOR')">
              <q-item-section avatar>
                <q-icon name="supervisor_account" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Supervisora Triagem</q-item-label>
                <q-item-label caption>ana.bila@hcm.gov.mz</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="applyDemo('ADMIN')">
              <q-item-section avatar>
                <q-icon name="admin_panel_settings" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Administrador</q-item-label>
                <q-item-label caption>rui.nhantumbo@hcm.gov.mz</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Navegação por Abas: Paciente vs Colaborador -->
    <q-tabs
      v-model="loginTab"
      dense
      class="text-grey-7 bg-grey-1"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="patient" icon="person" label="Sou Paciente" no-caps class="text-weight-medium" />
      <q-tab name="staff" icon="badge" label="Colaborador" no-caps class="text-weight-medium" />
    </q-tabs>

    <q-separator />

    <div class="q-pa-lg">
      <q-tab-panels v-model="loginTab" animated class="bg-transparent">
        <!-- PAINEL 1: LOGIN DE PACIENTE (Prioridade: Telemóvel de Moçambique) -->
        <q-tab-panel name="patient" class="q-pa-none">
          <div class="text-caption text-slate-600 q-mb-md">
            Aceda com o seu número de telemóvel para consultar ou criar reclamações e esclarecimentos.
          </div>

          <q-form @submit.prevent="handleLogin('PATIENT')">
            <q-input
              v-model="patientPhone"
              label="Número de Telemóvel *"
              placeholder="84 123 4567"
              outlined
              dense
              prefix="+258 "
              mask="## ### ####"
              unmasked-value
              class="q-mb-sm"
              :rules="[
                (v) => !!v || 'Introduza o seu número de telemóvel',
                (v) => (v && v.length === 9) || 'O número deve ter 9 dígitos (ex: 84 123 4567)'
              ]"
            >
              <template #prepend>
                <q-icon name="smartphone" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="patientPassword"
              label="Palavra-passe ou PIN *"
              :type="showPatientPassword ? 'text' : 'password'"
              outlined
              dense
              class="q-mb-xs"
              :rules="[(v) => !!v || 'Introduza a sua palavra-passe ou PIN']"
            >
              <template #prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template #append>
                <q-icon
                  :name="showPatientPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPatientPassword = !showPatientPassword"
                />
              </template>
            </q-input>

            <div class="row justify-between items-center q-mb-md">
              <q-checkbox
                v-model="rememberMe"
                label="Lembrar neste telemóvel"
                dense
                size="sm"
                class="text-caption text-slate-600"
              />
              <router-link to="/recuperar-senha" class="text-caption text-primary text-weight-medium">
                Esqueceu o PIN/Senha?
              </router-link>
            </div>

            <q-btn
              unelevated
              color="primary"
              label="Entrar como Paciente"
              no-caps
              type="submit"
              :loading="loading"
              class="full-width text-weight-bold q-py-sm shadow-1"
            />
          </q-form>

          <div class="q-mt-md text-center">
            <span class="text-caption text-slate-600">Ainda não tem conta?</span>
            <router-link to="/registar" class="text-caption text-primary text-weight-bold q-ml-xs">
              Registar Nova Conta
            </router-link>
          </div>
        </q-tab-panel>

        <!-- PAINEL 2: LOGIN DE COLABORADOR / GESTÃO (Email Institucional) -->
        <q-tab-panel name="staff" class="q-pa-none">
          <div class="text-caption text-slate-600 q-mb-md">
            Área restrita a médicos, enfermeiros, supervisores e equipa de gestão do hospital.
          </div>

          <q-form @submit.prevent="handleLogin('STAFF')">
            <q-input
              v-model="staffEmail"
              label="Email Institucional ou Utilizador *"
              placeholder="nome@hcm.gov.mz"
              outlined
              dense
              type="email"
              class="q-mb-sm"
              :rules="[(v) => !!v || 'Introduza o email institucional']"
            >
              <template #prepend>
                <q-icon name="badge" color="teal" />
              </template>
            </q-input>

            <q-input
              v-model="staffPassword"
              label="Palavra-passe de Acesso *"
              :type="showStaffPassword ? 'text' : 'password'"
              outlined
              dense
              class="q-mb-xs"
              :rules="[(v) => !!v || 'Introduza a sua palavra-passe corporativa']"
            >
              <template #prepend>
                <q-icon name="lock_outline" color="teal" />
              </template>
              <template #append>
                <q-icon
                  :name="showStaffPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showStaffPassword = !showStaffPassword"
                />
              </template>
            </q-input>

            <div class="row justify-between items-center q-mb-md">
              <q-checkbox
                v-model="rememberMe"
                label="Manter sessão ativa"
                dense
                size="sm"
                class="text-caption text-slate-600"
              />
              <router-link to="/recuperar-senha" class="text-caption text-teal-8 text-weight-medium">
                Recuperar Acesso
              </router-link>
            </div>

            <q-btn
              unelevated
              color="teal-8"
              label="Autenticar na Intranet Hospitalar"
              no-caps
              type="submit"
              :loading="loading"
              class="full-width text-weight-bold q-py-sm shadow-1"
            />
          </q-form>

          <div class="q-mt-md text-caption text-center text-slate-500">
            Acesso monitorizado e auditado. As contas internas são atribuídas pela Direção do Hospital.
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Cartão Inferior: Consulta Rápida de Processo sem Login -->
      <div class="q-mt-lg q-pa-sm bg-slate-50 rounded-borders text-center border-slate-200">
        <div class="text-caption text-weight-medium text-slate-700">
          Quer apenas consultar um processo existente?
        </div>
        <q-btn
          flat
          dense
          color="primary"
          label="Consultar com Código e PIN"
          icon="search"
          no-caps
          size="sm"
          class="q-mt-xs"
          to="/"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import type { RoleCode } from '../../types';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const loginTab = ref<'patient' | 'staff'>('patient');
const rememberMe = ref(true);
const loading = ref(false);

// Paciente
const patientPhone = ref('849123456');
const patientPassword = ref('123456');
const showPatientPassword = ref(false);

// Staff / Gestão
const staffEmail = ref('carlos.mondlane@hcm.gov.mz');
const staffPassword = ref('123456');
const showStaffPassword = ref(false);

function applyDemo(role: RoleCode) {
  if (role === 'PATIENT') {
    loginTab.value = 'patient';
    patientPhone.value = '849123456';
    patientPassword.value = '123456';
  } else {
    loginTab.value = 'staff';
    staffPassword.value = '123456';
    if (role === 'STAFF') {
      staffEmail.value = 'carlos.mondlane@hcm.gov.mz';
    } else if (role === 'SUPERVISOR') {
      staffEmail.value = 'ana.bila@hcm.gov.mz';
    } else if (role === 'ADMIN') {
      staffEmail.value = 'rui.nhantumbo@hcm.gov.mz';
    }
  }

  $q.notify({
    type: 'info',
    message: `Dados da conta demo (${role}) pré-carregados!`,
    timeout: 2000
  });
}

async function handleLogin(target: 'PATIENT' | 'STAFF') {
  loading.value = true;
  try {
    let identifier = '';
    let password = '';
    let roleHint: RoleCode = 'PATIENT';

    if (target === 'PATIENT') {
      identifier = `+258 ${patientPhone.value}`;
      password = patientPassword.value;
      roleHint = 'PATIENT';
    } else {
      identifier = staffEmail.value;
      password = staffPassword.value;
      // Inferir perfil demo
      if (staffEmail.value.includes('admin') || staffEmail.value.includes('nhantumbo')) {
        roleHint = 'ADMIN';
      } else if (staffEmail.value.includes('ana') || staffEmail.value.includes('supervisor')) {
        roleHint = 'SUPERVISOR';
      } else {
        roleHint = 'STAFF';
      }
    }

    const user = await authStore.login({
      identifier,
      password,
      roleHint
    });

    $q.notify({
      type: 'positive',
      message: `Bem-vindo(a), ${user.fullName}!`,
      caption: 'Autenticação realizada com sucesso.'
    });

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
      message: err instanceof Error ? err.message : 'Falha na autenticação'
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.border-slate-200 {
  border: 1px solid #e2e8f0;
}
.tracking-wide {
  letter-spacing: 0.025em;
}
</style>
