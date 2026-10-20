import { Department, Category, Faq, User } from '../models/index.js';

export class DepartmentService {
  async getAllDepartments() {
    return await Department.find({ isActive: true }).sort({ name: 1 });
  }

  async getCategoriesByDepartment(departmentId: string) {
    return await Category.find({ departmentId, isActive: true }).sort({ name: 1 });
  }

  async getAllCategories() {
    return await Category.find({ isActive: true }).populate('departmentId', 'name code').sort({ name: 1 });
  }

  async getAllFaqs() {
    return await Faq.find({ isActive: true }).sort({ orderIndex: 1 });
  }

  async getStaffUsers() {
    return await User.find({ roles: { $in: ['STAFF', 'SUPERVISOR'] }, status: 'ACTIVE' })
      .select('fullName email phone roles departmentId')
      .populate('departmentId', 'name code')
      .sort({ fullName: 1 });
  }
}

export const departmentService = new DepartmentService();
