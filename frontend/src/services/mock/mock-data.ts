// HospitalCare — Dados Simulados e de Demonstração
// Localização: Moçambique (Hospital Central Piloto de Maputo)

import type {
  Hospital,
  User,
  Department,
  ProcessType,
  Category,
  ProcessStatus,
  Priority,
  Process,
  ProcessMessage,
  ProcessStatusHistory,
  ProcessAssignment,
  ProcessAttachment,
  Notification,
  FAQ,
  AuditLog,
  SlaPolicy
} from '../../types';

export const mockHospital: Hospital = {
  id: 'hosp-001',
  name: 'Hospital Central Piloto de Maputo',
  code: 'HCM-MZ',
  address: 'Av. Eduardo Mondlane, nº 1500, Maputo, Moçambique',
  phone: '+258 21 350 400',
  email: 'contacto@hospitalcare.gov.mz',
  timezone: 'Africa/Maputo',
  isActive: true,
  createdAt: '2026-01-01T08:00:00Z',
  updatedAt: '2026-01-01T08:00:00Z'
};

export const mockUsers: User[] = [
  {
    id: 'user-pat-001',
    hospitalId: 'hosp-001',
    fullName: 'Amélia Graça Mondlane',
    phone: '+258 84 912 3456',
    email: 'amelia.mondlane@exemplo.co.mz',
    phoneVerifiedAt: '2026-02-10T10:00:00Z',
    emailVerifiedAt: '2026-02-10T10:00:00Z',
    isActive: true,
    roles: ['PATIENT'],
    createdAt: '2026-02-10T09:30:00Z',
    lastLoginAt: '2026-10-14T18:00:00Z'
  },
  {
    id: 'user-stf-001',
    hospitalId: 'hosp-001',
    fullName: 'Dr. Tomás Alberto Mabote',
    phone: '+258 82 456 7890',
    email: 'tomas.mabote@hospitalcare.gov.mz',
    phoneVerifiedAt: '2026-01-05T08:00:00Z',
    emailVerifiedAt: '2026-01-05T08:00:00Z',
    isActive: true,
    roles: ['STAFF'],
    departmentIds: ['dep-001', 'dep-002'],
    createdAt: '2026-01-05T08:00:00Z',
    lastLoginAt: '2026-10-14T20:15:00Z'
  },
  {
    id: 'user-sup-001',
    hospitalId: 'hosp-001',
    fullName: 'Dra. Isabel Cossa',
    phone: '+258 87 234 5678',
    email: 'isabel.cossa@hospitalcare.gov.mz',
    phoneVerifiedAt: '2026-01-02T08:00:00Z',
    emailVerifiedAt: '2026-01-02T08:00:00Z',
    isActive: true,
    roles: ['SUPERVISOR'],
    departmentIds: ['dep-001', 'dep-002', 'dep-003'],
    createdAt: '2026-01-02T08:00:00Z',
    lastLoginAt: '2026-10-14T21:00:00Z'
  },
  {
    id: 'user-adm-001',
    hospitalId: 'hosp-001',
    fullName: 'Eng. Rui Chissano',
    phone: '+258 86 111 2233',
    email: 'rui.chissano@hospitalcare.gov.mz',
    phoneVerifiedAt: '2026-01-01T08:00:00Z',
    emailVerifiedAt: '2026-01-01T08:00:00Z',
    isActive: true,
    roles: ['ADMIN'],
    createdAt: '2026-01-01T08:00:00Z',
    lastLoginAt: '2026-10-14T21:30:00Z'
  }
];

export const mockDepartments: Department[] = [
  {
    id: 'dep-001',
    hospitalId: 'hosp-001',
    name: 'Triagem e Urgências',
    code: 'URG',
    description: 'Serviço de urgência e emergência médica geral e pediátrica',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'dep-002',
    hospitalId: 'hosp-001',
    name: 'Farmácia Hospitalar',
    code: 'FARM',
    description: 'Dispensação de medicamentos essenciais e gestão de receituário',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'dep-003',
    hospitalId: 'hosp-001',
    name: 'Consultas Externas',
    code: 'CONS',
    description: 'Marcação, atendimento em especialidades e acompanhamento ambulatorial',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'dep-004',
    hospitalId: 'hosp-001',
    name: 'Maternidade e Saúde Materno-Infantil',
    code: 'MAT',
    description: 'Cuidados obstétricos, parto e puerpério',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'dep-005',
    hospitalId: 'hosp-001',
    name: 'Laboratório de Análises Clínicas',
    code: 'LAB',
    description: 'Exames laboratoriais, patologia clínica e entrega de resultados',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'dep-006',
    hospitalId: 'hosp-001',
    name: 'Atendimento Administrativo e Faturação',
    code: 'ADM_FAT',
    description: 'Secretaria clínica, taxas de atendimento e certidões',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  }
];

export const mockProcessTypes: ProcessType[] = [
  {
    id: 1,
    code: 'COMPLAINT',
    name: 'Reclamação',
    description: 'Manifestação formal de insatisfação sobre atendimento, instalações ou serviços',
    isActive: true
  },
  {
    id: 2,
    code: 'CLARIFICATION',
    name: 'Pedido de Esclarecimento',
    description: 'Solicitação de esclarecimento sobre procedimentos, resultados ou orientações administrativas',
    isActive: true
  },
  {
    id: 3,
    code: 'SUGGESTION',
    name: 'Sugestão',
    description: 'Proposta de melhoria para os serviços e processos do hospital',
    isActive: true
  }
];

export const mockProcessStatuses: ProcessStatus[] = [
  { id: 1, code: 'SUBMITTED', name: 'Submetido', isFinal: false, isPatientVisible: true, sortOrder: 1, isActive: true },
  { id: 2, code: 'TRIAGE', name: 'Em Triagem', isFinal: false, isPatientVisible: true, sortOrder: 2, isActive: true },
  { id: 3, code: 'ASSIGNED', name: 'Atribuído', isFinal: false, isPatientVisible: true, sortOrder: 3, isActive: true },
  { id: 4, code: 'IN_REVIEW', name: 'Em Análise', isFinal: false, isPatientVisible: true, sortOrder: 4, isActive: true },
  { id: 5, code: 'WAITING_PATIENT', name: 'Aguarda Resposta do Paciente', isFinal: false, isPatientVisible: true, sortOrder: 5, isActive: true },
  { id: 6, code: 'WAITING_DEPARTMENT', name: 'Aguarda Parecer Departamental', isFinal: false, isPatientVisible: false, sortOrder: 6, isActive: true },
  { id: 7, code: 'ANSWERED', name: 'Respondido', isFinal: false, isPatientVisible: true, sortOrder: 7, isActive: true },
  { id: 8, code: 'CLOSED', name: 'Concluído', isFinal: true, isPatientVisible: true, sortOrder: 8, isActive: true },
  { id: 9, code: 'REOPENED', name: 'Reaberto', isFinal: false, isPatientVisible: true, sortOrder: 9, isActive: true }
];

export const mockPriorities: Priority[] = [
  { id: 1, code: 'LOW', name: 'Baixa', weight: 1, isActive: true },
  { id: 2, code: 'NORMAL', name: 'Normal', weight: 2, isActive: true },
  { id: 3, code: 'HIGH', name: 'Alta', weight: 3, isActive: true },
  { id: 4, code: 'URGENT', name: 'Urgente', weight: 4, isActive: true }
];

export const mockCategories: Category[] = [
  {
    id: 'cat-001',
    hospitalId: 'hosp-001',
    name: 'Tempo de Espera e Triagem',
    code: 'TEMPO_ESPERA',
    description: 'Demoras excessivas no atendimento médico, triagem ou marcação',
    defaultDepartmentId: 'dep-001',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'cat-002',
    hospitalId: 'hosp-001',
    name: 'Disponibilidade de Medicamentos',
    code: 'DISP_FARM',
    description: 'Falta de medicação prescrita ou esclarecimento sobre a farmácia',
    defaultDepartmentId: 'dep-002',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'cat-003',
    hospitalId: 'hosp-001',
    name: 'Conduta e Comunicação do Pessoal',
    code: 'CONDUTA_PROF',
    description: 'Atendimento interpessoal, urbanidade e clareza das informações prestadas',
    defaultDepartmentId: 'dep-003',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'cat-004',
    hospitalId: 'hosp-001',
    name: 'Higiene e Condições das Instalações',
    code: 'HIGIENE_INSTAL',
    description: 'Limpeza, climatização, quartos e sanitários',
    defaultDepartmentId: 'dep-006',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'cat-005',
    hospitalId: 'hosp-001',
    name: 'Entrega e Consulta de Resultados de Exames',
    code: 'RESULTADOS_EXAMES',
    description: 'Demora ou extravio de análises clínicas e laudos imagiológicos',
    defaultDepartmentId: 'dep-005',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  }
];

export const mockSlaPolicies: SlaPolicy[] = [
  {
    id: 'sla-001',
    hospitalId: 'hosp-001',
    name: 'SLA Urgência e Reclamação Alta',
    processTypeId: 1,
    priorityId: 4,
    firstResponseHours: 12,
    resolutionHours: 48,
    isActive: true
  },
  {
    id: 'sla-002',
    hospitalId: 'hosp-001',
    name: 'SLA Padrão Geral',
    firstResponseHours: 48,
    resolutionHours: 120,
    isActive: true
  }
];

export const mockProcesses: Process[] = [
  {
    id: 'proc-001',
    referenceCode: 'HC-2026-000101',
    hospitalId: 'hosp-001',
    patientId: 'user-pat-001',
    patientName: 'Amélia Graça Mondlane',
    patientPhone: '+258 84 912 3456',
    processTypeId: 1,
    processType: mockProcessTypes[0]!,
    categoryId: 'cat-001',
    category: mockCategories[0]!,
    departmentId: 'dep-001',
    department: mockDepartments[0]!,
    statusId: 4,
    status: mockProcessStatuses[3]!, // IN_REVIEW
    priorityId: 3,
    priority: mockPriorities[2]!, // HIGH
    subject: 'Tempo de espera superior a 4 horas na triagem pediátrica',
    description: 'Dirigi-me com a minha filha febril ao serviço de urgência pediátrica no dia 12 de Outubro por volta das 14h. Ficámos mais de 4 horas sem reavaliação ou chamada na sala de espera.',
    incidentDate: '2026-10-12',
    assignedTo: 'user-stf-001',
    assignedStaffName: 'Dr. Tomás Alberto Mabote',
    createdAt: '2026-10-12T16:30:00Z',
    updatedAt: '2026-10-13T09:40:00Z',
    firstResponseAt: '2026-10-13T09:40:00Z',
    slaDueAt: '2026-10-15T16:30:00Z',
    slaOverdue: false
  },
  {
    id: 'proc-002',
    referenceCode: 'HC-2026-000102',
    hospitalId: 'hosp-001',
    patientId: 'user-pat-001',
    patientName: 'Amélia Graça Mondlane',
    patientPhone: '+258 84 912 3456',
    processTypeId: 2,
    processType: mockProcessTypes[1]!,
    categoryId: 'cat-002',
    category: mockCategories[1]!,
    departmentId: 'dep-002',
    department: mockDepartments[1]!,
    statusId: 7,
    status: mockProcessStatuses[6]!, // ANSWERED
    priorityId: 2,
    priority: mockPriorities[1]!, // NORMAL
    subject: 'Esclarecimento sobre reposição de medicação para hipertensão na farmácia',
    description: 'Gostaria de saber quando estará disponível o medicamento prescrito na consulta externa de cardiologia, visto que se encontrava em falta no dia 05 de Outubro.',
    incidentDate: '2026-10-05',
    assignedTo: 'user-stf-001',
    assignedStaffName: 'Dr. Tomás Alberto Mabote',
    createdAt: '2026-10-06T10:15:00Z',
    updatedAt: '2026-10-08T14:20:00Z',
    firstResponseAt: '2026-10-08T14:20:00Z',
    slaDueAt: '2026-10-11T10:15:00Z',
    slaOverdue: false
  },
  {
    id: 'proc-003',
    referenceCode: 'HC-2026-000103',
    hospitalId: 'hosp-001',
    patientId: 'user-pat-001',
    patientName: 'Amélia Graça Mondlane',
    patientPhone: '+258 84 912 3456',
    processTypeId: 3,
    processType: mockProcessTypes[2]!,
    categoryId: 'cat-004',
    category: mockCategories[3]!,
    departmentId: 'dep-006',
    department: mockDepartments[5]!,
    statusId: 8,
    status: mockProcessStatuses[7]!, // CLOSED
    priorityId: 1,
    priority: mockPriorities[0]!, // LOW
    subject: 'Sugestão para disponibilização de dispensadores de água nas salas de espera',
    description: 'Sugiro a instalação de postos de água potável ou dispensadores nas salas de espera das consultas externas para maior comodidade dos utentes.',
    incidentDate: '2026-09-20',
    assignedTo: 'user-stf-001',
    assignedStaffName: 'Dr. Tomás Alberto Mabote',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-25T15:00:00Z',
    firstResponseAt: '2026-09-22T08:30:00Z',
    closedAt: '2026-09-25T15:00:00Z',
    closureReason: 'Sugestão acolhida e encaminhada para o plano de manutenção predial do último trimestre.',
    slaOverdue: false
  }
];

export const mockMessages: ProcessMessage[] = [
  {
    id: 'msg-001',
    processId: 'proc-001',
    authorId: 'user-pat-001',
    authorName: 'Amélia Graça Mondlane',
    authorRole: 'PATIENT',
    messageType: 'PATIENT_MESSAGE',
    body: 'Anexo o comprovativo da senha de atendimento obtida na entrada.',
    isVisibleToPatient: true,
    createdAt: '2026-10-12T16:32:00Z'
  },
  {
    id: 'msg-002',
    processId: 'proc-001',
    authorId: 'user-stf-001',
    authorName: 'Dr. Tomás Alberto Mabote',
    authorRole: 'STAFF',
    messageType: 'INTERNAL_NOTE',
    body: 'Verificado o registo da escala de serviço do dia 12. Houve afluxo anómalo decorrente de emergência cirúrgica pediátrica externa. Equipa médica de reforço foi solicitada com atraso.',
    isVisibleToPatient: false,
    createdAt: '2026-10-13T09:30:00Z'
  },
  {
    id: 'msg-003',
    processId: 'proc-001',
    authorId: 'user-stf-001',
    authorName: 'Dr. Tomás Alberto Mabote',
    authorRole: 'STAFF',
    messageType: 'PUBLIC_REPLY',
    body: 'Estimada D. Amélia, lamentamos sinceramente o tempo excessivo de espera ocorrido. Informamos que a direção médica abriu uma averiguação de fluxo interno para garantir que a triagem prioritária pediátrica seja reforçada imediatamente sempre que ocorram urgências externas simultâneas.',
    isVisibleToPatient: true,
    createdAt: '2026-10-13T09:40:00Z'
  }
];

export const mockStatusHistory: ProcessStatusHistory[] = [
  {
    id: 'hist-001',
    processId: 'proc-001',
    fromStatusId: null,
    toStatusId: 1,
    toStatusName: 'Submetido',
    changedBy: 'user-pat-001',
    changerName: 'Amélia Graça Mondlane',
    reason: 'Submissão inicial do processo',
    createdAt: '2026-10-12T16:30:00Z'
  },
  {
    id: 'hist-002',
    processId: 'proc-001',
    fromStatusId: 1,
    toStatusId: 2,
    toStatusName: 'Em Triagem',
    changedBy: 'user-sup-001',
    changerName: 'Dra. Isabel Cossa',
    reason: 'Processo aceite para análise operacional',
    createdAt: '2026-10-13T08:15:00Z'
  },
  {
    id: 'hist-003',
    processId: 'proc-001',
    fromStatusId: 2,
    toStatusId: 3,
    toStatusName: 'Atribuído',
    changedBy: 'user-sup-001',
    changerName: 'Dra. Isabel Cossa',
    reason: 'Atribuído ao Dr. Tomás Mabote do departamento de Urgências',
    createdAt: '2026-10-13T08:20:00Z'
  },
  {
    id: 'hist-004',
    processId: 'proc-001',
    fromStatusId: 3,
    toStatusId: 4,
    toStatusName: 'Em Análise',
    changedBy: 'user-stf-001',
    changerName: 'Dr. Tomás Alberto Mabote',
    reason: 'Averiguação técnica da escala e fluxo de triagem em curso',
    createdAt: '2026-10-13T09:25:00Z'
  }
];

export const mockAssignments: ProcessAssignment[] = [
  {
    id: 'asg-001',
    processId: 'proc-001',
    assignedTo: 'user-stf-001',
    assigneeName: 'Dr. Tomás Alberto Mabote',
    assignedBy: 'user-sup-001',
    assignerName: 'Dra. Isabel Cossa',
    departmentId: 'dep-001',
    departmentName: 'Triagem e Urgências',
    assignmentNote: 'Favor verificar a escala pediátrica do dia 12 e apresentar esclarecimento.',
    assignedAt: '2026-10-13T08:20:00Z',
    endedAt: null
  }
];

export const mockAttachments: ProcessAttachment[] = [
  {
    id: 'att-001',
    processId: 'proc-001',
    uploadedBy: 'user-pat-001',
    uploaderName: 'Amélia Graça Mondlane',
    originalFilename: 'comprovativo_senha_triagem.pdf',
    storageKey: 'proc-001/att-001_comprovativo.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 245120,
    createdAt: '2026-10-12T16:32:00Z',
    url: '#'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-pat-001',
    processId: 'proc-001',
    eventType: 'PROCESS_STATUS_UPDATED',
    title: 'Processo em Análise',
    body: 'O seu processo HC-2026-000101 foi atualizado para "Em Análise".',
    readAt: null,
    createdAt: '2026-10-13T09:25:00Z'
  },
  {
    id: 'notif-002',
    userId: 'user-pat-001',
    processId: 'proc-001',
    eventType: 'NEW_MESSAGE_RECEIVED',
    title: 'Nova resposta da equipa hospitalar',
    body: 'O Dr. Tomás Mabote enviou uma resposta ao seu processo HC-2026-000101.',
    readAt: null,
    createdAt: '2026-10-13T09:40:00Z'
  },
  {
    id: 'notif-003',
    userId: 'user-stf-001',
    processId: 'proc-001',
    eventType: 'PROCESS_ASSIGNED',
    title: 'Novo processo atribuído',
    body: 'A Dra. Isabel Cossa atribuiu-lhe o processo HC-2026-000101.',
    readAt: '2026-10-13T08:25:00Z',
    createdAt: '2026-10-13T08:20:00Z'
  }
];

export const mockFaqs: FAQ[] = [
  {
    id: 'faq-001',
    hospitalId: 'hosp-001',
    question: 'Como posso acompanhar o estado da minha reclamação ou pedido?',
    answer: 'Após submeter o seu processo, receberá um código único de referência (por exemplo, HC-2026-000101). Pode acompanhar o progresso em tempo real entrando na sua conta na secção "Os Meus Processos" ou utilizando o formulário público de consulta rápida pelo código.',
    sortOrder: 1,
    isPublished: true,
    category: 'Processos',
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'faq-002',
    hospitalId: 'hosp-001',
    question: 'Qual é o prazo habitual para receber uma resposta do hospital?',
    answer: 'Para reclamações urgentes, a equipa compromete-se a efetuar o primeiro contacto em até 12 a 24 horas úteis. Para processos de prioridade normal e pedidos de esclarecimento gerais, o prazo de resposta é de até 48 a 72 horas úteis.',
    sortOrder: 2,
    isPublished: true,
    category: 'Prazos',
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'faq-003',
    hospitalId: 'hosp-001',
    question: 'As informações e reclamações submetidas são confidenciais?',
    answer: 'Sim. O HospitalCare foi concebido com rigorosos padrões de proteção e privacidade. Apenas os profissionais médicos e administrativos estritamente autorizados e atribuídos ao seu processo têm acesso aos dados para resolução do caso.',
    sortOrder: 3,
    isPublished: true,
    category: 'Privacidade',
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'faq-004',
    hospitalId: 'hosp-001',
    question: 'Posso anexar documentos ou fotografias ao meu processo?',
    answer: 'Sim, pode anexar ficheiros nos formatos PDF, JPEG e PNG até ao limite de 5 MB por documento, tanto no momento da criação do processo como durante a troca de mensagens com o hospital.',
    sortOrder: 4,
    isPublished: true,
    category: 'Processos',
    createdAt: '2026-01-01T08:00:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    actorUserId: 'user-pat-001',
    actorName: 'Amélia Graça Mondlane',
    action: 'PROCESS_CREATED',
    entityType: 'process',
    entityId: 'proc-001',
    metadata: { referenceCode: 'HC-2026-000101', type: 'COMPLAINT', priority: 'HIGH' },
    createdAt: '2026-10-12T16:30:00Z'
  },
  {
    id: 'log-002',
    actorUserId: 'user-sup-001',
    actorName: 'Dra. Isabel Cossa',
    action: 'PROCESS_ASSIGNED',
    entityType: 'process_assignment',
    entityId: 'asg-001',
    metadata: { assignedTo: 'user-stf-001', department: 'dep-001' },
    createdAt: '2026-10-13T08:20:00Z'
  },
  {
    id: 'log-003',
    actorUserId: 'user-stf-001',
    actorName: 'Dr. Tomás Alberto Mabote',
    action: 'PROCESS_STATUS_CHANGED',
    entityType: 'process',
    entityId: 'proc-001',
    metadata: { fromStatus: 'ASSIGNED', toStatus: 'IN_REVIEW' },
    createdAt: '2026-10-13T09:25:00Z'
  }
];
