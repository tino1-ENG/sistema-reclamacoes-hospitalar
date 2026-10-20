<template>
  <div class="q-pa-xl text-center flex flex-center column">
    <div class="q-mb-md">
      <q-avatar size="64px" color="blue-1" text-color="primary">
        <q-icon :name="icon || 'inbox'" size="36px" />
      </q-avatar>
    </div>
    <div class="text-h6 text-slate-700 q-mb-xs">
      {{ title || 'Nenhum registo encontrado' }}
    </div>
    <div class="text-body2 text-slate-500 q-mb-lg max-w-md">
      {{ description || 'Não existem dados correspondentes aos filtros selecionados no momento.' }}
    </div>
    <slot name="action">
      <q-btn
        v-if="actionLabel"
        unelevated
        color="primary"
        no-caps
        :label="actionLabel"
        :icon="actionIcon"
        @click="$emit('action')"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  actionIcon?: string;
}>();

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<style scoped>
.max-w-md {
  max-width: 420px;
}
</style>
