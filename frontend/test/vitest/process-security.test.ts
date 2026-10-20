import { describe, it, expect, beforeEach } from 'vitest';
import { mockProcessService as processService } from '../../src/services/mock/mock-process.service';
import { mockAuthService as authService } from '../../src/services/mock/mock-auth.service';

describe('Segurança e Regras de Negócio de Processos (HospitalCare)', () => {
  beforeEach(async () => {
    // Garante que o utilizador atual é o paciente inicial
    await authService.switchDemoRole('PATIENT');
  });

  it('oculta estritamente notas internas quando o utilizador for PATIENT', async () => {
    // Processo proc-001 contém a nota interna msg-002 no mock
    const patientMessages = await processService.getMessages('proc-001', 'PATIENT');
    const hasInternalNote = patientMessages.some((m) => m.messageType === 'INTERNAL_NOTE');
    expect(hasInternalNote).toBe(false);

    // Quando consultado por STAFF, a nota interna deve estar visível
    const staffMessages = await processService.getMessages('proc-001', 'STAFF');
    const hasStaffNote = staffMessages.some((m) => m.messageType === 'INTERNAL_NOTE');
    expect(hasStaffNote).toBe(true);
  });

  it('cria um novo processo com código de referência único e estado SUBMITTED', async () => {
    const newProc = await processService.createProcess(
      {
        processTypeId: 1, // COMPLAINT
        categoryId: 'cat-001',
        subject: 'Falta de água potável no piso 2',
        description: 'Constatada falta de água nos bebedouros durante o turno da tarde.'
      },
      'user-pat-001'
    );

    expect(newProc.referenceCode).toMatch(/^HC-2026-\d{6}$/);
    expect(newProc.status.code).toBe('SUBMITTED');
    expect(newProc.statusId).toBe(1);

    const history = await processService.getStatusHistory(newProc.id);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0]?.toStatusName).toBe('Submetido');
  });

  it('permite transição de estado com justificação e regista histórico', async () => {
    const updated = await processService.updateStatus(
      'proc-001',
      7, // ANSWERED
      'Resposta formal enviada ao utente',
      'user-stf-001'
    );

    expect(updated.statusId).toBe(7);
    expect(updated.status.code).toBe('ANSWERED');

    const history = await processService.getStatusHistory('proc-001');
    expect(history[0]?.toStatusId).toBe(7);
    expect(history[0]?.reason).toBe('Resposta formal enviada ao utente');
  });
});
