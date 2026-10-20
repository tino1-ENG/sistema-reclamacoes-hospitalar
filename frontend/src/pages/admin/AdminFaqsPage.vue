<template>
  <q-page class="q-pa-lg max-w-6xl q-mx-auto">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bolder text-slate-800 q-mb-xs">
          Perguntas Frequentes (FAQ)
        </h1>
        <div class="text-body2 text-slate-500">
          Edição e publicação de esclarecimentos públicos no portal do utente.
        </div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Adicionar Pergunta"
        no-caps
        @click="openModal"
      />
    </div>

    <q-card class="hc-card">
      <q-table
        :rows="faqs"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-isPublished="props">
          <q-td :props="props">
            <q-badge :color="props.row.isPublished ? 'positive' : 'grey-6'">
              {{ props.row.isPublished ? 'Publicada' : 'Rascunho' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round dense size="sm" icon="edit" color="primary" @click="editFaq(props.row)" />
            <q-btn flat round dense size="sm" icon="delete" color="negative" @click="deleteFaq(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal de FAQ -->
    <q-dialog v-model="showModal">
      <q-card class="hc-card q-pa-lg" style="min-width: 440px">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-sm">
          {{ editingId ? 'Editar Pergunta' : 'Nova Pergunta Frequente' }}
        </div>

        <q-form @submit.prevent="saveFaq">
          <q-input
            v-model="question"
            label="Pergunta / Questão *"
            outlined
            dense
            class="q-mb-sm"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-input
            v-model="answer"
            label="Resposta Oficial *"
            type="textarea"
            rows="4"
            outlined
            dense
            class="q-mb-md"
            :rules="[(v) => !!v || 'Campo obrigatório']"
          />

          <q-checkbox v-model="isPublished" label="Publicar no portal público" dense class="q-mb-lg" />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
            <q-btn unelevated no-caps label="Guardar" color="primary" type="submit" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { faqService } from '../../services';
import type { FAQ } from '../../types';

const $q = useQuasar();

const faqs = ref<FAQ[]>([]);
const showModal = ref(false);
const editingId = ref<string | null>(null);
const question = ref('');
const answer = ref('');
const isPublished = ref(true);

const columns: QTableColumn[] = [
  { name: 'question', label: 'Pergunta', field: 'question', align: 'left', sortable: true },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'isPublished', label: 'Estado', field: 'isPublished', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'id', align: 'right' }
];

onMounted(async () => {
  faqs.value = await faqService.getAllFaqs();
});

function openModal() {
  editingId.value = null;
  question.value = '';
  answer.value = '';
  isPublished.value = true;
  showModal.value = true;
}

function editFaq(f: FAQ) {
  editingId.value = f.id;
  question.value = f.question;
  answer.value = f.answer;
  isPublished.value = f.isPublished;
  showModal.value = true;
}

async function saveFaq() {
  await faqService.saveFaq({
    ...(editingId.value ? { id: editingId.value } : {}),
    question: question.value,
    answer: answer.value,
    isPublished: isPublished.value
  });
  faqs.value = await faqService.getAllFaqs();
  showModal.value = false;
  $q.notify({ type: 'positive', message: 'Pergunta guardada com sucesso!' });
}

async function deleteFaq(id: string) {
  await faqService.deleteFaq(id);
  faqs.value = await faqService.getAllFaqs();
  $q.notify({ type: 'info', message: 'Pergunta removida.' });
}
</script>

<style scoped>
.max-w-6xl { max-width: 1200px; }
</style>
