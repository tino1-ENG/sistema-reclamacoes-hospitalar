import { apiClient } from './api-client';
import type { INotificationService } from '../contracts';
import type { Notification } from '../../types';

interface BackendNotification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  channel: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export class RestNotificationService implements INotificationService {
  async getUserNotifications(userId?: string): Promise<Notification[]> {
    void userId;
    try {
      const res = await apiClient.get('/notifications');
      const docs = res.data.data as BackendNotification[];
      return docs.map((n) => ({
        id: n._id,
        userId: n.userId,
        eventType: 'PROCESS_UPDATE',
        title: n.title,
        body: n.body,
        readAt: n.readAt || (n.isRead ? new Date().toISOString() : null),
        createdAt: n.createdAt
      }));
    } catch {
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
    } catch {
      // Ignora erro
    }
  }

  async markAllAsRead(userId?: string): Promise<void> {
    void userId;
  }
}

export const restNotificationService = new RestNotificationService();
