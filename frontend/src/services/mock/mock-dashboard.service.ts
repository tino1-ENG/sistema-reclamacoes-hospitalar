// HospitalCare — Serviço Mock de Métricas de Dashboard
// Calcula indicadores dinamicamente a partir dos processos reais disponíveis

import type { IDashboardService } from '../contracts';
import type { DashboardMetrics, RoleCode } from '../../types';
import { mockProcessService } from './mock-process.service';
import { mockDepartments, mockProcessStatuses } from './mock-data';

class MockDashboardService implements IDashboardService {
  async getMetrics(role: RoleCode, userId?: string): Promise<DashboardMetrics> {
    const filters = role === 'PATIENT' && userId ? { patientId: userId } : undefined;
    const processes = await mockProcessService.getProcesses(filters);

    const total = processes.length;
    const pending = processes.filter((p) => [1, 2].includes(p.statusId)).length; // SUBMITTED, TRIAGE
    const inReview = processes.filter((p) => [3, 4, 5, 6].includes(p.statusId)).length; // ASSIGNED, IN_REVIEW, WAITING
    const resolved = processes.filter((p) => [7, 8].includes(p.statusId)).length; // ANSWERED, CLOSED
    const overdue = processes.filter((p) => p.slaOverdue).length;

    // Distribuição por Tipo
    const typeCounts: Record<string, number> = {};
    processes.forEach((p) => {
      const typeName = p.processType.name;
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
    });
    const distributionByType = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));

    // Distribuição por Departamento
    const deptCounts: Record<string, number> = {};
    processes.forEach((p) => {
      const deptName = p.department?.name || 'Não Atribuído';
      deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
    });
    // Garantir que os departamentos principais aparecem mesmo com 0
    mockDepartments.forEach((d) => {
      if (!deptCounts[d.name]) deptCounts[d.name] = 0;
    });
    const distributionByDepartment = Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count
    }));

    // Distribuição por Estado
    const statusCounts: Record<string, number> = {};
    mockProcessStatuses.forEach((s) => {
      statusCounts[s.name] = 0;
    });
    processes.forEach((p) => {
      const statusName = p.status.name;
      statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
    });
    const distributionByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));

    return {
      totalProcesses: total,
      pendingProcesses: pending,
      inReviewProcesses: inReview,
      resolvedProcesses: resolved,
      overdueProcesses: overdue,
      averageResponseTimeHours: 18.5,
      satisfactionRatePercent: 92,
      distributionByType,
      distributionByDepartment,
      distributionByStatus
    };
  }
}

export const mockDashboardService = new MockDashboardService();
