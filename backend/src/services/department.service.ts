import { Department, Category, Faq, User, SlaPolicy, Hospital, Notification, type IDepartment, type IFaq, type ISlaPolicy } from '../models/index.js';

export class DepartmentService {
  // --- Departamentos ---
  async getAllDepartments() {
    return await Department.find({ isActive: true }).sort({ name: 1 });
  }

  async createDepartment(data: { name: string; code: string; description?: string; phone?: string; email?: string }) {
    const existing = await Department.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      throw new Error(`Já existe um departamento com o código ${data.code}.`);
    }

    // Procura o hospital principal
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = await Hospital.create({
        name: 'Hospital Central de Maputo',
        code: 'HCM-001',
        timezone: 'Africa/Maputo',
        currency: 'MZN'
      });
    }

    return await Department.create({
      hospitalId: hospital._id,
      code: data.code.toUpperCase().trim(),
      name: data.name.trim(),
      description: data.description?.trim(),
      phone: data.phone?.trim(),
      email: data.email?.trim(),
      isActive: true
    });
  }

  async updateDepartment(id: string, data: Partial<IDepartment>) {
    const dept = await Department.findById(id);
    if (!dept) {
      throw new Error('Departamento não encontrado.');
    }

    if (data.name) dept.name = data.name.trim();
    if (data.code) dept.code = data.code.toUpperCase().trim();
    if (data.description !== undefined) dept.description = data.description?.trim();
    if (data.phone !== undefined) dept.phone = data.phone?.trim();
    if (data.email !== undefined) dept.email = data.email?.trim();
    if (data.isActive !== undefined) dept.isActive = data.isActive;

    return await dept.save();
  }

  async deleteDepartment(id: string) {
    const dept = await Department.findById(id);
    if (!dept) {
      throw new Error('Departamento não encontrado.');
    }
    dept.isActive = false;
    return await dept.save();
  }

  // --- Categorias ---
  async getCategoriesByDepartment(departmentId: string) {
    return await Category.find({ departmentId, isActive: true }).sort({ name: 1 });
  }

  async getAllCategories() {
    return await Category.find({ isActive: true }).populate('departmentId', 'name code').sort({ name: 1 });
  }

  // --- SLAs ---
  async getSlaPolicies() {
    return await SlaPolicy.find({ isActive: true }).populate('categoryId', 'name code');
  }

  async saveSlaPolicy(data: { priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'; responseTimeHours: number; resolutionTimeHours: number; categoryId?: string }) {
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = await Hospital.create({
        name: 'Hospital Central de Maputo',
        code: 'HCM-001',
        timezone: 'Africa/Maputo',
        currency: 'MZN'
      });
    }

    const query: Record<string, unknown> = {
      hospitalId: hospital._id,
      priority: data.priority
    };
    if (data.categoryId) {
      query.categoryId = data.categoryId;
    }

    return await SlaPolicy.findOneAndUpdate(
      query,
      {
        hospitalId: hospital._id,
        priority: data.priority,
        responseTimeHours: data.responseTimeHours,
        resolutionTimeHours: data.resolutionTimeHours,
        categoryId: data.categoryId || undefined,
        isActive: true
      },
      { upsert: true, new: true }
    );
  }

  // --- Hospital Settings ---
  async getHospitalSettings() {
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = await Hospital.create({
        name: 'Hospital Central de Maputo',
        code: 'HCM-001',
        address: 'Av. Eduardo Mondlane, nº 1500, Maputo',
        phone: '+258 21 350 400',
        email: 'contacto@hcm.gov.mz',
        timezone: 'Africa/Maputo',
        currency: 'MZN',
        isActive: true
      });
    }
    return hospital;
  }

  async updateHospitalSettings(data: { name?: string; address?: string; phone?: string; email?: string; timezone?: string }) {
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = new Hospital({
        code: 'HCM-001',
        timezone: 'Africa/Maputo',
        currency: 'MZN'
      });
    }

    if (data.name) hospital.name = data.name.trim();
    if (data.address !== undefined) hospital.address = data.address?.trim();
    if (data.phone !== undefined) hospital.phone = data.phone?.trim();
    if (data.email !== undefined) hospital.email = data.email?.trim();
    if (data.timezone !== undefined) hospital.timezone = data.timezone;

    return await hospital.save();
  }

  // --- Perguntas Frequentes (FAQs) ---
  async getAllFaqs() {
    return await Faq.find({ isActive: true }).sort({ orderIndex: 1 });
  }

  async createFaq(data: { category: string; question: string; answer: string; orderIndex?: number }) {
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = await Hospital.create({
        name: 'Hospital Central de Maputo',
        code: 'HCM-001',
        timezone: 'Africa/Maputo',
        currency: 'MZN'
      });
    }

    return await Faq.create({
      hospitalId: hospital._id,
      category: data.category.trim(),
      question: data.question.trim(),
      answer: data.answer.trim(),
      orderIndex: data.orderIndex ?? 0,
      isActive: true
    });
  }

  async updateFaq(id: string, data: Partial<IFaq>) {
    const faq = await Faq.findById(id);
    if (!faq) {
      throw new Error('FAQ não encontrada.');
    }

    if (data.category) faq.category = data.category.trim();
    if (data.question) faq.question = data.question.trim();
    if (data.answer) faq.answer = data.answer.trim();
    if (data.orderIndex !== undefined) faq.orderIndex = data.orderIndex;
    if (data.isActive !== undefined) faq.isActive = data.isActive;

    return await faq.save();
  }

  async deleteFaq(id: string) {
    const faq = await Faq.findById(id);
    if (!faq) {
      throw new Error('FAQ não encontrada.');
    }
    faq.isActive = false;
    return await faq.save();
  }

  // --- Notificações ---
  async getUserNotifications(userId: string) {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  }

  async markNotificationAsRead(id: string, userId: string) {
    return await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  // --- Funcionários / Staff ---
  async getStaffUsers() {
    return await User.find({ roles: { $in: ['STAFF', 'SUPERVISOR'] }, status: 'ACTIVE' })
      .select('fullName email phone roles departmentId')
      .populate('departmentId', 'name code')
      .sort({ fullName: 1 });
  }
}

export const departmentService = new DepartmentService();
