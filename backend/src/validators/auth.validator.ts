import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Introduza o seu telefone, email ou utilizador'),
    password: z.string().min(1, 'Introduza a sua palavra-passe ou PIN'),
    roleHint: z.enum(['PATIENT', 'STAFF', 'SUPERVISOR', 'ADMIN']).optional()
  })
});

export const registerPatientSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'O nome completo deve ter pelo menos 2 caracteres'),
    phone: z.string().min(6, 'O número de telefone deve ser válido'),
    email: z.string().email('Email inválido').optional().or(z.literal('')).nullish(),
    password: z.string().min(4, 'A palavra-passe/PIN deve ter pelo menos 4 caracteres')
  })
});
