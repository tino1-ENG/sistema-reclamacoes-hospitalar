<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin hc-card" style="min-width: 380px">
      <q-card-section class="row items-center q-pb-none">
        <q-avatar :icon="icon || 'help_outline'" :color="color || 'primary'" text-color="white" size="40px" />
        <div class="text-h6 text-slate-700 q-ml-md">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-md text-body2 text-slate-600">
        {{ message }}
      </q-card-section>

      <q-card-actions align="right" class="q-pt-none q-pb-md q-pr-md">
        <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          no-caps
          :label="confirmLabel || 'Confirmar'"
          :color="color || 'primary'"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

defineProps<{
  title: string;
  message: string;
  icon?: string;
  color?: string;
  confirmLabel?: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

function onOKClick() {
  onDialogOK();
}
</script>
