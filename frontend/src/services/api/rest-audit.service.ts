import { apiClient } from './api-client';
import type { IAuditService } from '../contracts';
import type { AuditLog } from '../../types';

interface BackendAuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export class RestAuditService implements IAuditService {
  async getAuditLogs(limit?: number): Promise<AuditLog[]> {
    try {
      const res = await apiClient.get('/admin/audit-logs', {
        params: { limit: limit || 100 }
      });
      const docs = res.data.data as BackendAuditLog[];
      return docs.map((d) => ({
        id: d.id,
        actorUserId: d.userId,
        actorName: d.userName || 'Sistema',
        action: d.action,
        entityType: d.entity,
        entityId: d.entityId,
        metadata: d.details || {},
        ipAddress: d.ipAddress,
        createdAt: d.createdAt
      }));
    } catch {
      return [];
    }
  }

  async logAction(action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>): Promise<void> {
    void action;
    void entityType;
    void entityId;
    void metadata;
    // O backend já efetua o registo de auditoria automaticamente através de Mongoose hooks e controllers
  }
}

export const restAuditService = new RestAuditService();
