import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rate-limiter.js';
import { loginSchema, registerPatientSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/register', validate(registerPatientSchema), authController.registerPatient);
router.get('/me', authenticate, authController.getMe);

export default router;
