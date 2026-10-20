<template>
  <q-page class="q-pa-lg max-w-4xl q-mx-auto">
    <div class="hc-section-header q-mb-lg">
      <div class="text-caption text-uppercase text-weight-bold text-red-9">PARÂMETROS GLOBAIS</div>
      <h1 class="hc-title q-mt-xs">Configurações do Hospital Piloto</h1>
      <p class="hc-subtitle">
        Definições institucionais e parâmetros operacionais do HospitalCare.
      </p>
    </div>

    <q-card class="hc-card q-pa-lg q-mb-lg">
      <div class="text-h6 text-weight-bold text-slate-800 q-mb-md">Dados Institucionais</div>

      <q-form @submit.prevent="saveSettings">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-8">
            <q-input
              v-model="hospitalName"
              label="Nome do Hospital *"
              outlined
              dense
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="hospitalCode"
              label="Código Identificador *"
              outlined
              dense
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="phone"
              label="Telefone Institucional"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="email"
              label="Email Institucional"
              outlined
              dense
              type="email"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="timezone"
              label="Fuso Horário Padrão"
              outlined
              dense
              readonly
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="currency"
              label="Moeda Padrão"
              outlined
              dense
              readonly
            />
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            unelevated
            color="red-9"
            label="Guardar Configurações"
            no-caps
            type="submit"
            :loading="saving"
            class="text-weight-bold"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { mockHospital } from '../../services/mock/mock-data';

const $q = useQuasar();

const hospitalName = ref(mockHospital.name);
const hospitalCode = ref(mockHospital.code);
const phone = ref(mockHospital.phone || '');
const email = ref(mockHospital.email || '');
const timezone = ref('Africa/Maputo (GMT+2)');
const currency = ref('Metical Moçambicano (MZN)');
const saving = ref(false);

async function saveSettings() {
  saving.value = true;
  await new Promise((r) => setTimeout(r, 400));
  saving.value = false;
  $q.notify({
    type: 'positive',
    message: 'Configurações institucionais guardadas com sucesso!'
  });
}
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
</style>
