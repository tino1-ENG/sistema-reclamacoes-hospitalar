import { apiClient } from './api-client';
import type { ICategoryService } from '../contracts';
import type { Category, ProcessType, ProcessStatus, Priority, SlaPolicy } from '../../types';

interface BackendCategory {
  _id: string;
  hospitalId: string;
  name: string;
  code: string;
  description?: string;
  departmentId?: string;
  isActive: boolean;
  createdAt: string;
}

function mapCategory(c: BackendCategory): Category {
  return {
    id: c._id,
    hospitalId: c.hospitalId,
    name: c.name,
    code: c.code,
    description: c.description,
    defaultDepartmentId: c.departmentId,
    isActive: c.isActive,
    createdAt: c.createdAt
  };
}

export class RestCategoryService implements ICategoryService {
  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get('/categories');
    const docs = res.data.data as BackendCategory[];
    return docs.map(mapCategory);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const categories = await this.getCategories();
    return categories.find((c) => c.id === id) || null;
  }

  getProcessTypes(): Promise<ProcessType[]> {
    return Promise.resolve([
      { id: 1, code: 'COMPLAINT', name: 'Reclamação', description: 'Manifestação de desagrado sobre atendimento ou serviços', isActive: true },
      { id: 2, code: 'CLARIFICATION', name: 'Pedido de Esclarecimento', description: 'Dúvidas sobre procedimentos, horários ou direitos', isActive: true },
      { id: 3, code: 'SUGGESTION', name: 'Sugestão', description: 'Ideias de melhoria para os serviços hospitalares', isActive: true }
    ]);
  }

  getStatuses(): Promise<ProcessStatus[]> {
    return Promise.resolve([
      { id: 1, code: 'SUBMITTED', name: 'Submetido', isFinal: false, isPatientVisible: true, sortOrder: 1, isActive: true },
      { id: 2, code: 'TRIAGE', name: 'Em Triagem', isFinal: false, isPatientVisible: true, sortOrder: 2, isActive: true },
      { id: 3, code: 'ASSIGNED', name: 'Atribuído', isFinal: false, isPatientVisible: true, sortOrder: 3, isActive: true },
      { id: 4, code: 'IN_REVIEW', name: 'Em Análise', isFinal: false, isPatientVisible: true, sortOrder: 4, isActive: true },
      { id: 5, code: 'WAITING_PATIENT', name: 'Aguarda Resposta do Paciente', isFinal: false, isPatientVisible: true, sortOrder: 5, isActive: true },
      { id: 6, code: 'WAITING_DEPARTMENT', name: 'Aguarda Resposta do Departamento', isFinal: false, isPatientVisible: true, sortOrder: 6, isActive: true },
      { id: 7, code: 'ANSWERED', name: 'Respondido', isFinal: false, isPatientVisible: true, sortOrder: 7, isActive: true },
      { id: 8, code: 'CLOSED', name: 'Concluído', isFinal: true, isPatientVisible: true, sortOrder: 8, isActive: true },
      { id: 9, code: 'REOPENED', name: 'Reaberto', isFinal: false, isPatientVisible: true, sortOrder: 9, isActive: true }
    ]);
  }

  getPriorities(): Promise<Priority[]> {
    return Promise.resolve([
      { id: 1, code: 'LOW', name: 'Baixa', weight: 1, isActive: true, color: 'blue-grey' },
      { id: 2, code: 'NORMAL', name: 'Normal', weight: 2, isActive: true, color: 'primary' },
      { id: 3, code: 'HIGH', name: 'Alta', weight: 3, isActive: true, color: 'orange-9' },
      { id: 4, code: 'URGENT', name: 'Urgente', weight: 4, isActive: true, color: 'negative' }
    ]);
  }

  getSlaPolicies(): Promise<SlaPolicy[]> {
    return Promise.resolve([
      { id: '1', hospitalId: 'HCM-01', name: 'SLA Urgente', priorityId: 4, firstResponseHours: 4, resolutionHours: 12, isActive: true },
      { id: '2', hospitalId: 'HCM-01', name: 'SLA Alta', priorityId: 3, firstResponseHours: 12, resolutionHours: 24, isActive: true },
      { id: '3', hospitalId: 'HCM-01', name: 'SLA Normal', priorityId: 2, firstResponseHours: 24, resolutionHours: 48, isActive: true },
      { id: '4', hospitalId: 'HCM-01', name: 'SLA Baixa', priorityId: 1, firstResponseHours: 48, resolutionHours: 72, isActive: true }
    ]);
  }
}

export const restCategoryService = new RestCategoryService();
