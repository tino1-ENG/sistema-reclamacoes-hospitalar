/**
 * Utilitário de Higienização e Anonimização de Dados Sensíveis (Moçambique)
 * Remove números de BI, telemóveis e e-mails antes de envio a modelos de IA.
 */

// Regex para BI Moçambicano: 12 dígitos seguidos de 1 letra maiúscula (Ex: 110100234567M)
const MZ_BI_REGEX = /\b\d{12}[A-Za-z]\b/g;

// Regex para Telemóvel Moçambicano: +258 82/83/84/85/86/87 seguido de 7 dígitos
const MZ_PHONE_REGEX = /(?:\+?258\s?)?(?:82|83|84|85|86|87)\d{7}\b/g;

// Regex para Email genérico
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

// Regex para NUIT Moçambicano: 9 dígitos
const MZ_NUIT_REGEX = /\b\d{9}\b/g;

export function scrubSensitiveData(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(MZ_BI_REGEX, '[BI_ANONIMIZADO]')
    .replace(MZ_PHONE_REGEX, '[TELEFONE_ANONIMIZADO]')
    .replace(EMAIL_REGEX, '[EMAIL_ANONIMIZADO]');
}

export function scrubProcessPayload(payload: {
  title?: string;
  description?: string;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
}): {
  title: string;
  description: string;
  patientName: string;
} {
  return {
    title: scrubSensitiveData(payload.title || ''),
    description: scrubSensitiveData(payload.description || ''),
    patientName: payload.patientName ? '[UTENTE_CONFIDENCIAL]' : '[ANÓNIMO]'
  };
}
