<template>
  <div class="q-pa-xl text-center flex flex-center column">
    <q-spinner-dots color="primary" size="48px" />
    <div class="text-subtitle1 text-slate-600 q-mt-md font-medium">
      {{ message || 'A carregar informações...' }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
