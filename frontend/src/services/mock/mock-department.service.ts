// HospitalCare — Serviço Mock de Departamentos

import type { IDepartmentService } from '../contracts';
import type { Department } from '../../types';
import { mockDepartments } from './mock-data';

class MockDepartmentService implements IDepartmentService {
  private departments: Department[] = [...mockDepartments];

  async getDepartments(): Promise<Department[]> {
    await new Promise((r) => setTimeout(r, 150));
    return [...this.departments];
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    await new Promise((r) => setTimeout(r, 100));
    return this.departments.find((d) => d.id === id) || null;
  }

  async createDepartment(
    data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Department> {
    await new Promise((r) => setTimeout(r, 250));
    const newDept: Department = {
      ...data,
      id: `dep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.departments.push(newDept);
    return newDept;
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    await new Promise((r) => setTimeout(r, 250));
    const existing = this.departments.find((d) => d.id === id);
    if (!existing) throw new Error('Departamento não encontrado');

    const updated: Department = {
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    const index = this.departments.findIndex((d) => d.id === id);
    this.departments[index] = updated;
    return updated;
  }
}

export const mockDepartmentService = new MockDepartmentService();
