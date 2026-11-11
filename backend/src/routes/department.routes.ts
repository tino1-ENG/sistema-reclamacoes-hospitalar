import { Router } from 'express';
import { departmentController } from '../controllers/department.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

// --- Departamentos ---
router.get('/departments', departmentController.listDepartments);
router.post('/departments', authenticate, authorize(['ADMIN']), departmentController.createDepartment);
router.put('/departments/:id', authenticate, authorize(['ADMIN']), departmentController.updateDepartment);
router.delete('/departments/:id', authenticate, authorize(['ADMIN']), departmentController.deleteDepartment);

// --- Categorias ---
router.get('/categories', departmentController.listCategories);

// --- FAQs ---
router.get('/faqs', departmentController.listFaqs);
router.post('/faqs', authenticate, authorize(['ADMIN']), departmentController.createFaq);
router.put('/faqs/:id', authenticate, authorize(['ADMIN']), departmentController.updateFaq);
router.delete('/faqs/:id', authenticate, authorize(['ADMIN']), departmentController.deleteFaq);

// --- Políticas de SLA ---
router.get('/sla-policies', departmentController.listSlaPolicies);
router.post('/sla-policies', authenticate, authorize(['ADMIN']), departmentController.saveSlaPolicy);

// --- Definições do Hospital ---
router.get('/hospital', departmentController.getHospitalSettings);
router.put('/hospital', authenticate, authorize(['ADMIN']), departmentController.updateHospitalSettings);

// --- Notificações ---
router.get('/notifications', authenticate, departmentController.listNotifications);
router.patch('/notifications/:id/read', authenticate, departmentController.markNotificationRead);

// --- Funcionários / Staff ---
router.get('/staff', authenticate, authorize(['SUPERVISOR', 'ADMIN']), departmentController.listStaff);

export default router;
