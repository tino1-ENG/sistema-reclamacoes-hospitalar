<template>
  <q-page class="q-py-xl q-px-md max-w-4xl q-mx-auto">
    <div class="hc-section-header text-center q-mb-xl">
      <div class="text-caption text-uppercase text-weight-bold text-primary">CONTACTOS & ATENDIMENTO</div>
      <h1 class="hc-title q-mt-xs">Canais de Apoio Institucional</h1>
      <p class="hc-subtitle">
        Entre em contacto com o gabinete de apoio ao utente do hospital piloto.
      </p>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-5">
        <q-card class="hc-card q-pa-lg full-height">
          <div class="text-h6 text-weight-bold text-slate-800 q-mb-md">Hospital Piloto</div>
          <div class="text-subtitle2 text-primary">Hospital Central de Maputo</div>
          <p class="text-body2 text-slate-500 q-mt-xs q-mb-lg">
            Av. Eduardo Mondlane, nº 1500<br>
            Cidade de Maputo, Moçambique
          </p>

          <q-list dense class="q-gutter-y-md text-body2 text-slate-700">
            <q-item class="q-pa-none">
              <q-item-section avatar><q-icon name="phone" color="primary" /></q-item-section>
              <q-item-section>
                <div class="text-caption text-slate-500">Linha Telefónica Direta</div>
                <div class="text-weight-bold">+258 21 350 400</div>
              </q-item-section>
            </q-item>

            <q-item class="q-pa-none">
              <q-item-section avatar><q-icon name="email" color="primary" /></q-item-section>
              <q-item-section>
                <div class="text-caption text-slate-500">Email Institucional</div>
                <div class="text-weight-bold">contacto@hospitalcare.gov.mz</div>
              </q-item-section>
            </q-item>

            <q-item class="q-pa-none">
              <q-item-section avatar><q-icon name="access_time" color="primary" /></q-item-section>
              <q-item-section>
                <div class="text-caption text-slate-500">Horário do Gabinete do Utente</div>
                <div class="text-weight-bold">Segunda a Sexta: 07:30 – 16:30</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <q-card class="hc-card q-pa-lg">
          <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">Mensagem Rápida</div>
          <div class="text-caption text-slate-500 q-mb-md">
            Envie uma dúvida preliminar ou pedido de orientação.
          </div>

          <q-form @submit.prevent="sendMessage">
            <q-input
              v-model="name"
              label="Nome completo *"
              outlined
              dense
              class="q-mb-sm"
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
            <q-input
              v-model="phone"
              label="Telefone (Moçambique) *"
              outlined
              dense
              placeholder="+258 84 123 4567"
              class="q-mb-sm"
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
            <q-input
              v-model="message"
              label="Mensagem ou questão *"
              type="textarea"
              rows="4"
              outlined
              dense
              class="q-mb-md"
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
            <q-btn
              unelevated
              color="primary"
              label="Enviar Mensagem"
              no-caps
              type="submit"
              :loading="sending"
              class="full-width text-weight-bold"
            />
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const name = ref('');
const phone = ref('');
const message = ref('');
const sending = ref(false);

async function sendMessage() {
  sending.value = true;
  await new Promise((r) => setTimeout(r, 500));
  sending.value = false;
  $q.notify({
    type: 'positive',
    message: 'A sua mensagem foi enviada ao Gabinete do Utente!',
    caption: 'Entraremos em contacto pelo telefone indicado em até 24h úteis.'
  });
  name.value = '';
  phone.value = '';
  message.value = '';
}
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
</style>
