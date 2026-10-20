<template>
  <q-page class="q-pa-lg max-w-4xl q-mx-auto">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" color="slate-600" to="/paciente/dashboard" class="q-mr-sm" />
      <div>
        <h1 class="text-h5 text-weight-bolder text-slate-800 q-mb-none">
          Submeter Novo Processo
        </h1>
        <div class="text-caption text-slate-500">
          Preencha os campos abaixo com clareza para que a equipa possa encaminhar a sua manifestação.
        </div>
      </div>
    </div>

    <q-card class="hc-card q-pa-lg">
      <q-form @submit.prevent="handleSubmit">
        <!-- Seleção de Tipo de Processo -->
        <div class="q-mb-lg">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-sm">
            1. Tipo de Manifestação *
          </label>
          <div class="row q-col-gutter-sm">
            <div
              v-for="t in processTypes"
              :key="t.id"
              class="col-12 col-sm-4"
            >
              <q-card
                flat
                bordered
                class="q-pa-md cursor-pointer text-center transition-all"
                :class="{ 'bg-blue-1 border-primary text-primary': selectedTypeId === t.id }"
                @click="selectedTypeId = t.id"
              >
                <q-icon :name="getTypeIcon(t.code)" size="28px" class="q-mb-xs" />
                <div class="text-subtitle2 text-weight-bold">{{ t.name }}</div>
                <div class="text-caption text-slate-500 font-size-11 q-mt-xs">
                  {{ t.description }}
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Categoria e Departamento -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-6">
            <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
              2. Categoria do Assunto *
            </label>
            <q-select
              v-model="selectedCategoryId"
              :options="categoryOptions"
              label="Selecione a categoria *"
              outlined
              dense
              emit-value
              map-options
              :rules="[(v) => !!v || 'Selecione uma categoria']"
            />
          </div>

          <div class="col-12 col-sm-6">
            <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
              Departamento Relacionado
            </label>
            <q-select
              v-model="selectedDepartmentId"
              :options="departmentOptions"
              label="Selecione o serviço hospitalar (opcional)"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
        </div>

        <!-- Assunto e Data -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-8">
            <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
              3. Resumo / Título do Assunto *
            </label>
            <q-input
              v-model="subject"
              placeholder="Ex.: Demora no atendimento pediátrico no dia 12"
              outlined
              dense
              :rules="[(v) => (v && v.length >= 5) || 'Indique um título com pelo menos 5 caracteres']"
            />
          </div>

          <div class="col-12 col-sm-4">
            <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
              Data da Ocorrência
            </label>
            <q-input
              v-model="incidentDate"
              type="date"
              outlined
              dense
            />
          </div>
        </div>

        <!-- Descrição Detalhada -->
        <div class="q-mb-md">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
            4. Descrição Detalhada dos Factos *
          </label>
          <div class="text-caption text-slate-500 q-mb-xs">
            Explique o que aconteceu, incluindo horas aproximadas e locais, sem divulgar dados clínicos confidenciais desnecessários.
          </div>
          <q-input
            v-model="description"
            type="textarea"
            rows="5"
            placeholder="Descreva a sua experiência ou o esclarecimento necessário com clareza..."
            outlined
            dense
            :rules="[(v) => (v && v.length >= 20) || 'Por favor, detalhe com pelo menos 20 caracteres']"
          />
        </div>

        <!-- Anexos de Apoio -->
        <div class="q-mb-lg">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
            5. Documentos ou Comprovativos (Opcional)
          </label>
          <div class="text-caption text-slate-500 q-mb-sm">
            Pode anexar recibos de senha, requisições ou documentos relevantes (PDF, PNG, JPG até 5MB).
          </div>
          <q-file
            v-model="attachment"
            outlined
            dense
            clearable
            accept="image/*,application/pdf"
            label="Tirar foto ou escolher ficheiro do telemóvel"
          >
            <template #prepend>
              <q-icon name="photo_camera" color="primary" />
            </template>
          </q-file>
        </div>

        <!-- Botões de Ação -->
        <div class="row justify-end q-gutter-sm">
          <q-btn flat color="slate-600" no-caps label="Cancelar" to="/paciente/dashboard" class="col-xs-12 col-sm-auto" />
          <q-btn
            unelevated
            color="primary"
            no-caps
            label="Submeter Processo Oficial"
            type="submit"
            :loading="submitting"
            class="text-weight-bold q-px-lg col-xs-12 col-sm-auto"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { categoryService, departmentService, processService } from '../../services';
import type { ProcessType, Category, Department, ProcessTypeCode } from '../../types';
import { getProcessTypeMeta } from '../../utils/formatters';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const processTypes = ref<ProcessType[]>([]);
const categories = ref<Category[]>([]);
const departments = ref<Department[]>([]);

const selectedTypeId = ref<number>(1);
const selectedCategoryId = ref<string>('');
const selectedDepartmentId = ref<string>('');
const subject = ref('');
const incidentDate = ref(new Date().toISOString().split('T')[0]);
const description = ref('');
const attachment = ref<File | null>(null);
const submitting = ref(false);

const categoryOptions = computed(() =>
  categories.value.map((c) => ({ label: c.name, value: c.id }))
);

const departmentOptions = computed(() =>
  departments.value.map((d) => ({ label: d.name, value: d.id }))
);

onMounted(async () => {
  const [typesRes, catsRes, deptsRes] = await Promise.all([
    categoryService.getProcessTypes(),
    categoryService.getCategories(),
    departmentService.getDepartments()
  ]);
  processTypes.value = typesRes;
  categories.value = catsRes;
  departments.value = deptsRes;

  if (route.query.type) {
    selectedTypeId.value = Number(route.query.type);
  }
  if (catsRes.length && catsRes[0]) {
    selectedCategoryId.value = catsRes[0].id;
  }
});

function getTypeIcon(code: ProcessTypeCode): string {
  return getProcessTypeMeta(code).icon;
}

async function handleSubmit() {
  if (!authStore.user) {
    $q.notify({ type: 'warning', message: 'Inicie sessão para submeter o processo.' });
    return;
  }

  submitting.value = true;
  try {
    const newProc = await processService.createProcess(
      {
        processTypeId: selectedTypeId.value,
        categoryId: selectedCategoryId.value,
        ...(selectedDepartmentId.value ? { departmentId: selectedDepartmentId.value } : {}),
        subject: subject.value,
        description: description.value,
        ...(incidentDate.value ? { incidentDate: incidentDate.value } : {}),
        ...(attachment.value ? { attachments: [attachment.value] } : {})
      },
      authStore.user.id
    );

    $q.notify({
      type: 'positive',
      message: 'Processo submetido com sucesso!',
      caption: `Código gerado: ${newProc.referenceCode}`,
      timeout: 5000
    });

    await router.push(`/paciente/processos/${newProc.id}`);
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Falha ao submeter processo'
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
.font-size-11 { font-size: 11px; }
.border-primary { border-color: #0f5b9e !important; }
</style>
