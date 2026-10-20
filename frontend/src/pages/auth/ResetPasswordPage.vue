<template>
  <q-card class="hc-card q-pa-lg">
    <div class="text-center q-mb-lg">
      <q-avatar size="44px" color="primary" text-color="white" class="q-mb-xs">
        <q-icon name="vpn_key" size="24px" />
      </q-avatar>
      <div class="text-h5 text-weight-bolder text-slate-800">Redefinir Palavra-passe</div>
      <div class="text-caption text-slate-500">
        Introduza o código recebido e defina a sua nova credencial
      </div>
    </div>

    <q-form @submit.prevent="handleReset">
      <q-input
        v-model="token"
        label="Código ou Token de Validação *"
        placeholder="Ex.: 123456"
        outlined
        dense
        class="q-mb-sm"
        :rules="[(v) => !!v || 'Introduza o código recebido']"
      >
        <template #prepend><q-icon name="pin" /></template>
      </q-input>

      <q-input
        v-model="newPassword"
        label="Nova Palavra-passe *"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        class="q-mb-sm"
        :rules="[(v) => (v && v.length >= 6) || 'Mínimo de 6 caracteres']"
      >
        <template #prepend><q-icon name="lock" /></template>
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-input
        v-model="confirmPassword"
        label="Confirmar Nova Palavra-passe *"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        class="q-mb-md"
        :rules="[(v) => v === newPassword || 'As palavras-passe não coincidem']"
      >
        <template #prepend><q-icon name="lock_clock" /></template>
      </q-input>

      <q-btn
        unelevated
        color="primary"
        label="Guardar Nova Palavra-passe"
        no-caps
        type="submit"
        :loading="loading"
        class="full-width text-weight-bold q-py-sm"
      />
    </q-form>

    <div class="text-center q-mt-lg text-body2">
      <router-link to="/entrar" class="text-primary text-weight-medium">
        ← Cancelar e voltar ao login
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

const token = ref('123456');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);

async function handleReset() {
  loading.value = true;
  try {
    await authService.resetPassword(token.value, newPassword.value);
    $q.notify({
      type: 'positive',
      message: 'Palavra-passe alterada com sucesso!',
      caption: 'Já pode iniciar sessão com a nova credencial.'
    });
    await router.push('/entrar');
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Código inválido ou expirado.'
    });
  } finally {
    loading.value = false;
  }
}
</script>
