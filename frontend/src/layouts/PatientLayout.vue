<template>
  <q-layout view="lHh Lpr lff">
    <!-- Cabeçalho do Paciente -->
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

        <q-toolbar-title class="row items-center q-ml-sm cursor-pointer" @click="$router.push('/paciente/dashboard')">
          <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm">
            <q-icon name="local_hospital" size="20px" />
          </q-avatar>
          <div>
            <span class="text-weight-bolder text-primary">HospitalCare</span>
            <span class="text-caption text-grey-6 q-ml-sm gt-xs">Portal do Utente</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <UserMenu />
      </q-toolbar>
    </q-header>

    <!-- Menu Lateral do Paciente -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="260"
    >
      <div class="q-pa-md bg-slate-50 border-b">
        <div class="text-caption text-uppercase text-weight-bold text-slate-500">
          Utente Conectado
        </div>
        <div class="text-subtitle2 text-weight-bold text-primary q-mt-xs">
          {{ authStore.user?.fullName }}
        </div>
        <div class="text-caption text-grey-6 font-size-11">
          {{ authStore.user?.phone }}
        </div>
      </div>

      <q-list class="q-pt-sm">
        <q-item
          clickable
          v-ripple
          to="/paciente/dashboard"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Painel Principal</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/paciente/processos/novo"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="add_circle" color="positive" />
          </q-item-section>
          <q-item-section>Submeter Processo</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/paciente/processos"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="folder_shared" />
          </q-item-section>
          <q-item-section>Os Meus Processos</q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <q-item
          clickable
          v-ripple
          to="/paciente/perfil"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="person_outline" />
          </q-item-section>
          <q-item-section>Dados e Segurança</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/faq"
          target="_blank"
        >
          <q-item-section avatar>
            <q-icon name="help_outline" />
          </q-item-section>
          <q-item-section>Ajuda e FAQ</q-item-section>
          <q-item-section side>
            <q-icon name="open_in_new" size="14px" />
          </q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md text-caption text-grey-5 border-t">
        HospitalCare v1.0 • Maputo, MZ
      </div>
    </q-drawer>

    <!-- Conteúdo da Página -->
    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>

    <!-- Barra de Navegação Inferior Móvel (Ergonomia Mobile-First para Utentes) -->
    <q-footer class="bg-white text-slate-700 border-t lt-md mobile-bottom-bar" elevated>
      <q-tabs
        dense
        no-caps
        active-color="primary"
        indicator-color="primary"
        class="text-grey-7"
        align="justify"
      >
        <q-route-tab to="/paciente/dashboard" icon="home" label="Início" />
        <q-route-tab to="/paciente/processos" icon="folder_shared" label="Processos" />
        <q-route-tab to="/paciente/processos/novo" icon="add_circle" label="Novo" class="text-positive text-weight-bold" />
        <q-route-tab to="/paciente/perfil" icon="person" label="Perfil" />
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
