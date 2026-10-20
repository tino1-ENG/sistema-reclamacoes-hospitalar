import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import {
  Hospital,
  Department,
  Category,
  User,
  Process,
  ProcessMessage,
  ProcessStatusHistory,
  Faq,
  SlaPolicy
} from '../models/index.js';

async function seed() {
  await connectDatabase();
  logger.info('🌱 A inicializar sementeira de dados do HospitalCare no MongoDB...');

  // 1. Hospital Piloto
  let hospital = await Hospital.findOne({ code: 'HCM-01' });
  if (!hospital) {
    hospital = await Hospital.create({
      name: 'Hospital Central de Maputo',
      code: 'HCM-01',
      address: 'Avenida Eduardo Mondlane, n.º 1234, Maputo, Moçambique',
      phone: '+258 21 325 000',
      email: 'secretaria.geral@hcm.gov.mz',
      timezone: 'Africa/Maputo',
      currency: 'MZN',
      isActive: true
    });
    logger.info('🏥 Hospital Central de Maputo criado.');
  }

  // 2. Departamentos
  const deptDefs = [
    { code: 'PED', name: 'Pediatria', description: 'Atendimento e internamento de crianças', phone: '+258 21 325 101' },
    { code: 'MAT', name: 'Maternidade e Obstetrícia', description: 'Saúde materno-infantil e partos', phone: '+258 21 325 102' },
    { code: 'URG', name: 'Urgências e Reanimação', description: 'Serviço de urgência geral 24h', phone: '+258 21 325 103' },
    { code: 'FAR', name: 'Farmácia Hospitalar', description: 'Distribuição e gestão de medicamentos', phone: '+258 21 325 104' },
    { code: 'MED', name: 'Medicina Geral', description: 'Consultas externas e especialidades médicas', phone: '+258 21 325 105' },
    { code: 'ATN', name: 'Atendimento ao Utente', description: 'Gabinete de utente e relações públicas', phone: '+258 21 325 106' }
  ];

  const deptMap = new Map<string, typeof Department.prototype>();
  for (const def of deptDefs) {
    let d = await Department.findOne({ code: def.code });
    if (!d) {
      d = await Department.create({ ...def, hospitalId: hospital._id, isActive: true });
    }
    deptMap.set(def.code, d);
  }
  logger.info('🏢 Departamentos hospitalares registados.');

  // 3. Categorias de Processo
  const catDefs: Array<{
    code: string;
    dept: string;
    name: string;
    priority: import('../models/index.js').PriorityCode;
    sla: number;
  }> = [
    { code: 'TEMPO_ESPERA', dept: 'PED', name: 'Tempo de Espera Excessivo', priority: 'HIGH', sla: 24 },
    { code: 'FALTA_MEDICAMENTO', dept: 'FAR', name: 'Indisponibilidade de Medicamentos', priority: 'URGENT', sla: 12 },
    { code: 'CONDUTA_PROFISSIONAL', dept: 'MED', name: 'Atendimento e Conduta Profissional', priority: 'NORMAL', sla: 48 },
    { code: 'INFRAESTRUTURA', dept: 'URG', name: 'Instalações e Higiene Hospitalar', priority: 'NORMAL', sla: 72 },
    { code: 'HORARIO_VISITAS', dept: 'MAT', name: 'Esclarecimento sobre Visitas', priority: 'LOW', sla: 48 },
    { code: 'SUGESTAO_FLUXO', dept: 'ATN', name: 'Sugestão de Organização de Filas', priority: 'LOW', sla: 96 }
  ];

  const catMap = new Map<string, typeof Category.prototype>();
  for (const c of catDefs) {
    let cat = await Category.findOne({ code: c.code });
    if (!cat) {
      const dept = deptMap.get(c.dept);
      cat = await Category.create({
        hospitalId: hospital._id,
        departmentId: dept?._id,
        code: c.code,
        name: c.name,
        defaultPriority: c.priority,
        defaultSlaHours: c.sla,
        isActive: true
      });
    }
    catMap.set(c.code, cat);
  }
  logger.info('🏷️ Categorias e políticas de SLA registadas.');

  // 4. Utilizadores Demo (Palavra-passe padrão: 123456)
  const passwordHash = await bcrypt.hash('123456', 10);
  const pedDept = deptMap.get('PED');

  const usersDef: Array<{
    fullName: string;
    phone: string;
    email: string;
    roles: import('../models/index.js').RoleCode[];
    departmentId?: import('mongoose').Types.ObjectId;
  }> = [
    {
      fullName: 'Maria Tembe',
      phone: '+258 84 912 3456',
      email: 'maria.tembe@exemplo.co.mz',
      roles: ['PATIENT']
    },
    {
      fullName: 'Dr. Carlos Mondlane',
      phone: '+258 82 456 7890',
      email: 'carlos.mondlane@hcm.gov.mz',
      roles: ['STAFF'],
      departmentId: pedDept?._id as import('mongoose').Types.ObjectId | undefined
    },
    {
      fullName: 'Enf. Ana Bila',
      phone: '+258 87 234 5678',
      email: 'ana.bila@hcm.gov.mz',
      roles: ['SUPERVISOR']
    },
    {
      fullName: 'Eng. Rui Nhantumbo',
      phone: '+258 86 111 2233',
      email: 'rui.nhantumbo@hcm.gov.mz',
      roles: ['ADMIN']
    }
  ];

  const userMap = new Map<string, typeof User.prototype>();
  for (const u of usersDef) {
    let usr = await User.findOne({ email: u.email });
    if (!usr) {
      usr = await User.create({
        ...u,
        hospitalId: hospital._id,
        passwordHash,
        status: 'ACTIVE',
        isPhoneVerified: true
      });
    }
    userMap.set(u.roles[0], usr);
  }
  logger.info('👥 Utilizadores demo criados (Maria Tembe, Dr. Carlos, Enf. Ana, Eng. Rui).');

  // 5. Políticas de SLA Globais
  const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
  for (const p of priorities) {
    const exists = await SlaPolicy.findOne({ priority: p });
    if (!exists) {
      await SlaPolicy.create({
        hospitalId: hospital._id,
        priority: p,
        responseTimeHours: p === 'URGENT' ? 4 : p === 'HIGH' ? 12 : 24,
        resolutionTimeHours: p === 'URGENT' ? 12 : p === 'HIGH' ? 24 : 48,
        isActive: true
      });
    }
  }

  // 6. Perguntas Frequentes (FAQs)
  const faqDefs = [
    {
      category: 'Processos e Reclamações',
      question: 'Quem pode submeter uma reclamação ou sugestão no HospitalCare?',
      answer:
        'Qualquer utente, familiar ou acompanhante pode submeter uma participação. É possível registar com os dados pessoais ou de forma anónima, recebendo um código de referência único.',
      orderIndex: 1
    },
    {
      category: 'Prazos e Respostas',
      question: 'Qual é o prazo regulamentar para receber uma resposta do hospital?',
      answer:
        'Casos urgentes têm primeira resposta em até 12 horas. Para processos normais, o prazo padrão do Hospital Central de Maputo é de 48 horas úteis.',
      orderIndex: 2
    },
    {
      category: 'Privacidade e Sigilo',
      question: 'As minhas informações clínicas estão protegidas?',
      answer:
        'Sim. O HospitalCare não recolhe nem expõe diagnósticos clínicos protegidos. Apenas os responsáveis designados acedem à tramitação administrativa, e as notas internas da equipa técnica são confidenciais.',
      orderIndex: 3
    }
  ];

  for (const f of faqDefs) {
    const exists = await Faq.findOne({ question: f.question });
    if (!exists) {
      await Faq.create({ ...f, hospitalId: hospital._id, isActive: true });
    }
  }
  logger.info('❓ FAQs institucionais configuradas.');

  // 7. Processos Piloto
  const patient = userMap.get('PATIENT');
  const staff = userMap.get('STAFF');
  const catEspera = catMap.get('TEMPO_ESPERA');

  if (patient && staff && pedDept && catEspera) {
    const existingP = await Process.findOne({ referenceNumber: '#HC-2026-000101' });
    if (!existingP) {
      const pinHash = await bcrypt.hash('4521', 8);
      const proc = await Process.create({
        referenceNumber: '#HC-2026-000101',
        hospitalId: hospital._id,
        patientId: patient._id,
        patientName: patient.fullName,
        patientPhone: patient.phone,
        patientEmail: patient.email,
        departmentId: pedDept._id,
        categoryId: catEspera._id,
        type: 'COMPLAINT',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        title: 'Tempo de espera na triagem da Pediatria superior a 3 horas',
        description:
          'Na manhã do dia 12 de Outubro de 2026, estive com a minha filha de 4 anos com febre alta e aguardámos mais de 3 horas para o primeiro atendimento médico.',
        incidentDate: new Date('2026-10-12T08:30:00+02:00'),
        incidentLocation: 'Bloco de Triagem Pediátrica',
        isAnonymous: false,
        trackingPinHash: pinHash,
        assignedStaffId: staff._id,
        slaDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      // Histórico
      await ProcessStatusHistory.create({
        processId: proc._id,
        changedById: patient._id,
        changedByName: patient.fullName,
        toStatus: 'SUBMITTED',
        reason: 'Submissão de reclamação pelo portal do utente.'
      });
      await ProcessStatusHistory.create({
        processId: proc._id,
        changedById: staff._id,
        changedByName: staff.fullName,
        fromStatus: 'SUBMITTED',
        toStatus: 'ASSIGNED',
        reason: 'Atribuído à equipa médica da Pediatria.'
      });
      await ProcessStatusHistory.create({
        processId: proc._id,
        changedById: staff._id,
        changedByName: staff.fullName,
        fromStatus: 'ASSIGNED',
        toStatus: 'IN_REVIEW',
        reason: 'A analisar escala de serviço da equipa de enfermagem do turno matutino.'
      });

      // Mensagens (Pública e Nota Interna Confidencial)
      await ProcessMessage.create({
        processId: proc._id,
        senderId: staff._id,
        senderName: staff.fullName,
        senderRole: 'STAFF',
        messageType: 'PUBLIC_REPLY',
        body: 'Estimada D. Maria Tembe, lamentamos o atraso verificado. A situação foi reportada à chefia da Pediatria e estamos a reforçar a triagem.',
        isInternal: false
      });

      // NOTA INTERNA CONFIDENCIAL (visível apenas para Staff/Supervisor)
      await ProcessMessage.create({
        processId: proc._id,
        senderId: staff._id,
        senderName: staff.fullName,
        senderRole: 'STAFF',
        messageType: 'INTERNAL_NOTE',
        body: 'NOTA INTERNA: Houve falta imprevista de dois enfermeiros de triagem nesse turno. A chefia já emitiu advertência e ajustou a escala de emergência.',
        isInternal: true
      });

      logger.info('📋 Processo demo #HC-2026-000101 criado com histórico e nota confidencial.');
    }
  }

  logger.info('🎉 Sementeira concluída com sucesso!');
  await disconnectDatabase();
}

seed().catch((err) => {
  logger.error({ err }, 'Erro ao executar seed');
  process.exit(1);
});
