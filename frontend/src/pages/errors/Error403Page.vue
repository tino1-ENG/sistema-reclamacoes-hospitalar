<template>
  <div class="fullscreen bg-slate-100 text-slate-800 text-center q-pa-md flex flex-center">
    <div style="max-width: 500px">
      <q-avatar size="96px" color="red-1" text-color="negative" class="q-mb-md">
        <q-icon name="lock" size="56px" />
      </q-avatar>
      <div class="text-h4 text-weight-bold q-my-md text-slate-700">
        Acesso Não Autorizado
      </div>
      <p class="text-body1 text-slate-500 q-mb-xl">
        A sua conta atual não possui as permissões necessárias para visualizar este recurso hospitalar. Caso necessite de acesso, solicite autorização à administração do HospitalCare.
      </p>
      <div class="row justify-center q-gutter-sm">
        <q-btn
          outline
          color="slate-600"
          no-caps
          label="Voltar Atrás"
          @click="$router.go(-1)"
        />
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="home"
          label="Página Inicial"
          to="/"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Página 403 Não Autorizado
</script>
