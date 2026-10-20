import { Router } from 'express';
import { processController } from '../controllers/process.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.js';
import {
  createProcessSchema,
  lookupProcessSchema,
  updateStatusSchema,
  reassignSchema,
  addMessageSchema,
  submitFeedbackSchema
} from '../validators/process.validator.js';

const router = Router();

// Submissão de novo processo (aberto a pacientes autenticados ou anónimos)
router.post('/', optionalAuthenticate, validate(createProcessSchema), processController.create);

// Consulta pública por código de referência e PIN
router.post('/lookup', validate(lookupProcessSchema), processController.lookup);

// Listagem de processos (filtrado por perfil RBAC)
router.get('/', authenticate, processController.list);

// Obtenção de detalhes de um processo
router.get('/:id', authenticate, processController.getById);

// Mensagens do processo (com aplicação de confidencialidade)
router.get('/:id/messages', authenticate, processController.getMessages);
router.post('/:id/messages', authenticate, validate(addMessageSchema), processController.addMessage);

// Alteração de estado (STAFF, SUPERVISOR, ADMIN)
router.patch(
  '/:id/status',
  authenticate,
  authorize(['STAFF', 'SUPERVISOR', 'ADMIN']),
  validate(updateStatusSchema),
  processController.updateStatus
);

// Reatribuição operacional (SUPERVISOR, ADMIN)
router.post(
  '/:id/reassign',
  authenticate,
  authorize(['SUPERVISOR', 'ADMIN']),
  validate(reassignSchema),
  processController.reassign
);

// Submissão de avaliação de satisfação (PATIENT)
router.post(
  '/:id/feedback',
  authenticate,
  authorize(['PATIENT']),
  validate(submitFeedbackSchema),
  processController.submitFeedback
);

export default router;
