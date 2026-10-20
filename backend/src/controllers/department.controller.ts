import type { Request, Response, NextFunction } from 'express';
import { departmentService } from '../services/department.service.js';

export class DepartmentController {
  async listDepartments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await departmentService.getAllDepartments();
      res.json({ success: true, data: departments });
    } catch (err) {
      next(err);
    }
  }

  async listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { departmentId } = req.query;
      const categories = departmentId
        ? await departmentService.getCategoriesByDepartment(departmentId as string)
        : await departmentService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  async listFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faqs = await departmentService.getAllFaqs();
      res.json({ success: true, data: faqs });
    } catch (err) {
      next(err);
    }
  }

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
