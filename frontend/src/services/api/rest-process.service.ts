import { apiClient } from './api-client';
import type {
  IProcessService,
  CreateProcessDto,
  ProcessFilters
} from '../contracts';
import type {
  Process,
  ProcessMessage,
  ProcessStatusHistory,
  ProcessAssignment,
  ProcessAttachment,
  Feedback,
  RoleCode,
  StatusCode,
  PriorityCode,
  ProcessTypeCode
} from '../../types';

const STATUS_ID_MAP: Record<StatusCode, number> = {
  SUBMITTED: 1,
  TRIAGE: 2,
  ASSIGNED: 3,
  IN_REVIEW: 4,
  WAITING_PATIENT: 5,
  WAITING_DEPARTMENT: 6,
  ANSWERED: 7,
  CLOSED: 8,
  REOPENED: 9
};

const ID_TO_STATUS_MAP: Record<number, StatusCode> = {
  1: 'SUBMITTED',
  2: 'TRIAGE',
  3: 'ASSIGNED',
  4: 'IN_REVIEW',
  5: 'WAITING_PATIENT',
  6: 'WAITING_DEPARTMENT',
  7: 'ANSWERED',
  8: 'CLOSED',
  9: 'REOPENED'
};

const TYPE_ID_MAP: Record<ProcessTypeCode, number> = {
  COMPLAINT: 1,
  CLARIFICATION: 2,
  SUGGESTION: 3
};

const ID_TO_TYPE_MAP: Record<number, ProcessTypeCode> = {
  1: 'COMPLAINT',
  2: 'CLARIFICATION',
  3: 'SUGGESTION'
};

const PRIORITY_ID_MAP: Record<PriorityCode, number> = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  URGENT: 4
};

interface BackendProcessDoc {
  _id: string;
  id?: string;
  referenceNumber?: string;
  referenceCode?: string;
  hospitalId: string;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  type: ProcessTypeCode;
  status: StatusCode;
  priority: PriorityCode;
  title?: string;
  subject?: string;
  description: string;
  incidentDate?: string;
  assignedStaffId?: { _id: string; fullName: string } | string;
  departmentId?: { _id: string; name: string; code: string } | string;
  categoryId?: { _id: string; name: string; code: string } | string;
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string;
  closedAt?: string;
  slaDueAt?: string;
}

function mapProcess(p: BackendProcessDoc): Process {
  const statusCode = p.status || 'SUBMITTED';
  const statusId = STATUS_ID_MAP[statusCode] || 1;

  const typeCode = p.type || 'COMPLAINT';
  const processTypeId = TYPE_ID_MAP[typeCode] || 1;

  const priorityCode = p.priority || 'NORMAL';
  const priorityId = PRIORITY_ID_MAP[priorityCode] || 2;

  const deptObj = typeof p.departmentId === 'object' && p.departmentId ? p.departmentId : null;
  const catObj = typeof p.categoryId === 'object' && p.categoryId ? p.categoryId : null;
  const staffObj = typeof p.assignedStaffId === 'object' && p.assignedStaffId ? p.assignedStaffId : null;

  return {
    id: p._id || p.id || '',
    referenceCode: p.referenceNumber || p.referenceCode || '',
    hospitalId: p.hospitalId || '',
    patientId: p.patientId || '',
    patientName: p.patientName,
    patientPhone: p.patientPhone,
    processTypeId,
    processType: {
      id: processTypeId,
      code: typeCode,
      name:
        typeCode === 'COMPLAINT'
          ? 'Reclamação'
          : typeCode === 'CLARIFICATION'
            ? 'Pedido de Esclarecimento'
            : 'Sugestão',
      isActive: true
    },
    categoryId: catObj ? catObj._id : (p.categoryId as string) || '',
    category: catObj
      ? {
          id: catObj._id,
          hospitalId: p.hospitalId,
          name: catObj.name,
          code: catObj.code,
          isActive: true,
          createdAt: p.createdAt
        }
      : undefined,
    departmentId: deptObj ? deptObj._id : (p.departmentId as string) || undefined,
    department: deptObj
      ? {
          id: deptObj._id,
          hospitalId: p.hospitalId,
          name: deptObj.name,
          code: deptObj.code,
          isActive: true,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }
      : null,
    statusId,
    status: {
      id: statusId,
      code: statusCode,
      name:
        statusCode === 'SUBMITTED'
          ? 'Submetido'
          : statusCode === 'TRIAGE'
            ? 'Em Triagem'
            : statusCode === 'ASSIGNED'
              ? 'Atribuído'
              : statusCode === 'IN_REVIEW'
                ? 'Em Análise'
                : statusCode === 'ANSWERED'
                  ? 'Respondido'
                  : statusCode === 'CLOSED'
                    ? 'Concluído'
                    : statusCode,
      isFinal: statusCode === 'CLOSED',
      isPatientVisible: true,
      sortOrder: statusId,
      isActive: true
    },
    priorityId,
    priority: {
      id: priorityId,
      code: priorityCode,
      name:
        priorityCode === 'URGENT'
          ? 'Urgente'
          : priorityCode === 'HIGH'
            ? 'Alta'
            : priorityCode === 'NORMAL'
              ? 'Normal'
              : 'Baixa',
      weight: priorityId,
      isActive: true
    },
    subject: p.title || p.subject || '',
    description: p.description || '',
    incidentDate: p.incidentDate,
    assignedTo: staffObj ? staffObj._id : (p.assignedStaffId as string) || undefined,
    assignedStaffName: staffObj ? staffObj.fullName : undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    firstResponseAt: p.firstResponseAt,
    closedAt: p.closedAt,
    slaDueAt: p.slaDueAt
  };
}

interface BackendMessageDoc {
  _id: string;
  processId: string;
  senderId?: string;
  senderName: string;
  senderRole: RoleCode;
  messageType: 'PUBLIC_REPLY' | 'INTERNAL_NOTE' | 'PATIENT_MESSAGE';
  body: string;
  isInternal: boolean;
  createdAt: string;
}

function mapMessage(m: BackendMessageDoc): ProcessMessage {
  return {
    id: m._id,
    processId: m.processId,
    authorId: m.senderId || '',
    authorName: m.senderName,
    authorRole: m.senderRole,
    messageType: m.messageType,
    body: m.body,
    isVisibleToPatient: !m.isInternal,
    createdAt: m.createdAt
  };
}

interface BackendHistoryDoc {
  _id: string;
  processId: string;
  changedById?: string;
  changedByName: string;
  fromStatus?: StatusCode;
  toStatus: StatusCode;
  reason?: string;
  createdAt: string;
}

function mapHistory(h: BackendHistoryDoc): ProcessStatusHistory {
  return {
    id: h._id,
    processId: h.processId,
    fromStatusId: h.fromStatus ? STATUS_ID_MAP[h.fromStatus] : undefined,
    fromStatusName: h.fromStatus,
    toStatusId: STATUS_ID_MAP[h.toStatus] || 1,
    toStatusName: h.toStatus,
    changedBy: h.changedById,
    changerName: h.changedByName,
    reason: h.reason,
    createdAt: h.createdAt
  };
}

export class RestProcessService implements IProcessService {
  async getProcesses(filters?: ProcessFilters): Promise<Process[]> {
    const params: Record<string, unknown> = {};

    if (filters?.searchTerm) params.search = filters.searchTerm;
    if (filters?.statusId) params.status = ID_TO_STATUS_MAP[filters.statusId];
    if (filters?.processTypeId) params.type = ID_TO_TYPE_MAP[filters.processTypeId];
    if (filters?.departmentId) params.departmentId = filters.departmentId;

    const res = await apiClient.get('/processes', { params });
    const docs = res.data.data as BackendProcessDoc[];
    return docs.map(mapProcess);
  }

  async getProcessById(id: string): Promise<Process | null> {
    try {
      const res = await apiClient.get(`/processes/${id}`);
      return mapProcess(res.data.data.process);
    } catch {
      return null;
    }
  }

  async getProcessByReference(referenceCode: string): Promise<Process | null> {
    const processes = await this.getProcesses({ searchTerm: referenceCode });
    const found = processes.find((p) => p.referenceCode.toUpperCase() === referenceCode.toUpperCase());
    return found || null;
  }

  async lookupWithPin(referenceNumber: string, pin: string): Promise<{ process: Process; messages: ProcessMessage[]; history: ProcessStatusHistory[] }> {
    const res = await apiClient.post('/processes/lookup', { referenceNumber, pin });
    const data = res.data.data;
    return {
      process: mapProcess(data.process),
      messages: (data.messages as BackendMessageDoc[]).map(mapMessage),
      history: (data.history as BackendHistoryDoc[]).map(mapHistory)
    };
  }

  async createProcess(dto: CreateProcessDto, authorId?: string): Promise<Process> {
    void authorId;
    const typeCode = ID_TO_TYPE_MAP[dto.processTypeId] || 'COMPLAINT';

    const res = await apiClient.post('/processes', {
      title: dto.subject,
      description: dto.description,
      type: typeCode,
      departmentId: dto.departmentId,
      categoryId: dto.categoryId,
      incidentDate: dto.incidentDate
    });

    const doc = res.data.data.process;
    return mapProcess(doc);
  }

  async updateStatus(
    processId: string,
    statusId: number,
    reason: string,
    changedBy?: string
  ): Promise<Process> {
    void changedBy;
    const statusCode = ID_TO_STATUS_MAP[statusId] || 'IN_REVIEW';
    const res = await apiClient.patch(`/processes/${processId}/status`, {
      status: statusCode,
      reason
    });
    return mapProcess(res.data.data);
  }

  async assignProcess(
    processId: string,
    assignedTo: string,
    departmentId?: string,
    note?: string,
    assignedBy?: string
  ): Promise<ProcessAssignment> {
    void departmentId;
    void assignedBy;
    const res = await apiClient.post(`/processes/${processId}/reassign`, {
      staffId: assignedTo,
      reason: note || 'Atribuição operacional'
    });

    const updated = mapProcess(res.data.data);
    return {
      id: Math.random().toString(),
      processId,
      assignedTo,
      assigneeName: updated.assignedStaffName || 'Colaborador',
      assignedBy: '',
      assignerName: 'Supervisor',
      assignmentNote: note,
      assignedAt: new Date().toISOString()
    };
  }

  async getMessages(processId: string, userRole?: RoleCode): Promise<ProcessMessage[]> {
    void userRole;
    const res = await apiClient.get(`/processes/${processId}/messages`);
    const docs = res.data.data as BackendMessageDoc[];
    return docs.map(mapMessage);
  }

  async addMessage(
    processId: string,
    message: { body: string; messageType: ProcessMessage['messageType']; isVisibleToPatient: boolean },
    authorId?: string
  ): Promise<ProcessMessage> {
    void authorId;
    const isInternal = !message.isVisibleToPatient;
    const res = await apiClient.post(`/processes/${processId}/messages`, {
      body: message.body,
      isInternal
    });
    return mapMessage(res.data.data);
  }

  async getStatusHistory(processId: string): Promise<ProcessStatusHistory[]> {
    const res = await apiClient.get(`/processes/${processId}`);
    const historyDocs = (res.data.data.history || []) as BackendHistoryDoc[];
    return historyDocs.map(mapHistory);
  }

  getAssignments(processId?: string): Promise<ProcessAssignment[]> {
    void processId;
    return Promise.resolve([]);
  }

  getAttachments(processId?: string): Promise<ProcessAttachment[]> {
    void processId;
    return Promise.resolve([]);
  }

  async addFeedback(processId: string, rating: number, comment?: string): Promise<Feedback> {
    const res = await apiClient.post(`/processes/${processId}/feedback`, {
      rating,
      comment
    });
    const data = res.data.data;
    return {
      id: data._id,
      processId,
      patientId: data.patientId || '',
      rating: data.rating,
      comment: data.comment,
      createdAt: data.createdAt
    };
  }
}

export const restProcessService = new RestProcessService();
