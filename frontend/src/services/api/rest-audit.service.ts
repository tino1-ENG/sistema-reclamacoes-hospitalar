import type { IAuditService } from '../contracts';
import type { AuditLog } from '../../types';

export class RestAuditService implements IAuditService {
  private logs: AuditLog[] = [];

  getAuditLogs(limit?: number): Promise<AuditLog[]> {
    void limit;
    return Promise.resolve(this.logs);
  }

  logAction(action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>): Promise<void> {
    this.logs.unshift({
      id: Math.random().toString(),
      action,
      entityType,
      entityId,
      metadata: metadata || {},
      createdAt: new Date().toISOString()
    });
    return Promise.resolve();
  }
}

export const restAuditService = new RestAuditService();
