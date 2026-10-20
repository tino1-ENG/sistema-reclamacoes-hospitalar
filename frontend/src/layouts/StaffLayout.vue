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

        <q-toolbar-title class="row items-center q-ml-sm cursor-pointer" @click="$router.push('/funcionario/dashboard')">
          <q-avatar size="32px" color="accent" text-color="white" class="q-mr-sm">
            <q-icon name="local_hospital" size="20px" />
          </q-avatar>
          <div>
            <span class="text-weight-bolder text-primary">HospitalCare</span>
            <span class="text-caption text-grey-6 q-ml-sm gt-xs">Painel Operacional</span>
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
      <div class="q-pa-md bg-green-1 border-b">
        <div class="text-caption text-uppercase text-weight-bold text-accent">
          Colaborador em Serviço
        </div>
        <div class="text-subtitle2 text-weight-bold text-slate-800 q-mt-xs">
          {{ authStore.user?.fullName }}
        </div>
        <div class="text-caption text-slate-600 font-size-11">
          Urgências e Triagem
        </div>
      </div>

      <q-list class="q-pt-sm">
        <q-item
          clickable
          v-ripple
          to="/funcionario/dashboard"
          active-class="text-accent bg-green-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Painel Operacional</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/funcionario/processos"
          active-class="text-accent bg-green-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Processos Atribuídos</q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md text-caption text-grey-5 border-t">
        Área Técnica • HCM
      </div>
    </q-drawer>

    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>

    <!-- Barra de Navegação Inferior Móvel para Colaboradores -->
    <q-footer class="bg-white text-slate-700 border-t lt-md" elevated>
      <q-tabs
        dense
        no-caps
        active-color="accent"
        indicator-color="accent"
        class="text-grey-7"
        align="justify"
      >
        <q-route-tab to="/funcionario/dashboard" icon="dashboard" label="Painel" />
        <q-route-tab to="/funcionario/processos" icon="assignment" label="Atribuídos" />
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
