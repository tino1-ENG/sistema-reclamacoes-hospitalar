import { z } from 'zod';

export const createProcessSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'O assunto deve ter pelo menos 5 caracteres'),
    description: z.string().min(15, 'A descrição detalhada deve ter pelo menos 15 caracteres'),
    type: z.enum(['COMPLAINT', 'CLARIFICATION', 'SUGGESTION']),
    departmentId: z.string().min(1, 'Selecione o departamento'),
    categoryId: z.string().min(1, 'Selecione a categoria'),
    incidentDate: z.string().optional(),
    incidentLocation: z.string().optional(),
    isAnonymous: z.boolean().default(false),
    patientName: z.string().optional(),
    patientPhone: z.string().optional(),
    patientEmail: z.string().optional()
  })
});

export const lookupProcessSchema = z.object({
  body: z.object({
    referenceNumber: z.string().min(1, 'Introduza o código de referência do processo'),
    pin: z.string().min(4, 'Introduza o PIN de 4 a 6 dígitos')
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'SUBMITTED',
      'TRIAGE',
      'ASSIGNED',
      'IN_REVIEW',
      'WAITING_PATIENT',
      'WAITING_DEPARTMENT',
      'ANSWERED',
      'CLOSED',
      'REOPENED'
    ]),
    reason: z.string().min(3, 'Indique a fundamentação da mudança de estado')
  })
});

export const reassignSchema = z.object({
  body: z.object({
    staffId: z.string().min(1, 'Selecione o funcionário a quem atribuir o processo'),
    reason: z.string().min(3, 'Indique o motivo da reatribuição operacional')
  })
});

export const addMessageSchema = z.object({
  body: z.object({
    body: z.string().min(1, 'A mensagem não pode estar vazia'),
    isInternal: z.boolean().default(false)
  })
});

export const submitFeedbackSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  })
});
