<template>
  <q-card class="hc-card hc-card--interactive q-pa-md stat-card">
    <div class="row items-center justify-between no-wrap">
      <div>
        <div class="text-caption text-uppercase text-weight-bolder text-slate-500 stat-label">
          {{ title }}
        </div>
        <div class="text-h4 text-weight-bolder text-hospital-navy q-mt-xs stat-value">
          {{ value }}
        </div>
        <div v-if="subtitle" class="text-caption text-slate-500 q-mt-xs row items-center">
          <span>{{ subtitle }}</span>
        </div>
      </div>
      <div
        class="stat-icon-wrapper flex flex-center"
        :style="{ backgroundColor: avatarBgColor, color: avatarTextColor }"
      >
        <q-icon :name="icon" size="26px" />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  colorBg?: string;
  colorText?: string;
}>();

const avatarBgColor = computed(() => {
  if (props.colorBg?.startsWith('#') || props.colorBg?.startsWith('rgba')) return props.colorBg;
  return '#F0F9FF'; // Sky 50 default
});

const avatarTextColor = computed(() => {
  if (props.colorText?.startsWith('#')) return props.colorText;
  return '#0284C7'; // Sky 600 default
});
</script>

<style scoped lang="scss">
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%);
  border: 1px solid rgba(224, 242, 254, 0.85);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #0284C7 0%, #10B981 100%);
    opacity: 0.85;
  }
}

.stat-label {
  letter-spacing: 0.06em;
  font-size: 0.725rem;
}

.stat-value {
  letter-spacing: -0.03em;
  color: #075985;
}

.stat-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.12);
  transition: transform 0.25s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.08);
}
</style>
