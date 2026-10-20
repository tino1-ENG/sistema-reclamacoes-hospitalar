import { Router } from 'express';
import { departmentController } from '../controllers/department.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/departments', departmentController.listDepartments);
router.get('/categories', departmentController.listCategories);
router.get('/faqs', departmentController.listFaqs);
router.get('/staff', authenticate, authorize(['SUPERVISOR', 'ADMIN']), departmentController.listStaff);

export default router;
