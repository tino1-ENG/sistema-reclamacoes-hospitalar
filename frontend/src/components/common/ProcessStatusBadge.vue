<template>
  <q-badge
    :color="meta.color"
    class="hc-badge q-py-xs q-px-sm"
    :outline="outline"
  >
    <q-icon :name="meta.icon" size="14px" class="q-mr-xs" />
    <span>{{ meta.label }}</span>
  </q-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { StatusCode } from '../../types';
import { getStatusMeta } from '../../utils/formatters';

const props = withDefaults(
  defineProps<{
    status: StatusCode;
    outline?: boolean;
  }>(),
  {
    outline: false
  }
);

const meta = computed(() => getStatusMeta(props.status));
</script>
