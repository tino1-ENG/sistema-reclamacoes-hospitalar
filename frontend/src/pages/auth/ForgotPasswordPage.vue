<template>
  <q-card class="hc-card q-pa-lg">
    <div class="text-center q-mb-lg">
      <q-avatar size="44px" color="primary" text-color="white" class="q-mb-xs">
        <q-icon name="lock_reset" size="24px" />
      </q-avatar>
      <div class="text-h5 text-weight-bolder text-slate-800">Recuperar Palavra-passe</div>
      <div class="text-caption text-slate-500">
        Introduza o telefone ou email associado à sua conta
      </div>
    </div>

    <div v-if="submitted" class="q-pa-md bg-green-1 rounded-borders text-center q-mb-md">
      <q-icon name="check_circle" color="positive" size="36px" class="q-mb-xs" />
      <div class="text-subtitle2 text-weight-bold text-slate-800">Instruções Enviadas!</div>
      <div class="text-caption text-slate-600 q-mt-xs">
        Se o contacto estiver registado, enviámos um código ou ligação segura para redefinir a sua palavra-passe.
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Ir para Redefinição"
        no-caps
        class="q-mt-md"
        to="/redefinir-senha"
      />
    </div>

    <q-form v-else @submit.prevent="handleSubmit">
      <q-input
        v-model="identifier"
        label="Telefone ou Email *"
        placeholder="+258 84 123 4567"
        outlined
        dense
        class="q-mb-md"
        :rules="[(v) => !!v || 'Campo obrigatório']"
      >
        <template #prepend><q-icon name="contact_phone" /></template>
      </q-input>

      <q-btn
        unelevated
        color="primary"
        label="Enviar Instruções de Recuperação"
        no-caps
        type="submit"
        :loading="loading"
        class="full-width text-weight-bold q-py-sm"
      />
    </q-form>

    <div class="text-center q-mt-lg text-body2">
      <router-link to="/entrar" class="text-primary text-weight-medium">
        ← Voltar à página de entrada
      </router-link>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '../../services';

const identifier = ref('');
const loading = ref(false);
const submitted = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await authService.sendPasswordReset(identifier.value);
    submitted.value = true;
  } finally {
    loading.value = false;
  }
}
</script>
