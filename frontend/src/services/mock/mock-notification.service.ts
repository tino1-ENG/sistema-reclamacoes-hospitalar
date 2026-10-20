// HospitalCare — Serviço Mock de Notificações

import type { INotificationService } from '../contracts';
import type { Notification } from '../../types';
import { mockNotifications } from './mock-data';

class MockNotificationService implements INotificationService {
  private notifications: Notification[] = [...mockNotifications];

  async getUserNotifications(userId: string): Promise<Notification[]> {
    await new Promise((r) => setTimeout(r, 120));
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 80));
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.readAt = new Date().toISOString();
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    const now = new Date().toISOString();
    this.notifications.forEach((n) => {
      if (n.userId === userId && !n.readAt) {
        n.readAt = now;
      }
    });
  }
}

export const mockNotificationService = new MockNotificationService();
