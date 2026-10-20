<template>
  <q-page class="q-py-xl q-px-md max-w-4xl q-mx-auto">
    <div class="hc-section-header text-center q-mb-xl">
      <div class="text-caption text-uppercase text-weight-bold text-primary">ESCLARECIMENTOS</div>
      <h1 class="hc-title q-mt-xs">Perguntas Frequentes (FAQ)</h1>
      <p class="hc-subtitle">
        Respostas às principais dúvidas sobre a submissão e o tratamento de processos no HospitalCare.
      </p>
    </div>

    <!-- Barra de Pesquisa de Perguntas -->
    <q-input
      v-model="searchQuery"
      outlined
      placeholder="Pesquisar por palavras-chave (ex.: prazos, sigilo, documentos)..."
      class="q-mb-lg bg-white"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Lista Expansível de FAQs -->
    <q-card class="hc-card q-pa-sm">
      <q-list separator>
        <q-expansion-item
          v-for="faq in filteredFaqs"
          :key="faq.id"
          expand-separator
          icon="help_outline"
          :label="faq.question"
          header-class="text-weight-bold text-slate-700"
        >
          <q-card>
            <q-card-section class="text-body2 text-slate-600 bg-slate-50 leading-relaxed">
              {{ faq.answer }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-item v-if="!filteredFaqs.length">
          <q-item-section class="text-center text-slate-500 q-pa-lg">
            Nenhuma resposta localizada para "{{ searchQuery }}".
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { faqService } from '../../services';
import type { FAQ } from '../../types';

const faqs = ref<FAQ[]>([]);
const searchQuery = ref('');

onMounted(async () => {
  faqs.value = await faqService.getPublishedFaqs();
});

const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) return faqs.value;
  const q = searchQuery.value.toLowerCase().trim();
  return faqs.value.filter(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
});
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
.leading-relaxed { line-height: 1.65; }
</style>
