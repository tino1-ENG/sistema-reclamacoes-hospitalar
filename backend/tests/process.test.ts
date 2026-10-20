import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';

describe('HospitalCare API — Gestão de Processos e Regra de Confidencialidade', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('permite consulta pública por código de referência e PIN sem login', async () => {
    const res = await request(app)
      .post('/api/processes/lookup')
      .send({
        referenceNumber: '#HC-2026-000101',
        pin: '4521'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.process.referenceNumber).toBe('#HC-2026-000101');
    expect(res.body.data.messages.length).toBeGreaterThan(0);

    // Garante que nenhuma nota interna é exposta na consulta pública
    const hasInternalNote = res.body.data.messages.some((m: { isInternal: boolean }) => m.isInternal === true);
    expect(hasInternalNote).toBe(false);
  });

  it('impede que o paciente visualize notas internas confidenciais da equipa médica', async () => {
    // 1. Login como paciente
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: '+258 84 912 3456',
        password: '123456'
      });

    const patientToken = loginRes.body.data.token;

    // 2. Procurar o processo
    const procRes = await request(app)
      .get('/api/processes')
      .set('Authorization', `Bearer ${patientToken}`);

    const processId = procRes.body.data[0]._id;

    // 3. Obter mensagens como paciente
    const msgRes = await request(app)
      .get(`/api/processes/${processId}/messages`)
      .set('Authorization', `Bearer ${patientToken}`);

    expect(msgRes.status).toBe(200);
    // Verificar que todas as mensagens visíveis para o paciente têm isInternal = false
    const notes = msgRes.body.data.filter((m: { isInternal: boolean }) => m.isInternal === true);
    expect(notes.length).toBe(0);
  });
});
