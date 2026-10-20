<template>
  <q-page class="q-pb-xl home-page">
    <!-- Hero Section com Imagens Alternadas Visíveis e Desobstruídas -->
    <section
      class="hero-section"
      @mouseenter="pauseRotation"
      @mouseleave="resumeRotation"
      aria-label="Apresentação institucional do HospitalCare"
    >
      <!-- Camada de Imagens de Fundo com Transição Rápida e Clara -->
      <div class="hero-bg-container" aria-hidden="true">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="hero-bg-slide"
          :class="{ 'is-active': currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        />
        <!-- Máscara de Gradiente Suave (Permite Visibilidade Total da Fotografia no Centro e Direita) -->
        <div class="hero-overlay-mask" />
      </div>

      <!-- Conteúdo do Hero Amplo e Desobstruído -->
      <div class="hero-content-wrapper max-w-6xl q-mx-auto q-px-md q-py-xl">
        <div class="row items-center">
          <!-- Coluna com Mensagem Institucional (Texto de Alto Contraste) -->
          <div class="col-12 col-lg-8 col-md-9 hero-text-col text-white">
            <!-- Selo Oficial -->
            <div class="hero-official-badge inline-flex items-center q-py-xs q-px-sm rounded-borders text-caption text-weight-bold q-mb-md">
              <q-icon name="shield" size="16px" class="q-mr-xs text-sky-200" />
              <span>SISTEMA OFICIAL DE ATENDIMENTO AO UTENTE — HCM</span>
            </div>

            <!-- Título Principal com Destaque Institucional -->
            <h1 class="hero-title text-weight-bolder leading-tight q-mb-md">
              A sua voz fortalece os cuidados de saúde do nosso <span class="hero-highlight-word">hospital.</span>
            </h1>

            <!-- Subtítulo Explicativo -->
            <p class="hero-subtitle text-subtitle1 q-mb-lg max-w-lg">
              Submeta reclamações, apresente sugestões de melhoria ou solicite esclarecimentos com total transparência e acompanhamento digital passo a passo.
            </p>

            <!-- Ações Principais -->
            <div class="row items-center q-gutter-sm q-mb-xl hero-actions">
              <q-btn
                unelevated
                rounded
                size="lg"
                color="primary"
                no-caps
                to="/paciente/processos/novo"
                class="hero-btn-primary text-weight-bold shadow-sm"
              >
                <q-icon name="add_circle" class="q-mr-xs" size="22px" />
                <span>Submeter Processo</span>
                <q-icon name="arrow_forward" class="q-ml-sm" size="18px" />
              </q-btn>

              <q-btn
                outline
                rounded
                size="lg"
                no-caps
                @click="openLookupModal"
                class="hero-btn-outline text-weight-medium"
              >
                <q-icon name="search" class="q-mr-xs" size="20px" />
                <span>Consultar Processo</span>
              </q-btn>
            </div>

            <!-- 3 Pilares com Ícones Alinhados -->
            <div class="row q-col-gutter-md text-caption hero-features">
              <div class="col-12 col-sm-4">
                <div class="row items-center no-wrap">
                  <q-avatar size="36px" class="hero-pill-avatar q-mr-sm">
                    <q-icon name="verified_user" size="20px" class="text-sky-200" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-white">Transparência</div>
                    <div class="text-sky-100 font-size-11">Processos rastreáveis</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="row items-center no-wrap">
                  <q-avatar size="36px" class="hero-pill-avatar q-mr-sm">
                    <q-icon name="schedule" size="20px" class="text-sky-200" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-white">Mais agilidade</div>
                    <div class="text-sky-100 font-size-11">Resposta em tempo útil</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="row items-center no-wrap">
                  <q-avatar size="36px" class="hero-pill-avatar q-mr-sm">
                    <q-icon name="favorite" size="20px" class="text-sky-200" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-white">Melhoria contínua</div>
                    <div class="text-sky-100 font-size-11">Um hospital melhor para todos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicadores de Slides Alternados Rápidos -->
        <div class="row items-center justify-between q-mt-xl hero-slide-controls">
          <div class="row items-center q-gutter-x-sm">
            <button
              v-for="(slide, index) in slides"
              :key="'dot-' + slide.id"
              class="slide-dot-btn"
              :class="{ 'is-active': currentSlide === index }"
              @click="setSlide(index)"
              :aria-label="`Ir para imagem ${index + 1}: ${slide.caption}`"
            />
            <div class="hero-slide-caption-badge q-px-sm q-py-xs rounded-borders text-caption text-white font-size-11 gt-xs">
              {{ slides[currentSlide]?.caption }}
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            size="sm"
            color="white"
            :icon="isPlaying ? 'pause' : 'play_arrow'"
            @click="togglePlayPause"
            :aria-label="isPlaying ? 'Pausar rotação de imagens' : 'Reproduzir rotação de imagens'"
            class="slide-playback-toggle"
          >
            <q-tooltip>{{ isPlaying ? 'Pausar rotação' : 'Continuar rotação' }}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </section>

    <!-- Diálogo / Modal Flutuante de Consulta Rápida de Processo -->
    <q-dialog v-model="showLookupModal" transition-show="scale" transition-hide="scale">
      <q-card class="quick-lookup-card q-pa-lg bg-white" style="width: 100%; max-width: 480px; border-radius: 20px;">
        <!-- Cabeçalho do Cartão com Ícone Azul -->
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center no-wrap">
            <div class="quick-icon-badge q-mr-sm flex-shrink-0">
              <q-icon name="description" size="24px" color="primary" />
            </div>
            <div>
              <div class="text-h6 text-weight-bold text-slate-800 leading-snug">
                Consulta Rápida de Processo
              </div>
              <div class="text-caption text-slate-600">
                Introduza o código de referência (ex.: HC-2026-000101)
              </div>
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup color="grey-7" />
        </div>

        <!-- Formulário de Consulta -->
        <q-form @submit.prevent="lookupProcess" class="q-mt-sm">
          <q-input
            v-model="referenceInput"
            ref="lookupInputRef"
            outlined
            dense
            placeholder="Ex.: HC-2026-000101"
            class="q-mb-md quick-lookup-input"
            :rules="[(val) => !!val || 'Indique o código de referência']"
            autofocus
          >
            <template #prepend>
              <q-icon name="search" color="grey-7" />
            </template>
            <template #append>
              <q-icon name="qr_code_scanner" color="primary" class="cursor-pointer" />
            </template>
          </q-input>

          <q-btn
            unelevated
            rounded
            color="primary"
            no-caps
            class="full-width text-weight-bold quick-lookup-btn"
            type="submit"
            :loading="lookingUp"
          >
            <q-icon name="arrow_forward" class="q-mr-xs" size="18px" />
            <span>Verificar Estado</span>
          </q-btn>
        </q-form>

        <!-- Nota de Rodapé do Cartão -->
        <div class="row items-center q-mt-md text-caption text-slate-600">
          <q-icon name="info" size="16px" color="primary" class="q-mr-xs" />
          <span>O seu processo pode demorar alguns dias para ser atualizado.</span>
        </div>

        <!-- Resultado da Consulta -->
        <div v-if="foundProcess" class="q-mt-md q-pa-md bg-blue-1 rounded-borders border-blue-2 animate-fade">
          <div class="row justify-between items-center q-mb-xs">
            <span class="text-subtitle2 text-weight-bold text-primary">{{ foundProcess.referenceCode }}</span>
            <ProcessStatusBadge :status="foundProcess.status.code" />
          </div>
          <div class="text-body2 text-weight-medium text-slate-800 q-mb-xs">
            {{ foundProcess.subject }}
          </div>
          <div class="text-caption text-slate-600">
            Atualizado em: {{ formatDateTime(foundProcess.updatedAt) }}
          </div>
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            color="primary"
            label="Ver detalhes completos"
            icon-right="open_in_new"
            class="q-mt-sm text-weight-bold"
            :to="`/paciente/processos/${foundProcess.id}`"
          />
        </div>

        <div v-else-if="lookupError" class="q-mt-md q-pa-sm bg-red-1 text-negative text-caption rounded-borders row items-center">
          <q-icon name="error_outline" size="18px" class="q-mr-xs" />
          <span>{{ lookupError }}</span>
        </div>
      </q-card>
    </q-dialog>

    <!-- Seção: CANAIS DE MANIFESTAÇÃO (Disposição Lado a Lado / Horizontal sem Empilhamento) -->
    <section class="q-py-xl q-px-md max-w-6xl q-mx-auto channels-section">
      <div class="text-center q-mb-xl">
        <h2 class="text-h4 text-weight-bolder text-slate-800 q-mb-sm">
          Canais de Manifestação no HospitalCare
        </h2>
        <p class="text-body1 text-slate-600 q-mx-auto max-w-md">
          A plataforma assegura que todos os pedidos cheguem diretamente à entidade responsável, com total segurança e confidencialidade.
        </p>
      </div>

      <!-- Grid com 4 Cartões Horizontais (Side-by-side icon e texto conforme a referência visual) -->
      <div class="row q-col-gutter-md">
        <!-- 1. Reclamações -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            bordered
            class="channel-card full-height cursor-pointer"
            @click="$router.push('/paciente/processos/novo?type=1')"
          >
            <div class="row items-center no-wrap q-pa-md full-height">
              <div class="channel-icon-box channel-icon-reclamacoes q-mr-md flex-shrink-0">
                <q-icon name="assignment_late" size="24px" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold text-slate-800 leading-tight">
                  Reclamações
                </div>
                <div class="text-caption text-slate-500 q-mt-xs leading-normal">
                  Informe situações não conformes.
                </div>
              </div>
              <q-icon name="arrow_forward" size="18px" class="channel-arrow channel-arrow-blue q-ml-xs flex-shrink-0" />
            </div>
          </q-card>
        </div>

        <!-- 2. Sugestões -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            bordered
            class="channel-card full-height cursor-pointer"
            @click="$router.push('/paciente/processos/novo?type=3')"
          >
            <div class="row items-center no-wrap q-pa-md full-height">
              <div class="channel-icon-box channel-icon-sugestoes q-mr-md flex-shrink-0">
                <q-icon name="lightbulb" size="24px" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold text-slate-800 leading-tight">
                  Sugestões
                </div>
                <div class="text-caption text-slate-500 q-mt-xs leading-normal">
                  Contribua para a melhoria do serviço.
                </div>
              </div>
              <q-icon name="arrow_forward" size="18px" class="channel-arrow channel-arrow-green q-ml-xs flex-shrink-0" />
            </div>
          </q-card>
        </div>

        <!-- 3. Solicitações -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            bordered
            class="channel-card full-height cursor-pointer"
            @click="$router.push('/paciente/processos/novo?type=2')"
          >
            <div class="row items-center no-wrap q-pa-md full-height">
              <div class="channel-icon-box channel-icon-solicitacoes q-mr-md flex-shrink-0">
                <q-icon name="chat" size="24px" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold text-slate-800 leading-tight">
                  Solicitações
                </div>
                <div class="text-caption text-slate-500 q-mt-xs leading-normal">
                  Peça esclarecimentos clínicos.
                </div>
              </div>
              <q-icon name="arrow_forward" size="18px" class="channel-arrow channel-arrow-secondary q-ml-xs flex-shrink-0" />
            </div>
          </q-card>
        </div>

        <!-- 4. Acompanhamento -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            flat
            bordered
            class="channel-card full-height cursor-pointer"
            @click="openLookupModal"
          >
            <div class="row items-center no-wrap q-pa-md full-height">
              <div class="channel-icon-box channel-icon-acompanhamento q-mr-md flex-shrink-0">
                <q-icon name="track_changes" size="24px" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold text-slate-800 leading-tight">
                  Acompanhamento
                </div>
                <div class="text-caption text-slate-500 q-mt-xs leading-normal">
                  Consulte o estado em tempo real.
                </div>
              </div>
              <q-icon name="arrow_forward" size="18px" class="channel-arrow channel-arrow-teal q-ml-xs flex-shrink-0" />
            </div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Seção de Orientação Institucional ao Utente HCM -->
    <section class="awareness-section q-py-xl q-px-md bg-white border-y">
      <div class="max-w-6xl q-mx-auto">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-6">
            <h3 class="text-h4 text-weight-bolder text-slate-800 q-mb-md">
              Orientação oficial aos utentes do Hospital Central de Maputo
            </h3>
            <p class="text-body1 text-slate-600 q-mb-lg">
              Para maior comodidade, evite aglomerações e deslocações desnecessárias aos balcões ou aos gabinetes médicos. O HospitalCare foi desenvolvido para ser simples e direto.
            </p>

            <div class="column q-gutter-y-md">
              <div class="row items-start no-wrap">
                <q-avatar size="32px" color="blue-1" text-color="primary" class="q-mr-md text-weight-bold flex-shrink-0">
                  1
                </q-avatar>
                <div>
                  <div class="text-subtitle2 text-weight-bold text-slate-800">
                    Aceda a partir de qualquer telemóvel
                  </div>
                  <div class="text-caption text-slate-600">
                    O portal funciona em smartphones comuns. Se precisar, solicite o apoio de um familiar ou jovem da família.
                  </div>
                </div>
              </div>

              <div class="row items-start no-wrap">
                <q-avatar size="32px" color="blue-1" text-color="primary" class="q-mr-md text-weight-bold flex-shrink-0">
                  2
                </q-avatar>
                <div>
                  <div class="text-subtitle2 text-weight-bold text-slate-800">
                    Guarde o código de referência oficial
                  </div>
                  <div class="text-caption text-slate-600">
                    Ao submeter, recebe imediatamente um código único (ex.: HC-2026-000101) para acompanhar cada fase.
                  </div>
                </div>
              </div>

              <div class="row items-start no-wrap">
                <q-avatar size="32px" color="blue-1" text-color="primary" class="q-mr-md text-weight-bold flex-shrink-0">
                  3
                </q-avatar>
                <div>
                  <div class="text-subtitle2 text-weight-bold text-slate-800">
                    Receba o parecer fundamentado da equipa
                  </div>
                  <div class="text-caption text-slate-600">
                    A direção hospitalar e as equipas de triagem avaliam o caso e emitem respostas transparentes e auditadas.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <!-- Destaque Informativo Oficial -->
            <div class="awareness-banner-box q-pa-lg rounded-borders">
              <div class="row items-center q-mb-md">
                <q-avatar size="44px" color="red-1" text-color="negative" class="q-mr-md flex-shrink-0">
                  <q-icon name="block" size="26px" />
                </q-avatar>
                <div>
                  <div class="text-subtitle2 text-weight-bold text-negative">
                    Não se dirija ao balcão para reclamações verbais
                  </div>
                  <div class="text-caption text-slate-600">
                    Reclamações verbais não têm registo nem rastreio oficial.
                  </div>
                </div>
              </div>
              <p class="text-body2 text-slate-700 q-mb-md">
                Utilize o sistema digital <strong>HospitalCare</strong> para garantir que a sua ocorrência fica registada, auditada pela supervisão e com prazo legal de resposta (SLA).
              </p>
              <div class="row q-gutter-sm">
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  label="Submeter Manifestação Agora"
                  icon="add"
                  to="/paciente/processos/novo"
                  class="text-weight-bold"
                />
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  label="Saber mais sobre o HCM"
                  to="/sobre"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pilares de Confiança e Desempenho Institucional -->
    <section class="bg-slate-50 q-py-xl q-px-md">
      <div class="max-w-6xl q-mx-auto row q-col-gutter-xl items-center">
        <div class="col-12 col-md-6">
          <h3 class="text-h4 text-weight-bolder text-slate-800 q-mb-md">
            Garantia de resposta e rigor em cada caso
          </h3>
          <p class="text-body1 text-slate-600 q-mb-md">
            O HospitalCare assegura que nenhuma manifestação é esquecida. Cada processo gera um código oficial, um prazo de resposta monitorizado pela supervisão e histórico auditável.
          </p>
          <q-list dense class="q-gutter-y-sm text-body2 text-slate-700">
            <q-item class="q-pa-none">
              <q-item-section avatar><q-icon name="verified" color="positive" size="22px" /></q-item-section>
              <q-item-section>Atribuição a profissionais qualificados da área clínica em causa</q-item-section>
            </q-item>
            <q-item class="q-pa-none">
              <q-item-section avatar><q-icon name="schedule" color="primary" size="22px" /></q-item-section>
              <q-item-section>Controlo de prazos de primeira resposta (SLA) em até 24 a 48 horas</q-item-section>
            </q-item>
            <q-item class="q-pa-none">
              <q-item-section avatar><q-icon name="lock" color="secondary" size="22px" /></q-item-section>
              <q-item-section>Privacidade e sigilo dos dados do paciente protegidos por lei</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-6">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-card class="hc-card q-pa-lg text-center bg-blue-1">
                <div class="text-h3 text-weight-bolder text-primary">100%</div>
                <div class="text-caption text-slate-700 q-mt-xs font-weight-medium">Processos com Código Único</div>
              </q-card>
            </div>
            <div class="col-6">
              <q-card class="hc-card q-pa-lg text-center bg-blue-grey-1">
                <div class="text-h3 text-weight-bolder text-secondary">&lt; 24h</div>
                <div class="text-caption text-slate-700 q-mt-xs font-weight-medium">Tempo Médio de Primeira Triagem</div>
              </q-card>
            </div>
            <div class="col-6">
              <q-card class="hc-card q-pa-lg text-center bg-green-1">
                <div class="text-h3 text-weight-bolder text-accent">92%</div>
                <div class="text-caption text-slate-700 q-mt-xs font-weight-medium">Índice de Satisfação dos Utentes</div>
              </q-card>
            </div>
            <div class="col-6">
              <q-card class="hc-card q-pa-lg text-center bg-amber-1">
                <div class="text-h3 text-weight-bolder text-warning">Auditado</div>
                <div class="text-caption text-slate-700 q-mt-xs font-weight-medium">Rastreabilidade em Todas as Fases</div>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { processService } from '../../services';
import type { Process } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import ProcessStatusBadge from '../../components/common/ProcessStatusBadge.vue';

// Importação dos assets limpos
import heroNurse from '../../assets/hero/hero-nurse.jpg';
import heroSatisfied from '../../assets/hero/hero-satisfied-patient.jpg';
import heroFamily from '../../assets/hero/hero-family-phone.jpg';
import heroHelping from '../../assets/hero/hero-helping-senior.jpg';
import heroNotice from '../../assets/hero/hero-digital-notice.jpg';

interface HeroSlide {
  id: string;
  image: string;
  caption: string;
}

const slides: HeroSlide[] = [
  {
    id: 'nurse',
    image: heroNurse,
    caption: 'Equipa Médica e Enfermagem — Atendimento Digital HCM'
  },
  {
    id: 'satisfied',
    image: heroSatisfied,
    caption: 'Utentes Satisfeitos e Acompanhamento de Proximidade'
  },
  {
    id: 'family',
    image: heroFamily,
    caption: 'Fácil e ao Alcance de Toda a Família no Telemóvel'
  },
  {
    id: 'helping',
    image: heroHelping,
    caption: 'Apoio e Inclusão Digital para Utentes Seniores'
  },
  {
    id: 'notice',
    image: heroNotice,
    caption: 'Canal Oficial HCM — Evite Filas nos Balcões'
  }
];

const currentSlide = ref(0);
const isPlaying = ref(true);
let slideTimer: ReturnType<typeof setInterval> | null = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
}

function setSlide(index: number) {
  currentSlide.value = index;
}

// Transição ágil de 3.2 segundos (as imagens não demoram a passar)
function startSlideRotation() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    if (isPlaying.value) {
      nextSlide();
    }
  }, 3200);
}

function pauseRotation() {
  isPlaying.value = false;
}

function resumeRotation() {
  isPlaying.value = true;
}

function togglePlayPause() {
  isPlaying.value = !isPlaying.value;
}

// Modal e Consulta rápida de processo
const showLookupModal = ref(false);
const referenceInput = ref('');
const lookingUp = ref(false);
const foundProcess = ref<Process | null>(null);
const lookupError = ref<string | null>(null);
const lookupInputRef = ref<{ focus?: () => void } | null>(null);

function openLookupModal() {
  showLookupModal.value = true;
  foundProcess.value = null;
  lookupError.value = null;
  setTimeout(() => {
    lookupInputRef.value?.focus?.();
  }, 300);
}

async function lookupProcess() {
  if (!referenceInput.value) return;
  lookingUp.value = true;
  foundProcess.value = null;
  lookupError.value = null;

  try {
    const res = await processService.getProcessByReference(referenceInput.value.trim());
    if (res) {
      foundProcess.value = res;
    } else {
      lookupError.value = 'Nenhum processo localizado com esta referência.';
    }
  } catch {
    lookupError.value = 'Erro ao verificar processo. Verifique o código e tente novamente.';
  } finally {
    lookingUp.value = false;
  }
}

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    isPlaying.value = false;
  } else {
    startSlideRotation();
  }
});

onUnmounted(() => {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
  }
});
</script>

<style scoped>
/* ==========================================================================
   Hero Section & Fundo Animado Alternado Visível e Desobstruído
   ========================================================================== */
.hero-section {
  position: relative;
  background-color: #0c2340;
  overflow: hidden;
  min-height: 600px;
}

.hero-bg-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.hero-bg-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center right;
  opacity: 0;
  transform: scale(1.03);
  /* Transição dinâmica e ágil para alternância rápida e visível */
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 3.5s ease-out;
  will-change: opacity, transform;
}

.hero-bg-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

/* Máscara de Gradiente Suave (Deixa o Fundo Perfeitamente Visível) */
.hero-overlay-mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    90deg,
    rgba(12, 35, 64, 0.94) 0%,
    rgba(15, 42, 74, 0.82) 35%,
    rgba(23, 50, 77, 0.42) 65%,
    rgba(23, 50, 77, 0.08) 85%,
    transparent 100%
  );
  pointer-events: none;
}

.hero-content-wrapper {
  position: relative;
  z-index: 3;
}

/* Selo Oficial */
.hero-official-badge {
  background-color: rgba(40, 91, 122, 0.85);
  border: 1px solid rgba(147, 197, 253, 0.4);
  color: #ffffff;
  letter-spacing: 0.04em;
  backdrop-filter: blur(8px);
}

.hero-highlight-word {
  color: #93c5fd;
  text-decoration-line: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
  text-decoration-color: #3b82f6;
}

/* Tipografia Hero */
.hero-title {
  font-size: clamp(2rem, 3.8vw, 3.25rem);
  line-height: 1.15;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  color: #e2e8f0;
  line-height: 1.6;
}

/* Botões do Hero */
.hero-btn-primary {
  background-color: #2563eb !important;
  color: #ffffff !important;
  padding: 10px 24px;
  border-radius: 9999px !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
}

.hero-btn-outline {
  border: 1.5px solid rgba(255, 255, 255, 0.6) !important;
  color: #ffffff !important;
  padding: 10px 22px;
  border-radius: 9999px !important;
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  transition: all 0.2s ease;
}

.hero-btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #ffffff !important;
}

/* Ícones dos Pilares do Hero */
.hero-pill-avatar {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ==========================================================================
   Cartão de Consulta Rápida (Modal)
   ========================================================================== */
.quick-lookup-card {
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 25px 50px -12px rgba(12, 35, 64, 0.35);
}

.quick-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: #eff6ff;
  border-radius: 12px;
}

.quick-lookup-btn {
  background-color: #17324d !important;
  color: #ffffff !important;
  padding: 10px;
  font-size: 0.95rem;
}

.quick-lookup-btn:hover {
  background-color: #102438 !important;
}

/* ==========================================================================
   Controlos de Rotação de Slides
   ========================================================================== */
.slide-dot-btn {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.35);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slide-dot-btn.is-active {
  width: 28px;
  background-color: #93c5fd;
}

.slide-dot-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.slide-playback-toggle {
  background-color: rgba(255, 255, 255, 0.1);
}

.hero-slide-caption-badge {
  background-color: #0c2340;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-weight: 500;
}

/* ==========================================================================
   Canais de Manifestação (Cartões Horizontais com Ícone e Conteúdo Lado a Lado)
   ========================================================================== */
.channel-card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.channel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.channel-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-icon-reclamacoes {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.channel-icon-sugestoes {
  background-color: #f0fdf4;
  color: #15803d;
}

.channel-icon-solicitacoes {
  background-color: #f0f7ff;
  color: #285b7a;
}

.channel-icon-acompanhamento {
  background-color: #f0fdfa;
  color: #0f766e;
}

.channel-arrow-blue { color: #1d4ed8; }
.channel-arrow-green { color: #15803d; }
.channel-arrow-secondary { color: #285b7a; }
.channel-arrow-teal { color: #0f766e; }

.channel-arrow {
  transition: transform 0.2s ease;
}

.channel-card:hover .channel-arrow {
  transform: translateX(4px);
}

/* ==========================================================================
   Caixa de Conscientização
   ========================================================================== */
.awareness-banner-box {
  background-color: #fff8f8;
  border: 1.5px solid #fee2e2;
  border-radius: 18px;
}

/* Utilitários */
.leading-tight { line-height: 1.15; }
.leading-snug { line-height: 1.3; }
.leading-normal { line-height: 1.45; }
.max-w-6xl { max-width: 1200px; }
.max-w-lg { max-width: 560px; }
.max-w-md { max-width: 640px; }
.font-size-11 { font-size: 11px; }
.flex-shrink-0 { flex-shrink: 0; }
.border-y {
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}
.border-blue-2 { border: 1px solid #bfdbfe; }

@media (max-width: 599px) {
  .hero-section {
    min-height: 520px;
  }

  .hero-title {
    font-size: 1.85rem !important;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch !important;
    gap: 12px;
    margin-bottom: 2rem !important;

    .q-btn {
      width: 100%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg-slide {
    transition: opacity 0.5s ease;
    transform: none !important;
  }
}
</style>
