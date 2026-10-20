import { describe, it, expect } from 'vitest';
import {
  formatCurrencyMZN,
  formatPhoneMZ,
  getStatusMeta,
  getPriorityMeta,
  getProcessTypeMeta
} from '../../src/utils/formatters';

describe('Formatadores HospitalCare — Moçambique (pt-MZ)', () => {
  it('formata moeda para Metical moçambicano (MZN)', () => {
    const formatted = formatCurrencyMZN(1500.5);
    expect(formatted).toMatch(/1[.\s]?500,50/);
    expect(formatted).toMatch(/MTn|MZN/);
  });

  it('normaliza número de telefone móvel de Moçambique', () => {
    expect(formatPhoneMZ('849123456')).toBe('+258 84 912 3456');
    expect(formatPhoneMZ('258849123456')).toBe('+258 84 912 3456');
  });

  it('retorna metadados visuais corretos para os estados dos processos', () => {
    expect(getStatusMeta('SUBMITTED').label).toBe('Submetido');
    expect(getStatusMeta('CLOSED').label).toBe('Concluído');
    expect(getStatusMeta('CLOSED').color).toBe('positive');
  });

  it('retorna metadados para prioridades e tipos', () => {
    expect(getPriorityMeta('URGENT').color).toBe('negative');
    expect(getProcessTypeMeta('COMPLAINT').label).toBe('Reclamação');
    expect(getProcessTypeMeta('SUGGESTION').label).toBe('Sugestão');
  });
});
