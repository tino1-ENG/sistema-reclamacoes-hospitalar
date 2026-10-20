<template>
  <q-card class="hc-card q-pa-md">
    <div class="row items-center justify-between no-wrap">
      <div>
        <div class="text-caption text-uppercase text-weight-bold text-slate-500 letter-spacing-1">
          {{ title }}
        </div>
        <div class="text-h4 text-weight-bolder text-slate-700 q-mt-xs">
          {{ value }}
        </div>
        <div v-if="subtitle" class="text-caption text-slate-500 q-mt-xs">
          {{ subtitle }}
        </div>
      </div>
      <q-avatar
        size="48px"
        :color="colorBg || 'blue-1'"
        :text-color="colorText || 'primary'"
        class="q-ml-sm"
      >
        <q-icon :name="icon" size="28px" />
      </q-avatar>
    </div>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  colorBg?: string;
  colorText?: string;
}>();
</script>

<style scoped>
.letter-spacing-1 {
  letter-spacing: 0.05em;
}
</style>
