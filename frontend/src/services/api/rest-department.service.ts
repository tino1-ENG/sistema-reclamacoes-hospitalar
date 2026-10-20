import { apiClient } from './api-client';
import type { IDepartmentService } from '../contracts';
import type { Department } from '../../types';

interface BackendDepartment {
  _id: string;
  hospitalId: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapDepartment(d: BackendDepartment): Department {
  return {
    id: d._id,
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

  createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    return Promise.resolve({
      ...department,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async updateDepartment(id: string, department: Partial<Department>): Promise<Department> {
    const existing = await this.getDepartmentById(id);
    return {
      ...(existing || {
        id,
        hospitalId: '',
        name: '',
        code: '',
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }),
      ...department
    };
  }
}

export const restDepartmentService = new RestDepartmentService();
