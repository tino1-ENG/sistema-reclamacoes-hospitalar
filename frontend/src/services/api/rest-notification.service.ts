import type { INotificationService } from '../contracts';
import type { Notification } from '../../types';

export class RestNotificationService implements INotificationService {
  private notifications: Notification[] = [
    {
      id: '1',
      userId: '1',
      eventType: 'PROCESS_UPDATE',
      title: 'Processo em Análise',
      body: 'O seu processo #HC-2026-000101 foi atribuído à Pediatria.',
      readAt: null,
      createdAt: new Date().toISOString()
    }
  ];

  getUserNotifications(userId?: string): Promise<Notification[]> {
    void userId;
    return Promise.resolve(this.notifications);
  }

  markAsRead(notificationId: string): Promise<void> {
    const n = this.notifications.find((item) => item.id === notificationId);
    if (n) n.readAt = new Date().toISOString();
    return Promise.resolve();
  }

  markAllAsRead(userId?: string): Promise<void> {
    void userId;
    this.notifications.forEach((n) => {
      n.readAt = new Date().toISOString();
    });
    return Promise.resolve();
  }
}

export const restNotificationService = new RestNotificationService();
