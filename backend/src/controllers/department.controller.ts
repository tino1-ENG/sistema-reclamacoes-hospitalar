import type { Request, Response, NextFunction } from 'express';
import { departmentService } from '../services/department.service.js';

export class DepartmentController {
  // Departamentos
  async listDepartments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await departmentService.getAllDepartments();
      res.json({ success: true, data: departments });
    } catch (err) {
      next(err);
    }
  }

  async createDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, code, description, phone, email } = req.body;
      if (!name || !code) {
        res.status(400).json({ success: false, message: 'Nome e código do departamento são obrigatórios.' });
        return;
      }
      const department = await departmentService.createDepartment({ name, code, description, phone, email });
      res.status(201).json({ success: true, data: department });
    } catch (err) {
      next(err);
    }
  }

  async updateDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const department = await departmentService.updateDepartment(id, req.body);
      res.json({ success: true, data: department });
    } catch (err) {
      next(err);
    }
  }

  async deleteDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await departmentService.deleteDepartment(id);
      res.json({ success: true, message: 'Departamento desativado com sucesso.' });
    } catch (err) {
      next(err);
    }
  }

  // Categorias
  async listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { departmentId } = req.query;
      const categories = departmentId
        ? await departmentService.getCategoriesByDepartment(String(departmentId))
        : await departmentService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  // FAQs
  async listFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faqs = await departmentService.getAllFaqs();
      res.json({ success: true, data: faqs });
    } catch (err) {
      next(err);
    }
  }

  async createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, question, answer, orderIndex } = req.body;
      if (!category || !question || !answer) {
        res.status(400).json({ success: false, message: 'Categoria, pergunta e resposta são obrigatórias.' });
        return;
      }
      const faq = await departmentService.createFaq({ category, question, answer, orderIndex });
      res.status(201).json({ success: true, data: faq });
    } catch (err) {
      next(err);
    }
  }

  async updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const faq = await departmentService.updateFaq(id, req.body);
      res.json({ success: true, data: faq });
    } catch (err) {
      next(err);
    }
  }

  async deleteFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await departmentService.deleteFaq(id);
      res.json({ success: true, message: 'FAQ removida com sucesso.' });
    } catch (err) {
      next(err);
    }
  }

  // SLA Policies
  async listSlaPolicies(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policies = await departmentService.getSlaPolicies();
      res.json({ success: true, data: policies });
    } catch (err) {
      next(err);
    }
  }

  async saveSlaPolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policy = await departmentService.saveSlaPolicy(req.body);
      res.json({ success: true, data: policy });
    } catch (err) {
      next(err);
    }
  }

  // Hospital Settings
  async getHospitalSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospital = await departmentService.getHospitalSettings();
      res.json({ success: true, data: hospital });
    } catch (err) {
      next(err);
    }
  }

  async updateHospitalSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospital = await departmentService.updateHospitalSettings(req.body);
      res.json({ success: true, data: hospital, message: 'Definições do hospital atualizadas com sucesso.' });
    } catch (err) {
      next(err);
    }
  }

  // Notificações
  async listNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const notifications = await departmentService.getUserNotifications(userId);
      res.json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  }

  async markNotificationRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const userId = req.user!.id;
      const updated = await departmentService.markNotificationAsRead(id, userId);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  // Staff
  async listStaff(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const staff = await departmentService.getStaffUsers();
      res.json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  }
}

export const departmentController = new DepartmentController();
