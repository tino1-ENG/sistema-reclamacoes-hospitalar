// HospitalCare — Serviço Mock de Categorias, Tipos, Estados e Prioridades

import type { ICategoryService } from '../contracts';
import type {
  Category,
  ProcessType,
  ProcessStatus,
  Priority,
  SlaPolicy
} from '../../types';
import {
  mockCategories,
  mockProcessTypes,
  mockProcessStatuses,
  mockPriorities,
  mockSlaPolicies
} from './mock-data';

class MockCategoryService implements ICategoryService {
  async getCategories(): Promise<Category[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...mockCategories];
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await new Promise((r) => setTimeout(r, 100));
    return mockCategories.find((c) => c.id === id) || null;
  }

  async getProcessTypes(): Promise<ProcessType[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...mockProcessTypes];
  }

  async getStatuses(): Promise<ProcessStatus[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...mockProcessStatuses];
  }

  async getPriorities(): Promise<Priority[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...mockPriorities];
  }

  async getSlaPolicies(): Promise<SlaPolicy[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...mockSlaPolicies];
  }
}

export const mockCategoryService = new MockCategoryService();
