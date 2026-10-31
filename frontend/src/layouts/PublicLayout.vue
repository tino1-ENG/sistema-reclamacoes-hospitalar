<template>
  <q-layout view="lHh Lpr lff">
    <!-- Cabeçalho Público com Efeito Vidro Translúcido -->
    <q-header elevated class="hc-glass text-slate-700">
      <q-toolbar class="q-px-md q-py-sm">
        <div class="row items-center cursor-pointer" @click="$router.push('/')">
          <q-avatar size="38px" class="bg-gradient-primary text-white q-mr-sm shadow-1">
            <q-icon name="local_hospital" size="22px" />
          </q-avatar>
          <div>
            <div class="text-weight-bolder text-hospital-navy text-subtitle1 leading-none">
              HospitalCare
            </div>
            <div class="text-caption text-slate-500 font-size-11">
              República de Moçambique
            </div>
          </div>
        </div>

        <q-space />

        <!-- Links de Navegação Pública -->
        <div class="gt-sm row items-center q-gutter-x-sm">
          <router-link
            to="/"
            class="nav-tab-link"
            :class="{ 'is-active': $route.path === '/' }"
          >
            Início
          </router-link>
          <router-link
            to="/sobre"
            class="nav-tab-link"
            :class="{ 'is-active': $route.path === '/sobre' }"
          >
            Sobre
          </router-link>
          <router-link
            to="/faq"
            class="nav-tab-link"
            :class="{ 'is-active': $route.path === '/faq' }"
          >
            Perguntas Frequentes
          </router-link>
          <router-link
            to="/contactos"
            class="nav-tab-link"
            :class="{ 'is-active': $route.path === '/contactos' }"
          >
            Contactos
          </router-link>
        </div>

        <div class="q-ml-md row items-center q-gutter-x-sm">
          <template v-if="!authStore.isAuthenticated">
            <q-btn flat rounded no-caps color="primary" label="Entrar" to="/entrar" class="text-weight-bold" />
            <q-btn unelevated rounded no-caps class="bg-gradient-primary text-white text-weight-bold q-px-md shadow-2" label="Registar Paciente" to="/registar" />
          </template>
          <template v-else>
            <UserMenu />
          </template>
        </div>

        <!-- Botão Menu Mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md q-ml-sm"
          @click="mobileDrawerOpen = !mobileDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <!-- Menu Lateral Mobile -->
    <q-drawer v-model="mobileDrawerOpen" side="left" bordered overlay class="bg-white lt-md">
      <q-list class="q-pt-md">
        <q-item-label header class="text-weight-bold text-hospital-navy">Navegação</q-item-label>
        <q-item clickable v-ripple to="/" @click="mobileDrawerOpen = false">
          <q-item-section avatar><q-icon name="home" color="primary" /></q-item-section>
          <q-item-section>Início</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/sobre" @click="mobileDrawerOpen = false">
          <q-item-section avatar><q-icon name="info" color="primary" /></q-item-section>
          <q-item-section>Sobre o HospitalCare</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/faq" @click="mobileDrawerOpen = false">
          <q-item-section avatar><q-icon name="help" color="primary" /></q-item-section>
          <q-item-section>Perguntas Frequentes</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/contactos" @click="mobileDrawerOpen = false">
          <q-item-section avatar><q-icon name="phone" color="primary" /></q-item-section>
          <q-item-section>Contactos</q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />
        <q-item clickable v-ripple to="/entrar" @click="mobileDrawerOpen = false">
          <q-item-section avatar><q-icon name="login" color="primary" /></q-item-section>
          <q-item-section class="text-primary text-weight-bold">Aceder à Conta</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Conteúdo da Página -->
    <q-page-container class="bg-slate-50">
      <router-view />
    </q-page-container>

    <!-- Barra de Navegação Inferior Móvel (Ergonomia Mobile para Visitantes) -->
    <div class="mobile-bottom-nav lt-md">
      <q-tabs
        dense
        no-caps
        active-color="primary"
        indicator-color="primary"
        class="text-grey-7"
        align="justify"
      >
        <q-route-tab to="/" icon="home" label="Início" />
        <q-route-tab to="/sobre" icon="info" label="Sobre" />
        <q-route-tab to="/paciente/processos/novo" icon="add_circle" label="Submeter" class="text-positive text-weight-bold" />
        <q-route-tab to="/faq" icon="help_outline" label="FAQ" />
        <q-route-tab
          :to="authStore.isAuthenticated ? '/paciente/dashboard' : '/entrar'"
          :icon="authStore.isAuthenticated ? 'account_circle' : 'login'"
          :label="authStore.isAuthenticated ? 'Conta' : 'Entrar'"
        />
      </q-tabs>
    </div>

    <!-- Rodapé Público -->
    <q-footer class="bg-slate-900 text-white q-py-lg">
      <div class="q-px-lg max-w-6xl q-mx-auto">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-5">
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" class="bg-gradient-primary text-white q-mr-sm">
                <q-icon name="local_hospital" size="20px" />
              </q-avatar>
              <span class="text-h6 text-weight-bold">HospitalCare</span>
            </div>
            <p class="text-body2 text-grey-4 q-mb-none">
              Plataforma digital para gestão de reclamações, sugestões e pedidos de esclarecimento hospitalar. Promovendo transparência, dignidade e excelência nos cuidados de saúde em Moçambique.
            </p>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-subtitle2 text-weight-bold q-mb-sm text-grey-2">Links Rápidos</div>
            <div class="column q-gutter-y-xs">
              <router-link to="/sobre" class="text-caption text-grey-4 text-decoration-none hover-white">Apresentação</router-link>
              <router-link to="/faq" class="text-caption text-grey-4 text-decoration-none hover-white">Perguntas Frequentes</router-link>
              <router-link to="/contactos" class="text-caption text-grey-4 text-decoration-none hover-white">Contactos e Horários</router-link>
              <router-link to="/entrar" class="text-caption text-grey-4 text-decoration-none hover-white">Área do Utente</router-link>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="text-subtitle2 text-weight-bold q-mb-sm text-grey-2">Hospital Piloto</div>
            <div class="text-caption text-grey-4">
              <div>Hospital Central de Maputo</div>
              <div>Av. Eduardo Mondlane, nº 1500</div>
              <div>Maputo — Moçambique</div>
              <div class="q-mt-xs">Linha Verde: +258 21 350 400</div>
            </div>
          </div>
        </div>
        <q-separator color="grey-8" class="q-my-md" />
        <div class="row justify-between items-center text-caption text-grey-5">
          <div>© {{ new Date().getFullYear() }} HospitalCare. Todos os direitos reservados.</div>
          <div>Fuso horário: Africa/Maputo (GMT+2)</div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import UserMenu from '../components/layout/UserMenu.vue';

const authStore = useAuthStore();
const mobileDrawerOpen = ref(false);
</script>

<style scoped>
.leading-none { line-height: 1.1; }
.font-size-11 { font-size: 11px; }
.max-w-6xl { max-width: 1200px; }
.text-decoration-none { text-decoration: none; }
.hover-white:hover { color: #ffffff !important; }
.bg-slate-900 { background-color: #0b1120; }

.nav-tab-link {
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  color: #475569;
  padding: 8px 16px;
  position: relative;
  transition: all 0.25s ease;
  display: inline-block;
  border-radius: 8px;
}

.nav-tab-link:hover {
  color: #0284c7;
  background-color: rgba(2, 132, 199, 0.08);
}

.nav-tab-link.is-active {
  color: #0284c7;
  font-weight: 700;
}

.nav-tab-link.is-active::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 16px;
  right: 16px;
  height: 3px;
  background: linear-gradient(90deg, #0284c7 0%, #10b981 100%);
  border-radius: 9999px;
}
</style>
