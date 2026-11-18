<template>
  <q-page class="q-pa-lg max-w-4xl q-mx-auto">
    <!-- Cabeçalho da Página -->
    <div class="row items-center q-mb-lg">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        color="slate-600"
        :to="authStore.isAuthenticated ? '/paciente/dashboard' : '/'"
        class="q-mr-sm"
      />
      <div>
        <h1 class="text-h5 text-weight-bolder text-slate-800 q-mb-none">
          Submeter Manifestação Oficial
        </h1>
        <div class="text-caption text-slate-500">
          Hospital Central de Maputo — Canal Confidencial e Auditável de Utentes
        </div>
      </div>
    </div>

    <q-card class="hc-card q-pa-lg shadow-2">
      <q-form @submit.prevent="handleSubmit">
        <!-- 1. Modalidade de Confidencialidade (Anónimo vs Identificado) -->
        <div class="q-mb-lg">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-sm">
            1. Modalidade de Submissão *
          </label>
          <div class="row q-col-gutter-sm">
            <!-- Opção Anónima -->
            <div class="col-12 col-sm-6">
              <q-card
                flat
                bordered
                class="q-pa-md cursor-pointer transition-all full-height"
                :class="{ 'bg-emerald-50 border-emerald text-emerald-800': isAnonymous, 'bg-slate-50': !isAnonymous }"
                @click="isAnonymous = true"
              >
                <div class="row items-center no-wrap">
                  <q-avatar size="36px" :class="isAnonymous ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'" class="q-mr-sm">
                    <q-icon name="security" size="20px" />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle2 text-weight-bolder">Submissão 100% Anónima</div>
                    <div class="text-caption text-slate-600 font-size-11">
                      Sem recolha de nome ou telefone. Acompanhamento exclusivo por Código e PIN.
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Opção Identificada -->
            <div class="col-12 col-sm-6">
              <q-card
                flat
                bordered
                class="q-pa-md cursor-pointer transition-all full-height"
                :class="{ 'bg-blue-50 border-primary text-primary': !isAnonymous, 'bg-slate-50': isAnonymous }"
                @click="isAnonymous = false"
              >
                <div class="row items-center no-wrap">
                  <q-avatar size="36px" :class="!isAnonymous ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'" class="q-mr-sm">
                    <q-icon name="person" size="20px" />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle2 text-weight-bolder">Submissão Identificada</div>
                    <div class="text-caption text-slate-600 font-size-11">
                      Com indicação de nome e contacto para recepção de notificações directas.
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <!-- Alerta Educativo de Sigilo -->
          <div v-if="isAnonymous" class="q-mt-sm q-pa-sm bg-emerald-1 text-emerald-9 rounded-borders row items-center font-size-12">
            <q-icon name="verified_user" size="18px" class="q-mr-xs text-emerald-6" />
            <span>Garantia de Sigilo: Não será registado nenhum dado pessoal. O sistema gerará um Código e um PIN único para consultar a resposta oficial.</span>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- 2. Dados do Utente (Apenas se Identificado) -->
        <div v-if="!isAnonymous" class="q-mb-lg">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-sm">
            2. Identificação do Utente *
          </label>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="patientName"
                label="Nome Completo *"
                outlined
                dense
                placeholder="Ex.: Maria Tembe"
                :rules="[(v) => isAnonymous || (v && v.trim().length >= 3) || 'Indique o seu nome completo']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="patientPhone"
                label="Telefone de Contacto *"
                outlined
                dense
                placeholder="Ex.: 84 123 4567"
                :rules="[(v) => isAnonymous || (v && v.trim().length >= 8) || 'Indique um contacto válido']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="patientEmail"
                label="Endereço de Email (Opcional)"
                outlined
                dense
                placeholder="Ex.: utente@exemplo.co.mz"
              />
            </div>
          </div>
          <q-separator class="q-my-md" />
        </div>

        <!-- 3. Tipo de Manifestação -->
        <div class="q-mb-lg">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-sm">
            {{ isAnonymous ? '2' : '3' }}. Tipo de Manifestação *
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
                class="q-pa-md cursor-pointer text-center transition-all full-height"
                :class="{ 'bg-blue-1 border-primary text-primary shadow-1': selectedTypeId === t.id }"
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

        <!-- 4. Categoria e Departamento -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-6">
            <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
              {{ isAnonymous ? '3' : '4' }}. Categoria do Assunto *
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
              {{ isAnonymous ? '4' : '5' }}. Serviço / Departamento Hospitalar *
            </label>
            <q-select
              v-model="selectedDepartmentId"
              :options="departmentOptions"
              label="Selecione o serviço hospitalar *"
              outlined
              dense
              emit-value
              map-options
              :rules="[(v) => !!v || 'Indique o departamento para podermos encaminhar a manifestação']"
            />
          </div>
        </div>

        <!-- 5. Assunto e Data -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-sm-8">
            <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
              {{ isAnonymous ? '5' : '6' }}. Resumo / Título do Assunto *
            </label>
            <q-input
              v-model="subject"
              placeholder="Ex.: Demora no atendimento pediátrico no dia 12"
              outlined
              dense
              :rules="[(v) => (v && v.trim().length >= 2) || 'Indique um título com pelo menos 2 caracteres']"
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

        <!-- 6. Descrição Detalhada -->
        <div class="q-mb-md">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
            {{ isAnonymous ? '6' : '7' }}. Descrição Detalhada dos Factos *
          </label>
          <div class="text-caption text-slate-500 q-mb-xs">
            Descreva o que sucedeu com clareza (datas, horas e locais). Se for anónimo, não mencione nomes próprios no corpo do texto.
          </div>
          <q-input
            v-model="description"
            type="textarea"
            rows="5"
            placeholder="Descreva a sua experiência, sugestão ou elogio detalhadamente..."
            outlined
            dense
            :rules="[(v) => (v && v.trim().length >= 5) || 'Por favor, detalhe com pelo menos 5 caracteres']"
          />
        </div>

        <!-- 7. Anexos Opcionais -->
        <div class="q-mb-lg">
          <label class="text-subtitle2 text-weight-bold text-slate-700 block q-mb-xs">
            {{ isAnonymous ? '7' : '8' }}. Documentos ou Comprovativos (Opcional)
          </label>
          <div class="text-caption text-slate-500 q-mb-sm">
            Pode anexar receitas, senhas ou registos relevantes (PDF, PNG, JPG até 5MB).
          </div>
          <q-file
            v-model="attachment"
            outlined
            dense
            clearable
            accept="image/*,application/pdf"
            label="Escolher documento ou foto"
          >
            <template #prepend>
              <q-icon name="attach_file" color="primary" />
            </template>
          </q-file>
        </div>

        <!-- Botões de Ação -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            color="slate-600"
            no-caps
            label="Cancelar"
            :to="authStore.isAuthenticated ? '/paciente/dashboard' : '/'"
            class="col-xs-12 col-sm-auto"
          />
          <q-btn
            unelevated
            rounded
            no-caps
            class="bg-gradient-primary text-white text-weight-bold q-px-xl col-xs-12 col-sm-auto shadow-2"
            label="Submeter Manifestação Oficial"
            type="submit"
            :loading="submitting"
          />
        </div>
      </q-form>
    </q-card>

    <!-- Modal de Sucesso com Código e PIN de Acompanhamento -->
    <q-dialog v-model="showSuccessModal" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-pa-lg" style="width: 100%; max-width: 520px; border-radius: 20px;">
        <div class="text-center q-mb-md">
          <q-avatar size="64px" class="bg-emerald-1 text-emerald-6 q-mb-sm">
            <q-icon name="check_circle" size="48px" />
          </q-avatar>
          <h2 class="text-h6 text-weight-bolder text-slate-800 q-mb-xs">
            Manifestação Submetida com Sucesso!
          </h2>
          <div class="text-caption text-slate-600">
            A sua ocorrência foi registada com segurança institucional no Hospital Central de Maputo.
          </div>
        </div>

        <!-- Cartão com Código e PIN em Destaque -->
        <div class="q-pa-md bg-slate-50 rounded-borders border-slate-2 q-mb-md">
          <div class="row justify-between items-center q-mb-sm">
            <div>
              <div class="text-caption text-slate-500 font-size-11">Código de Referência</div>
              <div class="text-subtitle1 text-weight-bolder text-primary font-mono">
                {{ createdProcess?.referenceCode }}
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              icon="content_copy"
              color="primary"
              @click="copyToClipboard(createdProcess?.referenceCode || '', 'Código de Referência copiado!')"
            />
          </div>

          <q-separator class="q-my-xs" />

          <div class="row justify-between items-center q-mt-sm">
            <div>
              <div class="text-caption text-slate-500 font-size-11">PIN Confidencial de Acompanhamento</div>
              <div class="text-h6 text-weight-bolder text-emerald-7 font-mono letter-spacing-wide">
                {{ createdProcess?.trackingPin }}
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              icon="content_copy"
              color="emerald-7"
              @click="copyToClipboard(createdProcess?.trackingPin || '', 'PIN copiado!')"
            />
          </div>
        </div>

        <!-- Alerta de Segurança -->
        <div class="q-pa-sm bg-amber-50 text-amber-9 rounded-borders row items-center font-size-12 q-mb-lg border-amber-2">
          <q-icon name="lock" size="18px" class="q-mr-xs text-amber-7" />
          <span><strong>Guarde o Código e o PIN num local seguro.</strong> Eles constituem a sua chave exclusiva para consultar o estado e a resposta oficial da Direcção do HCM.</span>
        </div>

        <!-- Ações do Modal -->
        <div class="row q-gutter-sm justify-end">
          <q-btn
            flat
            no-caps
            label="Ir para a Página Inicial"
            color="slate-600"
            @click="handleCloseSuccessModal"
          />
          <q-btn
            unelevated
            rounded
            no-caps
            class="bg-gradient-primary text-white text-weight-bold q-px-lg"
            label="Consultar Processo Agora"
            @click="handleGoToLookup"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, copyToClipboard as qCopyToClipboard } from 'quasar';
import { useAuthStore } from '../../stores/auth.store';
import { categoryService, departmentService, processService } from '../../services';
import type { ProcessType, Category, Department, ProcessTypeCode, Process } from '../../types';
import { getProcessTypeMeta } from '../../utils/formatters';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const processTypes = ref<ProcessType[]>([]);
const categories = ref<Category[]>([]);
const departments = ref<Department[]>([]);

const isAnonymous = ref(true);
const patientName = ref('');
const patientPhone = ref('');
const patientEmail = ref('');

const selectedTypeId = ref<number>(1);
const selectedCategoryId = ref<string>('');
const selectedDepartmentId = ref<string>('');
const subject = ref('');
const incidentDate = ref(new Date().toISOString().split('T')[0]);
const description = ref('');
const attachment = ref<File | null>(null);
const submitting = ref(false);

const showSuccessModal = ref(false);
const createdProcess = ref<Process | null>(null);

const categoryOptions = computed(() =>
  categories.value.map((c) => ({ label: c.name, value: c.id }))
);

const departmentOptions = computed(() =>
  departments.value.map((d) => ({ label: d.name, value: d.id }))
);

onMounted(async () => {
  if (authStore.user) {
    isAnonymous.value = false;
    patientName.value = authStore.user.fullName || '';
    patientPhone.value = authStore.user.phone || '';
    patientEmail.value = authStore.user.email || '';
  }

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
  if (deptsRes.length && deptsRes[0]) {
    selectedDepartmentId.value = deptsRes[0].id;
  }
});

function getTypeIcon(code: ProcessTypeCode): string {
  return getProcessTypeMeta(code).icon;
}

function copyToClipboard(text: string, msg: string) {
  qCopyToClipboard(text)
    .then(() => {
      $q.notify({ type: 'positive', message: msg, timeout: 2000 });
    })
    .catch(() => {
      $q.notify({ type: 'warning', message: 'Não foi possível copiar automaticamente.' });
    });
}

async function handleSubmit() {
  if (!isAnonymous.value && (!patientName.value.trim() || !patientPhone.value.trim())) {
    $q.notify({ type: 'warning', message: 'Por favor, indique o seu nome e telefone para contacto.' });
    return;
  }

  if (!selectedCategoryId.value) {
    $q.notify({ type: 'warning', message: 'Por favor, selecione a categoria do assunto.' });
    return;
  }

  if (!selectedDepartmentId.value) {
    $q.notify({ type: 'warning', message: 'Por favor, selecione o departamento hospitalar.' });
    return;
  }

  submitting.value = true;
  try {
    const newProc = await processService.createProcess({
      processTypeId: selectedTypeId.value,
      categoryId: selectedCategoryId.value,
      departmentId: selectedDepartmentId.value,
      subject: subject.value,
      description: description.value,
      isAnonymous: isAnonymous.value,
      patientName: isAnonymous.value ? 'Utente Anónimo' : patientName.value.trim(),
      patientPhone: isAnonymous.value ? undefined : patientPhone.value.trim(),
      patientEmail: isAnonymous.value ? undefined : patientEmail.value.trim(),
      ...(incidentDate.value ? { incidentDate: incidentDate.value } : {}),
      ...(attachment.value ? { attachments: [attachment.value] } : {})
    });

    createdProcess.value = newProc;
    showSuccessModal.value = true;
  } catch (err: unknown) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'Falha ao submeter manifestação.'
    });
  } finally {
    submitting.value = false;
  }
}

function handleCloseSuccessModal() {
  showSuccessModal.value = false;
  void router.push('/');
}

function handleGoToLookup() {
  showSuccessModal.value = false;
  if (createdProcess.value?.referenceCode) {
    void router.push({
      path: '/',
      query: {
        lookup: createdProcess.value.referenceCode,
        pin: createdProcess.value.trackingPin
      }
    });
  } else {
    void router.push('/');
  }
}
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
.font-size-11 { font-size: 11px; }
.font-size-12 { font-size: 12px; }
.border-primary { border-color: #0284c7 !important; border-width: 2px !important; }
.border-emerald { border-color: #10b981 !important; border-width: 2px !important; }
.letter-spacing-wide { letter-spacing: 4px; }
.border-amber-2 { border: 1px solid #fde68a; }
</style>
