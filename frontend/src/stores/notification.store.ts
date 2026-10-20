// HospitalCare — Pinia Store de Notificações

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Notification } from '../types';
import { notificationService } from '../services';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const loading = ref<boolean>(false);

  const unreadCount = computed(() => notifications.value.filter((n) => !n.readAt).length);

  async function loadUserNotifications(userId: string): Promise<void> {
    loading.value = true;
    try {
      notifications.value = await notificationService.getUserNotifications(userId);
    } finally {
      loading.value = false;
    }
  }

  async function markAsRead(id: string): Promise<void> {
    await notificationService.markAsRead(id);
    const target = notifications.value.find((n) => n.id === id);
    if (target) {
      target.readAt = new Date().toISOString();
    }
  }

  async function markAllAsRead(userId: string): Promise<void> {
    await notificationService.markAllAsRead(userId);
    const now = new Date().toISOString();
    notifications.value.forEach((n) => {
      n.readAt = now;
    });
  }

  return {
    notifications,
    loading,
    unreadCount,
    loadUserNotifications,
    markAsRead,
    markAllAsRead
  };
});
