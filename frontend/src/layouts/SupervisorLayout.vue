<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-white text-slate-700">
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="row items-center q-ml-sm cursor-pointer" @click="$router.push('/supervisor/dashboard')">
          <q-avatar size="32px" color="secondary" text-color="white" class="q-mr-sm">
            <q-icon name="supervisor_account" size="20px" />
          </q-avatar>
          <div>
            <span class="text-weight-bolder text-secondary">HospitalCare</span>
            <span class="text-caption text-grey-6 q-ml-sm gt-xs">Painel de Supervisão</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <UserMenu />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="260"
    >
      <div class="q-pa-md bg-blue-grey-1 border-b">
        <div class="text-caption text-uppercase text-weight-bold text-secondary">
          Supervisão Hospitalar
        </div>
        <div class="text-subtitle2 text-weight-bold text-slate-800 q-mt-xs">
          {{ authStore.user?.fullName }}
        </div>
        <div class="text-caption text-secondary font-size-11">
          Acompanhamento e Qualidade
        </div>
      </div>

      <q-list class="q-pt-sm">
        <q-item
          clickable
          v-ripple
          to="/supervisor/dashboard"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>Painel de Supervisão</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/supervisor/reatribuicao"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="sync_alt" />
          </q-item-section>
          <q-item-section>Reatribuição de Casos</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/supervisor/prazos"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="schedule" />
          </q-item-section>
          <q-item-section>Acompanhamento de Prazos</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/supervisor/relatorios"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="assessment" />
          </q-item-section>
          <q-item-section>Relatórios Operacionais</q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md text-caption text-grey-5 border-t">
        Supervisão Clínica • HCM
      </div>
    </q-drawer>

    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>

    <!-- Barra de Navegação Inferior Móvel para Supervisão -->
    <q-footer class="bg-white text-slate-700 border-t lt-md" elevated>
      <q-tabs
        dense
        no-caps
        active-color="primary"
        indicator-color="primary"
        class="text-grey-7"
        align="justify"
      >
        <q-route-tab to="/supervisor/dashboard" icon="dashboard" label="Painel" />
        <q-route-tab to="/supervisor/reatribuicao" icon="published_with_changes" label="Triagem" />
        <q-route-tab to="/supervisor/prazos" icon="schedule" label="SLA" />
        <q-route-tab to="/supervisor/relatorios" icon="assessment" label="Relatórios" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import UserMenu from '../components/layout/UserMenu.vue';

const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
</script>

<style scoped>
.font-size-11 { font-size: 11px; }
.border-b { border-bottom: 1px solid #e2e8f0; }
.border-t { border-top: 1px solid #e2e8f0; }
</style>
