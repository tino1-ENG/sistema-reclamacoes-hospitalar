<template>
  <q-page class="q-pa-lg max-w-4xl q-mx-auto">
    <div class="hc-section-header q-mb-lg">
      <div class="text-caption text-uppercase text-weight-bold text-primary">PARÂMETROS GLOBAIS</div>
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
              readonly
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
          <div class="col-12">
            <q-input
              v-model="address"
              label="Endereço / Localização"
              outlined
              dense
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
            color="primary"
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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient } from '../../services/api/api-client';

const $q = useQuasar();

const hospitalName = ref('Hospital Central de Maputo');
const hospitalCode = ref('HCM-001');
const phone = ref('+258 21 350 400');
const email = ref('contacto@hcm.gov.mz');
const address = ref('Av. Eduardo Mondlane, nº 1500, Maputo');
const timezone = ref('Africa/Maputo (GMT+2)');
const currency = ref('Metical Moçambicano (MZN)');
const saving = ref(false);

async function loadHospitalSettings() {
  try {
    const res = await apiClient.get('/hospital');
    if (res.data?.data) {
      const h = res.data.data;
      hospitalName.value = h.name || hospitalName.value;
      hospitalCode.value = h.code || hospitalCode.value;
      phone.value = h.phone || phone.value;
      email.value = h.email || email.value;
      address.value = h.address || address.value;
      if (h.timezone) timezone.value = `${h.timezone} (GMT+2)`;
      if (h.currency) currency.value = `${h.currency} (Metical)`;
    }
  } catch (err) {
    console.error('Falha ao carregar configurações do hospital:', err);
  }
}

async function saveSettings() {
  saving.value = true;
  try {
    await apiClient.put('/hospital', {
      name: hospitalName.value,
      phone: phone.value,
      email: email.value,
      address: address.value
    });

    $q.notify({
      type: 'positive',
      message: 'Configurações institucionais guardadas com sucesso no servidor.',
      position: 'top'
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao guardar configurações.',
      position: 'top'
    });
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadHospitalSettings();
});
</script>

<style scoped>
.max-w-4xl {
  max-width: 900px;
}
</style>
