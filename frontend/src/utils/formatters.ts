// HospitalCare — Formatadores e Utilitários de Apresentação
// Localização: Moçambique (pt-MZ, Africa/Maputo, MZN)

import type { StatusCode, PriorityCode, ProcessTypeCode } from '../types';

/**
 * Formata moeda para Metical moçambicano (MZN)
 */
export function formatCurrencyMZN(amount: number): string {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Formata data e hora no fuso horário de Moçambique
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Maputo'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formata apenas data (DD/MM/AAAA)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Africa/Maputo'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Normaliza e formata número de telefone de Moçambique
 * Exemplo: +258 84 123 4567
 */
export function formatPhoneMZ(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('258') && digits.length === 12) {
    return `+258 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 9) {
    return `+258 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Retorna metadados visuais para os estados dos processos
 */
export function getStatusMeta(statusCode: StatusCode): { label: string; color: string; icon: string } {
  switch (statusCode) {
    case 'SUBMITTED':
      return { label: 'Submetido', color: 'info', icon: 'send' };
    case 'TRIAGE':
      return { label: 'Em Triagem', color: 'secondary', icon: 'rule' };
    case 'ASSIGNED':
      return { label: 'Atribuído', color: 'primary', icon: 'person' };
    case 'IN_REVIEW':
      return { label: 'Em Análise', color: 'warning', icon: 'pending_actions' };
    case 'WAITING_PATIENT':
      return { label: 'Aguarda Paciente', color: 'warning', icon: 'hourglass_empty' };
    case 'WAITING_DEPARTMENT':
      return { label: 'Aguarda Departamento', color: 'secondary', icon: 'domain' };
    case 'ANSWERED':
      return { label: 'Respondido', color: 'accent', icon: 'mark_chat_read' };
    case 'CLOSED':
      return { label: 'Concluído', color: 'positive', icon: 'check_circle' };
    case 'REOPENED':
      return { label: 'Reaberto', color: 'negative', icon: 'replay' };
    default:
      return { label: statusCode, color: 'grey-7', icon: 'help_outline' };
  }
}

/**
 * Retorna metadados visuais para as prioridades
 */
export function getPriorityMeta(priorityCode: PriorityCode): { label: string; color: string; icon: string } {
  switch (priorityCode) {
    case 'LOW':
      return { label: 'Baixa', color: 'blue-grey', icon: 'arrow_downward' };
    case 'NORMAL':
      return { label: 'Normal', color: 'primary', icon: 'remove' };
    case 'HIGH':
      return { label: 'Alta', color: 'orange-9', icon: 'arrow_upward' };
    case 'URGENT':
      return { label: 'Urgente', color: 'negative', icon: 'priority_high' };
    default:
      return { label: priorityCode, color: 'grey', icon: 'remove' };
  }
}

/**
 * Retorna metadados visuais para o tipo de processo
 */
export function getProcessTypeMeta(typeCode: ProcessTypeCode): { label: string; color: string; icon: string } {
  switch (typeCode) {
    case 'COMPLAINT':
      return { label: 'Reclamação', color: 'negative', icon: 'report_problem' };
    case 'CLARIFICATION':
      return { label: 'Pedido de Esclarecimento', color: 'info', icon: 'contact_support' };
    case 'SUGGESTION':
      return { label: 'Sugestão', color: 'positive', icon: 'lightbulb' };
    default:
      return { label: typeCode, color: 'grey', icon: 'description' };
  }
}
