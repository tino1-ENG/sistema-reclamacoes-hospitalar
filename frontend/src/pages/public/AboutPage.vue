<template>
  <q-page class="q-py-xl q-px-md max-w-4xl q-mx-auto">
    <div class="hc-section-header text-center q-mb-xl">
      <div class="text-caption text-uppercase text-weight-bold text-primary">INSTITUCIONAL</div>
      <h1 class="hc-title q-mt-xs">Sobre o HospitalCare</h1>
      <p class="hc-subtitle">
        Transparência, qualidade e melhoria contínua dos serviços hospitalares em Moçambique.
      </p>
    </div>

    <q-card class="hc-card q-pa-xl q-mb-lg">
      <h2 class="text-h5 text-weight-bold text-slate-800 q-mb-md">A Nossa Missão</h2>
      <p class="text-body1 text-slate-600 leading-relaxed q-mb-lg">
        O <strong>HospitalCare</strong> é um sistema pioneiro desenhado para aproximar os pacientes da gestão e dos profissionais hospitalares. A plataforma permite que utentes apresentem reclamações legítimas, solicitações de informação e propostas construtivas com a garantia de que cada manifestação é tratada de forma estruturada, confidencial e em tempo útil.
      </p>

      <h2 class="text-h5 text-weight-bold text-slate-800 q-mb-md">Como Funciona o Fluxo de Resolução?</h2>
      <div class="row q-col-gutter-md q-my-md">
        <div class="col-12 col-md-3">
          <div class="q-pa-md bg-slate-50 rounded-borders text-center full-height">
            <q-avatar size="40px" color="blue-1" text-color="primary" class="q-mb-sm">1</q-avatar>
            <div class="text-weight-bold text-slate-700">Registo & Código</div>
            <div class="text-caption text-slate-500 q-mt-xs">Geração de código único para acompanhamento.</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-pa-md bg-slate-50 rounded-borders text-center full-height">
            <q-avatar size="40px" color="blue-grey-1" text-color="secondary" class="q-mb-sm">2</q-avatar>
            <div class="text-weight-bold text-slate-700">Triagem</div>
            <div class="text-caption text-slate-500 q-mt-xs">Supervisão encaminha o caso ao departamento competente.</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-pa-md bg-slate-50 rounded-borders text-center full-height">
            <q-avatar size="40px" color="green-1" text-color="accent" class="q-mb-sm">3</q-avatar>
            <div class="text-weight-bold text-slate-700">Tratamento</div>
            <div class="text-caption text-slate-500 q-mt-xs">Análise interna e esclarecimento direto ao paciente.</div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="q-pa-md bg-slate-50 rounded-borders text-center full-height">
            <q-avatar size="40px" color="green-1" text-color="positive" class="q-mb-sm">4</q-avatar>
            <div class="text-weight-bold text-slate-700">Conclusão</div>
            <div class="text-caption text-slate-500 q-mt-xs">Encerramento formal e avaliação do utente.</div>
          </div>
        </div>
      </div>

      <h2 class="text-h5 text-weight-bold text-slate-800 q-mt-xl q-mb-md">Privacidade e Proteção de Dados</h2>
      <p class="text-body1 text-slate-600 leading-relaxed q-mb-none">
        Em conformidade com as melhores práticas de ética clínica e a legislação de Moçambique, todos os dados pessoais do paciente e as informações trocadas nos processos são confidenciais. Apenas a equipa técnica autorizada tem acesso ao histórico do processo.
      </p>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
// Página Sobre
</script>

<style scoped>
.max-w-4xl { max-width: 900px; }
.leading-relaxed { line-height: 1.7; }
</style>
