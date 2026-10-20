import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  Process,
  ProcessMessage,
  ProcessStatusHistory,
  Department,
  Category,
  User,
  Feedback,
  AuditLog,
  type StatusCode,
  type ProcessTypeCode,
  type PriorityCode
} from '../models/index.js';
import type { AuthenticatedUser } from '../types/express.d.js';

export class ProcessService {
  /**
   * Criação de novo processo hospitalar (Reclamação, Esclarecimento ou Sugestão)
   */
  async createProcess(
    user: AuthenticatedUser | undefined,
    data: {
      title: string;
      description: string;
      type: ProcessTypeCode;
      departmentId: string;
      categoryId: string;
      incidentDate?: string;
      incidentLocation?: string;
      isAnonymous?: boolean;
      patientName?: string;
      patientPhone?: string;
      patientEmail?: string;
    }
  ) {
    const department = await Department.findById(data.departmentId);
    if (!department) throw new Error('Departamento selecionado não encontrado.');

    const category = await Category.findById(data.categoryId);
    if (!category) throw new Error('Categoria selecionada não encontrada.');

    // Gerar código de referência único: #HC-2026-XXXXXX
    const count = await Process.countDocuments();
    const referenceNumber = `#HC-2026-${String(100100 + count + 1)}`;

    // Gerar PIN de consulta pública de 4 dígitos
    const randomPin = String(Math.floor(1000 + Math.random() * 9000));
    const trackingPinHash = await bcrypt.hash(randomPin, 8);

    // Calcular SLA com base na categoria ou 48 horas por defeito
    const slaHours = category.defaultSlaHours || 48;
    const slaDueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const processDoc = await Process.create({
      referenceNumber,
      hospitalId: department.hospitalId,
      patientId: user ? new mongoose.Types.ObjectId(user.id) : undefined,
      patientName: user ? user.fullName : data.patientName || 'Utente Anónimo',
      patientPhone: user ? user.phone : data.patientPhone,
      patientEmail: user ? user.email : data.patientEmail,
      departmentId: department._id,
      categoryId: category._id,
      type: data.type,
      status: 'SUBMITTED',
      priority: category.defaultPriority || 'NORMAL',
      title: data.title,
      description: data.description,
      incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
      incidentLocation: data.incidentLocation,
      isAnonymous: data.isAnonymous || false,
      trackingPinHash,
      slaDueAt
    });

    // Registar histórico inicial
    await ProcessStatusHistory.create({
      processId: processDoc._id,
      changedById: user ? new mongoose.Types.ObjectId(user.id) : undefined,
      changedByName: user ? user.fullName : 'Sistema / Utente',
      toStatus: 'SUBMITTED',
      reason: 'Submissão inicial do processo pelo portal.'
    });

    // Registar em auditoria
    await AuditLog.create({
      userId: user ? new mongoose.Types.ObjectId(user.id) : undefined,
      userName: user ? user.fullName : 'Utente',
      action: 'PROCESS_CREATED',
      entity: 'PROCESS',
      entityId: processDoc._id.toString(),
      details: { referenceNumber, type: data.type }
    });

    return {
      process: processDoc,
      trackingPin: randomPin // Retornado apenas uma vez na criação para guarda pelo utente
    };
  }

  /**
   * Consulta pública direta por Código de Referência e PIN (sem necessidade de login)
   */
  async lookupByReferenceAndPin(referenceNumber: string, pin: string) {
    const processDoc = await Process.findOne({ referenceNumber })
      .populate('departmentId', 'name code')
      .populate('categoryId', 'name code');

    if (!processDoc) {
      throw new Error('Processo não encontrado com a referência indicada.');
    }

    const isMatch = await bcrypt.compare(pin, processDoc.trackingPinHash);
    if (!isMatch) {
      throw new Error('PIN de acompanhamento incorreto.');
    }

    // Obter mensagens públicas (estritamente sem notas internas)
    const messages = await ProcessMessage.find({
      processId: processDoc._id,
      isInternal: false
    }).sort({ createdAt: 1 });

    const history = await ProcessStatusHistory.find({
      processId: processDoc._id
    }).sort({ createdAt: 1 });

    return {
      process: processDoc,
      messages,
      history
    };
  }

  /**
   * Listagem de processos com controlo rigoroso de perfis e RBAC
   */
  async getProcesses(
    user: AuthenticatedUser,
    filters: {
      status?: StatusCode;
      departmentId?: string;
      type?: ProcessTypeCode;
      search?: string;
    }
  ) {
    const query: Record<string, unknown> = {};

    // 1. Regra de autorização por perfil
    if (user.roles.includes('PATIENT')) {
      // Paciente só pode ver os seus próprios processos
      query.patientId = new mongoose.Types.ObjectId(user.id);
    } else if (user.roles.includes('STAFF')) {
      // Funcionário vê os que lhe foram atribuídos OU os do seu departamento
      if (user.departmentId) {
        query.$or = [
          { assignedStaffId: new mongoose.Types.ObjectId(user.id) },
          { departmentId: new mongoose.Types.ObjectId(user.departmentId) }
        ];
      } else {
        query.assignedStaffId = new mongoose.Types.ObjectId(user.id);
      }
    }
    // SUPERVISOR e ADMIN veem todos do hospital

    if (filters.status) query.status = filters.status;
    if (filters.departmentId) query.departmentId = new mongoose.Types.ObjectId(filters.departmentId);
    if (filters.type) query.type = filters.type;

    if (filters.search) {
      query.$or = [
        { referenceNumber: { $regex: filters.search, $options: 'i' } },
        { title: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return await Process.find(query)
      .populate('departmentId', 'name code')
      .populate('categoryId', 'name code')
      .populate('assignedStaffId', 'fullName email phone')
      .sort({ createdAt: -1 });
  }

  /**
   * Consulta de processo por ID com verificação de permissões
   */
  async getProcessById(processId: string, user: AuthenticatedUser) {
    const processDoc = await Process.findById(processId)
      .populate('departmentId', 'name code phone email')
      .populate('categoryId', 'name code defaultPriority')
      .populate('assignedStaffId', 'fullName email phone');

    if (!processDoc) throw new Error('Processo não encontrado.');

    // Paciente só pode aceder ao seu próprio processo
    if (user.roles.includes('PATIENT')) {
      if (!processDoc.patientId || processDoc.patientId.toString() !== user.id) {
        throw new Error('Acesso não autorizado a este processo hospitalar.');
      }
    }

    const history = await ProcessStatusHistory.find({ processId }).sort({ createdAt: 1 });

    return {
      process: processDoc,
      history
    };
  }

  /**
   * Consulta de mensagens do processo com aplicação estrita da REGRA DE CONFIDENCIALIDADE
   */
  async getProcessMessages(processId: string, user: AuthenticatedUser) {
    const query: Record<string, unknown> = {
      processId: new mongoose.Types.ObjectId(processId)
    };

    // REGRA DE CONFIDENCIALIDADE MANDATÓRIA:
    // Utentes/Pacientes NUNCA visualizam notas internas confidenciais da equipa médica/staff
    if (user.roles.includes('PATIENT')) {
      query.isInternal = false;
    }

    return await ProcessMessage.find(query).sort({ createdAt: 1 });
  }

  /**
   * Adição de mensagem (resposta pública ou nota interna)
   */
  async addMessage(
    processId: string,
    user: AuthenticatedUser,
    data: { body: string; isInternal?: boolean }
  ) {
    const processDoc = await Process.findById(processId);
    if (!processDoc) throw new Error('Processo não encontrado.');

    let messageType: 'PUBLIC_REPLY' | 'INTERNAL_NOTE' | 'PATIENT_MESSAGE' = 'PUBLIC_REPLY';
    let isInternal = data.isInternal || false;

    if (user.roles.includes('PATIENT')) {
      // Paciente nunca pode criar notas internas
      isInternal = false;
      messageType = 'PATIENT_MESSAGE';
    } else {
      messageType = isInternal ? 'INTERNAL_NOTE' : 'PUBLIC_REPLY';
    }

    const message = await ProcessMessage.create({
      processId: processDoc._id,
      senderId: new mongoose.Types.ObjectId(user.id),
      senderName: user.fullName,
      senderRole: user.roles[0],
      messageType,
      body: data.body,
      isInternal
    });

    // Se for uma resposta oficial ao paciente, atualizar firstResponseAt
    if (!isInternal && !user.roles.includes('PATIENT') && !processDoc.firstResponseAt) {
      processDoc.firstResponseAt = new Date();
      await processDoc.save();
    }

    return message;
  }

  /**
   * Transição e alteração de estado com motivo e registo em histórico
   */
  async updateStatus(
    processId: string,
    user: AuthenticatedUser,
    data: { status: StatusCode; reason: string }
  ) {
    const processDoc = await Process.findById(processId);
    if (!processDoc) throw new Error('Processo não encontrado.');

    const fromStatus = processDoc.status;
    processDoc.status = data.status;

    if (data.status === 'CLOSED') {
      processDoc.closedAt = new Date();
    } else if (data.status === 'REOPENED') {
      processDoc.reopenCount += 1;
      processDoc.closedAt = undefined;
    }

    await processDoc.save();

    await ProcessStatusHistory.create({
      processId: processDoc._id,
      changedById: new mongoose.Types.ObjectId(user.id),
      changedByName: user.fullName,
      fromStatus,
      toStatus: data.status,
      reason: data.reason
    });

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(user.id),
      userName: user.fullName,
      action: 'PROCESS_STATUS_CHANGED',
      entity: 'PROCESS',
      entityId: processDoc._id.toString(),
      details: { fromStatus, toStatus: data.status, reason: data.reason }
    });

    return processDoc;
  }

  /**
   * Reatribuição operacional de processo (Exclusivo para Supervisores e Administradores)
   */
  async reassign(
    processId: string,
    user: AuthenticatedUser,
    data: { staffId: string; reason: string }
  ) {
    const processDoc = await Process.findById(processId);
    if (!processDoc) throw new Error('Processo não encontrado.');

    const staffUser = await User.findById(data.staffId);
    if (!staffUser) throw new Error('Colaborador indicado não encontrado.');

    processDoc.assignedStaffId = staffUser._id;
    if (processDoc.status === 'SUBMITTED' || processDoc.status === 'TRIAGE') {
      processDoc.status = 'ASSIGNED';
    }
    await processDoc.save();

    await ProcessStatusHistory.create({
      processId: processDoc._id,
      changedById: new mongoose.Types.ObjectId(user.id),
      changedByName: user.fullName,
      toStatus: processDoc.status,
      reason: `Reatribuição para ${staffUser.fullName}. Motivo: ${data.reason}`
    });

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(user.id),
      userName: user.fullName,
      action: 'PROCESS_REASSIGNED',
      entity: 'PROCESS',
      entityId: processDoc._id.toString(),
      details: { newStaffId: data.staffId, staffName: staffUser.fullName, reason: data.reason }
    });

    return processDoc;
  }

  /**
   * Avaliação de satisfação do paciente (Feedback por estrelas)
   */
  async submitFeedback(
    processId: string,
    user: AuthenticatedUser,
    data: { rating: number; comment?: string }
  ) {
    const processDoc = await Process.findById(processId);
    if (!processDoc) throw new Error('Processo não encontrado.');

    const feedback = await Feedback.findOneAndUpdate(
      { processId: processDoc._id },
      {
        processId: processDoc._id,
        patientId: new mongoose.Types.ObjectId(user.id),
        rating: data.rating,
        comment: data.comment,
        isPublic: true
      },
      { upsert: true, new: true }
    );

    return feedback;
  }
}

export const processService = new ProcessService();
