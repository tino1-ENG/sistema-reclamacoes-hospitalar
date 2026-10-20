// HospitalCare — Serviço Mock de Auditoria

import type { IAuditService } from '../contracts';
import type { AuditLog } from '../../types';
import { mockAuditLogs, mockUsers } from './mock-data';

class MockAuditService implements IAuditService {
  private logs: AuditLog[] = [...mockAuditLogs];

  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    await new Promise((r) => setTimeout(r, 150));
    return this.logs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async logAction(
    action: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await Promise.resolve();
    const actor = mockUsers[0] ?? { id: 'sys', fullName: 'Sistema' };
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: actor.id,
      actorName: actor.fullName,
      action,
      entityType,
      entityId,
      metadata: metadata || {},
      createdAt: new Date().toISOString()
    };
    this.logs.unshift(log);
  }
}

export const mockAuditService = new MockAuditService();
