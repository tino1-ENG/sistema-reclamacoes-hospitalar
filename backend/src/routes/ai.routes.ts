import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

// Estado dos motores de IA (Gemini / Local / Fallback)
router.get('/status', aiController.getStatus);

// Chatbot Acolhe HospitalCare (acessível a utentes anónimos ou autenticados)
router.post('/chat', optionalAuthenticate, aiController.chat);

// Triagem preliminar de manifestações
router.post('/triage', optionalAuthenticate, aiController.triage);

// Copiloto para Funcionários e Supervisão (requer autenticação STAFF, SUPERVISOR ou ADMIN)
router.post('/summarize', authenticate, authorize(['STAFF', 'SUPERVISOR', 'ADMIN']), aiController.summarize);
router.post('/suggest-reply', authenticate, authorize(['STAFF', 'SUPERVISOR', 'ADMIN']), aiController.suggestReply);

export default router;
