import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { Department, Category } from '../src/models/index.js';

describe('FASE 4 — Testes End-to-End e Cenários de Qualidade HospitalCare', () => {
  let patientToken = '';
  let patientId = '';
  let patientProcessId = '';
  let patientProcessRef = '';
  let patientProcessPin = '';

  let staffToken = '';
  let staffId = '';
  let supervisorToken = '';
  let adminToken = '';

  let departmentId = '';
  let categoryId = '';

  beforeAll(async () => {
    await connectDatabase();

    // Obter IDs de departamento e categoria para os testes
    const dept = await Department.findOne({ code: 'PED' });
    if (dept) departmentId = dept._id.toString();

    const cat = await Category.findOne({ code: 'TEMPO_ESPERA' });
    if (cat) categoryId = cat._id.toString();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  // ==========================================
  // CENÁRIO A — PACIENTE
  // ==========================================
  describe('Cenário A — Jornada do Paciente', () => {
    const testPhone = `+258 84 ${Math.floor(1000000 + Math.random() * 9000000)}`;

    it('A.1: Registo de nova conta de paciente com telemóvel Moçambicano', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Joaquim Chissano Júnior',
          phone: testPhone,
          email: `joaquim.${Date.now()}@exemplo.co.mz`,
          password: 'senha_segura_123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.fullName).toBe('Joaquim Chissano Júnior');
      expect(res.body.data.user.roles).toContain('PATIENT');
      patientId = res.body.data.user.id;
    });

    it('A.2: Início de sessão do paciente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: testPhone,
          password: 'senha_segura_123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      patientToken = res.body.data.token;
    });

    it('A.3: Submissão de nova reclamação hospitalar', async () => {
      const res = await request(app)
        .post('/api/processes')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          title: 'Demora no atendimento de urgência pediátrica',
          description: 'Apresentámo-nos com o meu filho febril às 14h e apenas fomos atendidos às 18h.',
          type: 'COMPLAINT',
          departmentId,
          categoryId,
          incidentDate: '2026-10-15T14:00:00Z',
          incidentLocation: 'Triagem da Pediatria'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.process.referenceNumber).toMatch(/^#HC-2026-\d{6}$/);
      expect(res.body.data.process.status).toBe('SUBMITTED');
      expect(res.body.data.trackingPin).toBeDefined();

      patientProcessId = res.body.data.process._id;
      patientProcessRef = res.body.data.process.referenceNumber;
      patientProcessPin = res.body.data.trackingPin;
    });

    it('A.4: Consulta e acompanhamento do processo pelo paciente', async () => {
      const res = await request(app)
        .get(`/api/processes/${patientProcessId}`)
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.process.referenceNumber).toBe(patientProcessRef);
      expect(res.body.data.process.status).toBe('SUBMITTED');
      expect(res.body.data.history.length).toBeGreaterThan(0);
      expect(res.body.data.history[0].toStatus).toBe('SUBMITTED');
    });

    it('A.5: Paciente envia mensagem de esclarecimento adicional no processo', async () => {
      const res = await request(app)
        .post(`/api/processes/${patientProcessId}/messages`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          body: 'Gostaria de acrescentar que a enfermeira de serviço informou que faltavam termómetros.'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.messageType).toBe('PATIENT_MESSAGE');
      expect(res.body.data.isInternal).toBe(false);
    });

    it('A.6: Consulta pública por Código de Referência e PIN (sem necessidade de login)', async () => {
      const res = await request(app)
        .post('/api/processes/lookup')
        .send({
          referenceNumber: patientProcessRef,
          pin: patientProcessPin
        });

      expect(res.status).toBe(200);
      expect(res.body.data.process.referenceNumber).toBe(patientProcessRef);
      expect(res.body.data.messages.length).toBeGreaterThan(0);
      // Nenhuma nota confidencial exposta
      expect(res.body.data.messages.every((m: { isInternal: boolean }) => !m.isInternal)).toBe(true);
    });
  });

  // ==========================================
  // CENÁRIO B — FUNCIONÁRIO / STAFF CLÍNICO
  // ==========================================
  describe('Cenário B — Espaço de Trabalho do Funcionário', () => {
    it('B.1: Funcionário clínico (Dr. Carlos) inicia sessão', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'carlos.mondlane@hcm.gov.mz',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.roles).toContain('STAFF');
      staffToken = res.body.data.token;
      staffId = res.body.data.user.id;
    });

    it('B.2: Funcionário consulta lista de processos do seu departamento', async () => {
      const res = await request(app)
        .get('/api/processes')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('B.3: Funcionário responde oficialmente ao paciente e adiciona nota interna confidencial', async () => {
      // 1. Resposta pública ao paciente
      const publicRes = await request(app)
        .post(`/api/processes/${patientProcessId}/messages`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          body: 'Estimado utente, confirmamos a receção do seu pedido e estamos a auditar os tempos de triagem.',
          isInternal: false
        });
      expect(publicRes.status).toBe(201);
      expect(publicRes.body.data.isInternal).toBe(false);

      // 2. Nota interna confidencial (análise de escala médica)
      const internalRes = await request(app)
        .post(`/api/processes/${patientProcessId}/messages`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          body: 'NOTA INTERNA: No dia 15 houve avaria no sistema de chamadas e apenas 1 médico no turno da tarde.',
          isInternal: true
        });
      expect(internalRes.status).toBe(201);
      expect(internalRes.body.data.isInternal).toBe(true);
    });

    it('B.4: Funcionário atualiza o estado do processo para IN_REVIEW com justificação', async () => {
      const res = await request(app)
        .patch(`/api/processes/${patientProcessId}/status`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'IN_REVIEW',
          reason: 'A aguardar relatório circunstanciado da equipa de enfermagem.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('IN_REVIEW');
    });

    it('B.5: Confirmação do registo no histórico de estados', async () => {
      const res = await request(app)
        .get(`/api/processes/${patientProcessId}`)
        .set('Authorization', `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      const history = res.body.data.history;
      const reviewEntry = history.find((h: { toStatus: string }) => h.toStatus === 'IN_REVIEW');
      expect(reviewEntry).toBeDefined();
      expect(reviewEntry.reason).toContain('A aguardar relatório');
    });
  });

  // ==========================================
  // CENÁRIO C — SUPERVISOR DE TRIAGEM E SLA
  // ==========================================
  describe('Cenário C — Supervisão e Gestão Operacional', () => {
    it('C.1: Supervisora de Triagem (Enf. Ana Bila) inicia sessão', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'ana.bila@hcm.gov.mz',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.roles).toContain('SUPERVISOR');
      supervisorToken = res.body.data.token;
    });

    it('C.2: Supervisora consulta indicadores e métricas globais de SLA', async () => {
      const res = await request(app)
        .get('/api/dashboard/metrics')
        .set('Authorization', `Bearer ${supervisorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.totalProcesses).toBeGreaterThanOrEqual(1);
      expect(res.body.data.satisfactionScore).toBeDefined();
    });

    it('C.3: Supervisora reatribui processo operacional a outro colaborador', async () => {
      const res = await request(app)
        .post(`/api/processes/${patientProcessId}/reassign`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          staffId,
          reason: 'Reatribuído diretamente ao médico-chefe da Pediatria para parecer conclusivo.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.assignedStaffId).toBe(staffId);
    });
  });

  // ==========================================
  // CENÁRIO D — ADMINISTRADOR DO SISTEMA
  // ==========================================
  describe('Cenário D — Administração e Auditoria Hospitalar', () => {
    it('D.1: Administrador (Eng. Rui Nhantumbo) inicia sessão', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'rui.nhantumbo@hcm.gov.mz',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.roles).toContain('ADMIN');
      adminToken = res.body.data.token;
    });

    it('D.2: Administrador consulta lista de departamentos e equipa hospitalar', async () => {
      const deptsRes = await request(app).get('/api/departments');
      expect(deptsRes.status).toBe(200);
      expect(deptsRes.body.data.length).toBeGreaterThan(0);

      const staffRes = await request(app)
        .get('/api/staff')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(staffRes.status).toBe(200);
      expect(staffRes.body.data.length).toBeGreaterThan(0);
    });

    it('D.3: Administrador consulta catálogo de categorias e FAQs', async () => {
      const catsRes = await request(app).get('/api/categories');
      expect(catsRes.status).toBe(200);

      const faqsRes = await request(app).get('/api/faqs');
      expect(faqsRes.status).toBe(200);
      expect(faqsRes.body.data.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // CENÁRIO E — SEGURANÇA E PROTEÇÃO CONTRA ABUSOS
  // ==========================================
  describe('Cenário E — Auditoria de Segurança e Controlo de Acesso', () => {
    let secondPatientToken = '';

    beforeAll(async () => {
      // Criar um segundo paciente para testar violação de fronteira de dados
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Helena Mondlane',
          phone: `+258 82 ${Math.floor(1000000 + Math.random() * 9000000)}`,
          email: `helena.${Date.now()}@exemplo.co.mz`,
          password: 'senha_segura_456'
        });
      secondPatientToken = res.body.data.token;
    });

    it('E.1: Impede que um paciente consulte o processo de outro paciente (Violando IDOR)', async () => {
      const res = await request(app)
        .get(`/api/processes/${patientProcessId}`)
        .set('Authorization', `Bearer ${secondPatientToken}`);

      // Deve ser rejeitado (500 ou 403 com mensagem de acesso não autorizado)
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Acesso não autorizado/i);
    });

    it('E.2: Impede que o paciente visualize notas internas confidenciais', async () => {
      const res = await request(app)
        .get(`/api/processes/${patientProcessId}/messages`)
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      // Nenhuma mensagem recebida pelo paciente pode ter isInternal: true
      const internalNotes = res.body.data.filter((m: { isInternal: boolean }) => m.isInternal === true);
      expect(internalNotes.length).toBe(0);
    });

    it('E.3: Impede que o paciente execute operações restritas a supervisores (Reatribuição)', async () => {
      const res = await request(app)
        .post(`/api/processes/${patientProcessId}/reassign`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          staffId,
          reason: 'Tentativa indevida de reatribuição por utente'
        });

      // Bloqueado pelo middleware authorize(['SUPERVISOR', 'ADMIN'])
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('E.4: Impede acesso a endpoints protegidos sem token JWT', async () => {
      const res = await request(app).get('/api/processes');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('E.5: Rejeita submissões com dados inválidos via validação Zod', async () => {
      const res = await request(app)
        .post('/api/processes')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          title: 'Curto', // Mínimo é 5
          description: 'Muito curto', // Mínimo é 15
          type: 'INVALID_TYPE'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('E.6: Rejeita consulta pública quando o PIN de acompanhamento for incorreto', async () => {
      const res = await request(app)
        .post('/api/processes/lookup')
        .send({
          referenceNumber: patientProcessRef,
          pin: '0000' // PIN incorreto
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/PIN de acompanhamento incorreto/i);
    });
  });
});
