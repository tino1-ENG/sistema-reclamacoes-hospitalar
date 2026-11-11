import { apiClient } from './api-client';
import type { IDepartmentService } from '../contracts';
import type { Department } from '../../types';

interface BackendDepartment {
  _id?: string;
  id?: string;
  hospitalId: string;
  name: string;
  code: string;
  description?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapDepartment(d: BackendDepartment): Department {
  return {
    id: d._id || d.id || '',
    hospitalId: d.hospitalId,
    name: d.name,
    code: d.code,
    description: d.description,
    isActive: d.isActive,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  };
}

export class RestDepartmentService implements IDepartmentService {
  async getDepartments(): Promise<Department[]> {
    const res = await apiClient.get('/departments');
    const docs = res.data.data as BackendDepartment[];
    return docs.map(mapDepartment);
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    const departments = await this.getDepartments();
    return departments.find((d) => d.id === id) || null;
  }

  async createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const res = await apiClient.post('/departments', department);
    return mapDepartment(res.data.data);
  }

  async updateDepartment(id: string, department: Partial<Department>): Promise<Department> {
    const res = await apiClient.put(`/departments/${id}`, department);
    return mapDepartment(res.data.data);
  }
}

export const restDepartmentService = new RestDepartmentService();
