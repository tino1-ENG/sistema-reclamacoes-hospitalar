<template>
  <q-card class="hc-card q-pa-lg">
    <div class="text-center q-mb-lg">
      <q-avatar size="44px" color="primary" text-color="white" class="q-mb-xs">
        <q-icon name="sms" size="24px" />
      </q-avatar>
      <div class="text-h5 text-weight-bolder text-slate-800">Verificação de Contacto</div>
      <div class="text-caption text-slate-500">
        Introduza o código de 6 dígitos enviado por SMS para o seu telemóvel
      </div>
    </div>

    <div class="q-pa-sm bg-blue-1 rounded-borders text-caption text-primary text-center q-mb-md">
      Ambiente de Testes: utilize o código <strong>123456</strong> para validar.
    </div>

    <q-form @submit.prevent="handleVerify">
      <q-input
        v-model="code"
        label="Código de Verificação (6 dígitos) *"
        placeholder="123456"
        maxlength="6"
        outlined
        dense
        class="q-mb-md text-center text-h6"
        :rules="[(v) => (v && v.length === 6) || 'O código deve ter exatamente 6 dígitos']"
      >
        <template #prepend><q-icon name="pin" /></template>
      </q-input>

      <q-btn
        unelevated
        color="primary"
        label="Confirmar Contacto"
        no-caps
        type="submit"
        :loading="loading"
        class="full-width text-weight-bold q-py-sm"
      />
    </q-form>

    <div class="row justify-between items-center q-mt-lg text-body2">
      <q-btn
        flat
        dense
        no-caps
        size="sm"
        color="primary"
        label="Reenviar código SMS"
        :disable="countdown > 0"
        @click="resendCode"
      />
      <span v-if="countdown > 0" class="text-caption text-slate-400">
        ({{ countdown }}s)
      </span>
      <router-link to="/paciente/dashboard" class="text-caption text-slate-500">
        Confirmar mais tarde →
      </router-link>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { authService } from '../../services';

const router = useRouter();
const $q = useQuasar();

const code = ref('123456');
const loading = ref(false);
const countdown = ref(60);

async function handleVerify() {
  loading.value = true;
  try {
    const ok = await authService.verifyPhone(code.value);
    if (ok) {
      $q.notify({
        type: 'positive',
        message: 'Contacto telefónico confirmado com sucesso!'
      });
      await router.push('/paciente/dashboard');
    } else {
      $q.notify({
        type: 'negative',
        message: 'Código incorreto. Tente novamente.'
      });
    }
  } finally {
    loading.value = false;
  }
}

function resendCode() {
  countdown.value = 60;
  $q.notify({
    type: 'info',
    message: 'Novo código SMS enviado (código mock: 123456).'
  });
}
</script>
