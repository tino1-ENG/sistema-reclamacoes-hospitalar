<template>
  <q-layout view="lHh Lpr lff">
    <!-- Cabeçalho Administrativo com Efeito Vidro Translúcido -->
    <q-header elevated class="hc-glass text-slate-700">
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="row items-center q-ml-sm cursor-pointer" @click="$router.push('/admin/dashboard')">
          <q-avatar size="34px" class="bg-gradient-primary text-white q-mr-sm shadow-1">
            <q-icon name="admin_panel_settings" size="20px" />
          </q-avatar>
          <div>
            <span class="text-weight-bolder text-hospital-navy">HospitalCare</span>
            <span class="text-caption text-slate-500 q-ml-sm gt-xs">Painel Administrativo</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <UserMenu />
      </q-toolbar>
    </q-header>

    <!-- Menu Lateral Administrativo -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="265"
    >
      <div class="q-pa-md bg-slate-50 border-b">
        <div class="text-caption text-uppercase text-weight-bolder text-hospital-navy">
          Administração Geral
        </div>
        <div class="text-subtitle2 text-weight-bold text-hospital-navy q-mt-xs">
          {{ authStore.user?.fullName }}
        </div>
        <div class="text-caption text-slate-500 font-size-11">
          Acesso Global de Sistema
        </div>
      </div>

      <q-list class="q-pt-sm q-px-sm">
        <q-item
          clickable
          v-ripple
          to="/admin/processos"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Processos e Reclamações</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/dashboard"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Painel de Controlo</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/utilizadores"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Utilizadores e Perfis</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/departamentos"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="corporate_fare" />
          </q-item-section>
          <q-item-section>Departamentos</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/categorias"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>Categorias e Tipos</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/sla"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="timer" />
          </q-item-section>
          <q-item-section>Políticas de Prazos (SLA)</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/faqs"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="quiz" />
          </q-item-section>
          <q-item-section>Perguntas Frequentes (FAQ)</q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <q-item
          clickable
          v-ripple
          to="/admin/auditoria"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>Registos de Auditoria</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/configuracoes"
          active-class="text-primary bg-blue-1 text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Configurações do Hospital</q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md text-caption text-grey-5 border-t">
        Segurança e Auditoria Ativa
      </div>
    </q-drawer>

    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>

    <!-- Barra de Navegação Inferior Móvel para Administrador -->
    <q-footer class="bg-white text-slate-700 border-t lt-md" elevated>
      <q-tabs
        dense
        no-caps
        active-color="primary"
        indicator-color="primary"
        class="text-grey-7"
        align="justify"
      >
        <q-route-tab to="/admin/dashboard" icon="dashboard" label="Painel" />
        <q-route-tab to="/admin/utilizadores" icon="people" label="Usuários" />
        <q-route-tab to="/admin/departamentos" icon="corporate_fare" label="Serviços" />
        <q-route-tab to="/admin/auditoria" icon="receipt_long" label="Auditoria" />
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
