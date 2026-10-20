<template>
  <q-page class="q-pa-lg max-w-xl q-mx-auto">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="slate-600" :to="`/paciente/processos/${processId}`" class="q-mr-sm" />
      <div>
        <h1 class="text-h5 text-weight-bolder text-slate-800 q-mb-none">
          Avaliação do Atendimento
        </h1>
        <div class="text-caption text-slate-500">
          A sua opinião ajuda-nos a aprimorar o serviço do hospital.
        </div>
      </div>
    </div>

    <q-card class="hc-card q-pa-lg text-center">
      <div class="q-mb-md">
        <q-avatar size="56px" color="amber-1" text-color="amber-9">
          <q-icon name="hotel_class" size="32px" />
        </q-avatar>
      </div>

      <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">
        Como avalia a resolução do seu processo?
      </div>
      <div class="text-caption text-slate-500 q-mb-lg">
        Classifique de 1 (Muito insatisfeito) a 5 (Muito satisfeito) estrelas.
      </div>

      <!-- Classificação por Estrelas -->
      <div class="q-mb-xl flex flex-center">
        <q-rating
          v-model="rating"
          size="42px"
          color="amber-8"
          icon="star_border"
          icon-selected="star"
          class="q-mx-auto"
        />
      </div>

      <div class="text-left q-mb-lg">
        <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
          Comentários ou Observações Adicionais (Opcional):
        </label>
        <q-input
          v-model="comment"
          type="textarea"
          rows="4"
          placeholder="Diga-nos o que funcionou bem ou o que poderíamos ter melhorado..."
          outlined
          dense
        />
      </div>

      <div class="row justify-between items-center">
        <q-btn flat no-caps color="slate-600" label="Voltar" :to="`/paciente/processos/${processId}`" />
        <q-btn
          unelevated
          color="primary"
          label="Submeter Avaliação"
          no-caps
          :loading="submitting"
          :disable="rating < 1"
          class="text-weight-bold q-px-lg"
          @click="submitFeedback"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { processService } from '../../services';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const processId = route.params.id as string;
const rating = ref(5);
const comment = ref('');
const submitting = ref(false);

async function submitFeedback() {
  submitting.value = true;
  try {
    await processService.addFeedback(processId, rating.value, comment.value);
    $q.notify({
      type: 'positive',
      message: 'Obrigado pela sua avaliação!',
      caption: 'A sua opinião foi registada e encaminhada à supervisão de qualidade.'
    });
    await router.push(`/paciente/processos/${processId}`);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.max-w-xl { max-width: 600px; }
</style>
