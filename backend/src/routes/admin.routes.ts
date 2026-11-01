import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { getUsers, createUser, toggleUserStatus } from '../controllers/admin.controller.js';

const router = Router();

// Todas as rotas de administração exigem perfil ADMIN ou SUPERVISOR
router.use(authenticate, authorize(['ADMIN', 'SUPERVISOR']));

router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id/toggle', toggleUserStatus);

export default router;
