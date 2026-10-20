<template>
  <q-layout view="lHh Lpr lFf" class="bg-slate-100 min-h-screen">
    <q-header flat class="bg-transparent text-slate-700 q-pa-md">
      <q-toolbar>
        <div class="row items-center cursor-pointer" @click="$router.push('/')">
          <q-avatar size="36px" color="primary" text-color="white" class="q-mr-sm">
            <q-icon name="local_hospital" size="22px" />
          </q-avatar>
          <div class="text-weight-bold text-primary text-subtitle1">
            HospitalCare
          </div>
        </div>
        <q-space />
        <q-btn flat no-caps icon="arrow_back" label="Voltar ao início" color="slate-600" to="/" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center q-pa-md">
        <div class="auth-card-container">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Layout de autenticação sem ruído visual
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.auth-card-container {
  width: 100%;
  max-width: 480px;
}
</style>
