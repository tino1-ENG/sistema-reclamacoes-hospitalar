import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';

describe('HospitalCare API — Autenticação e Perfis', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('permite login de paciente com telemóvel de Moçambique e palavra-passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: '+258 84 912 3456',
        password: '123456'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.fullName).toBe('Maria Tembe');
    expect(res.body.data.user.roles).toContain('PATIENT');
  });

  it('permite login de colaborador com email institucional', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'carlos.mondlane@hcm.gov.mz',
        password: '123456'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.roles).toContain('STAFF');
  });

  it('rejeita credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'carlos.mondlane@hcm.gov.mz',
        password: 'palavra_passe_errada'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
