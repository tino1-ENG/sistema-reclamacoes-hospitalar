// HospitalCare — Serviço Mock de Gestão de Processos
// Suporta isolamento estrito de dados por perfil e regras de visibilidade

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
  RoleCode,
  Feedback
} from '../../types';
import {
  mockProcesses,
  mockMessages,
  mockStatusHistory,
  mockAssignments,
  mockAttachments,
  mockProcessTypes,
  mockProcessStatuses,
  mockPriorities,
  mockCategories,
  mockDepartments,
  mockUsers
} from './mock-data';

const STORAGE_KEY_PROCESSES = 'hospitalcare_mock_processes';
const STORAGE_KEY_MESSAGES = 'hospitalcare_mock_messages';
const STORAGE_KEY_HISTORY = 'hospitalcare_mock_history';
const STORAGE_KEY_ASSIGNMENTS = 'hospitalcare_mock_assignments';

class MockProcessService implements IProcessService {
  private processes: Process[] = [];
  private messages: ProcessMessage[] = [];
  private history: ProcessStatusHistory[] = [];
  private assignments: ProcessAssignment[] = [];
  private attachments: ProcessAttachment[] = [...mockAttachments];
  private feedbacks: Feedback[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const p = localStorage.getItem(STORAGE_KEY_PROCESSES);
      this.processes = p ? JSON.parse(p) : [...mockProcesses];

      const m = localStorage.getItem(STORAGE_KEY_MESSAGES);
      this.messages = m ? JSON.parse(m) : [...mockMessages];

      const h = localStorage.getItem(STORAGE_KEY_HISTORY);
      this.history = h ? JSON.parse(h) : [...mockStatusHistory];

      const a = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
      this.assignments = a ? JSON.parse(a) : [...mockAssignments];
    } catch {
      this.processes = [...mockProcesses];
      this.messages = [...mockMessages];
      this.history = [...mockStatusHistory];
      this.assignments = [...mockAssignments];
    }
  }

  private persistState(): void {
    localStorage.setItem(STORAGE_KEY_PROCESSES, JSON.stringify(this.processes));
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(this.messages));
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(this.assignments));
  }

  async getProcesses(filters?: ProcessFilters): Promise<Process[]> {
    await new Promise((r) => setTimeout(r, 250));
    let list = [...this.processes];

    if (!filters) return list;

    if (filters.patientId) {
      list = list.filter((p) => p.patientId === filters.patientId);
    }

    if (filters.assignedTo) {
      list = list.filter((p) => p.assignedTo === filters.assignedTo);
    }

    if (filters.statusId) {
      list = list.filter((p) => p.statusId === filters.statusId);
    }

    if (filters.categoryId) {
      list = list.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.departmentId) {
      list = list.filter((p) => p.departmentId === filters.departmentId);
    }

    if (filters.priorityId) {
      list = list.filter((p) => p.priorityId === filters.priorityId);
    }

    if (filters.processTypeId) {
      list = list.filter((p) => p.processTypeId === filters.processTypeId);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.referenceCode.toLowerCase().includes(term) ||
          p.subject.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProcessById(id: string): Promise<Process | null> {
    await new Promise((r) => setTimeout(r, 200));
    return this.processes.find((p) => p.id === id) || null;
  }

  async getProcessByReference(referenceCode: string): Promise<Process | null> {
    await new Promise((r) => setTimeout(r, 200));
    const clean = referenceCode.trim().toUpperCase();
    return this.processes.find((p) => p.referenceCode.toUpperCase() === clean) || null;
  }

  async createProcess(dto: CreateProcessDto, authorId: string): Promise<Process> {
    await new Promise((r) => setTimeout(r, 400));

    const author = mockUsers.find((u) => u.id === authorId) ?? mockUsers[0]!;
    const type = mockProcessTypes.find((t) => t.id === dto.processTypeId) ?? mockProcessTypes[0]!;
    const category = mockCategories.find((c) => c.id === dto.categoryId);
    const department = dto.departmentId
      ? mockDepartments.find((d) => d.id === dto.departmentId)
      : category?.defaultDepartmentId
        ? mockDepartments.find((d) => d.id === category.defaultDepartmentId)
        : null;

    const count = this.processes.length + 101;
    const ref = `HC-2026-${count.toString().padStart(6, '0')}`;
    const initialStatus = mockProcessStatuses[0]!; // SUBMITTED
    const defaultPriority = mockPriorities[1]!; // NORMAL

    const newProcess: Process = {
      id: `proc-${Date.now()}`,
      referenceCode: ref,
      hospitalId: 'hosp-001',
      patientId: author.id,
      patientName: author.fullName,
      patientPhone: author.phone,
      processTypeId: type.id,
      processType: type,
      categoryId: dto.categoryId,
      category,
      departmentId: department?.id ?? null,
      department,
      statusId: initialStatus.id,
      status: initialStatus,
      priorityId: defaultPriority.id,
      priority: defaultPriority,
      subject: dto.subject.trim(),
      description: dto.description.trim(),
      incidentDate: dto.incidentDate ?? null,
      assignedTo: null,
      assignedStaffName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      firstResponseAt: null,
      closedAt: null,
      closureReason: null,
      slaDueAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      slaOverdue: false
    };

    // Histórico de criação
    const histEntry: ProcessStatusHistory = {
      id: `hist-${Date.now()}`,
      processId: newProcess.id,
      fromStatusId: null,
      toStatusName: initialStatus.name,
      toStatusId: initialStatus.id,
      changedBy: author.id,
      changerName: author.fullName,
      reason: 'Criação do processo pelo paciente',
      createdAt: newProcess.createdAt
    };

    this.processes.unshift(newProcess);
    this.history.unshift(histEntry);
    this.persistState();

    return newProcess;
  }

  async updateStatus(
    processId: string,
    statusId: number,
    reason: string,
    changedBy: string
  ): Promise<Process> {
    await new Promise((r) => setTimeout(r, 300));
    const proc = this.processes.find((p) => p.id === processId);
    if (!proc) throw new Error('Processo não encontrado');

    const newStatus = mockProcessStatuses.find((s) => s.id === statusId);
    if (!newStatus) throw new Error('Estado inválido');

    const changer = mockUsers.find((u) => u.id === changedBy) ?? mockUsers[1]!;

    const histEntry: ProcessStatusHistory = {
      id: `hist-${Date.now()}`,
      processId: proc.id,
      fromStatusId: proc.statusId,
      fromStatusName: proc.status.name,
      toStatusId: newStatus.id,
      toStatusName: newStatus.name,
      changedBy: changer.id,
      changerName: changer.fullName,
      reason: reason || 'Atualização de estado operacional',
      createdAt: new Date().toISOString()
    };

    proc.statusId = newStatus.id;
    proc.status = newStatus;
    proc.updatedAt = new Date().toISOString();

    if (newStatus.isFinal) {
      proc.closedAt = new Date().toISOString();
      proc.closureReason = reason;
    }

    this.history.unshift(histEntry);
    this.persistState();

    return proc;
  }

  async assignProcess(
    processId: string,
    assignedToId: string,
    departmentId: string | undefined,
    note: string,
    assignedById: string
  ): Promise<ProcessAssignment> {
    await new Promise((r) => setTimeout(r, 300));
    const proc = this.processes.find((p) => p.id === processId);
    if (!proc) throw new Error('Processo não encontrado');

    const assignee = mockUsers.find((u) => u.id === assignedToId);
    const assigner = mockUsers.find((u) => u.id === assignedById) ?? mockUsers[2]!;
    const dept = departmentId
      ? mockDepartments.find((d) => d.id === departmentId)
      : proc.department;

    const assignment: ProcessAssignment = {
      id: `asg-${Date.now()}`,
      processId: proc.id,
      assignedTo: assignedToId,
      assigneeName: assignee?.fullName || 'Colaborador Autorizado',
      assignedBy: assigner.id,
      assignerName: assigner.fullName,
      departmentId: dept?.id,
      departmentName: dept?.name,
      assignmentNote: note,
      assignedAt: new Date().toISOString(),
      endedAt: null
    };

    proc.assignedTo = assignedToId;
    proc.assignedStaffName = assignee?.fullName || null;
    if (dept) {
      proc.departmentId = dept.id;
      proc.department = dept;
    }
    // Mudar estado para ASSIGNED se estivesse em SUBMITTED ou TRIAGE
    if (proc.statusId === 1 || proc.statusId === 2) {
      const assignedStatus = mockProcessStatuses.find((s) => s.code === 'ASSIGNED')!;
      proc.statusId = assignedStatus.id;
      proc.status = assignedStatus;
    }
    proc.updatedAt = new Date().toISOString();

    this.assignments.unshift(assignment);
    this.persistState();

    return assignment;
  }

  async getMessages(processId: string, userRole: RoleCode): Promise<ProcessMessage[]> {
    await new Promise((r) => setTimeout(r, 150));
    let list = this.messages.filter((m) => m.processId === processId);

    // Regra crítica: se o utilizador for PACIENTE, notas internas são estritamente ocultadas
    if (userRole === 'PATIENT') {
      list = list.filter((m) => m.isVisibleToPatient);
    }

    return list.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async addMessage(
    processId: string,
    message: { body: string; messageType: ProcessMessage['messageType']; isVisibleToPatient: boolean },
    authorId: string
  ): Promise<ProcessMessage> {
    await new Promise((r) => setTimeout(r, 300));
    const proc = this.processes.find((p) => p.id === processId);
    if (!proc) throw new Error('Processo não encontrado');

    const author = mockUsers.find((u) => u.id === authorId) ?? mockUsers[0]!;
    const isPatient = author.roles.includes('PATIENT');

    const newMsg: ProcessMessage = {
      id: `msg-${Date.now()}`,
      processId,
      authorId: author.id,
      authorName: author.fullName,
      authorRole: author.roles[0] ?? 'PATIENT',
      messageType: isPatient ? 'PATIENT_MESSAGE' : message.messageType,
      body: message.body.trim(),
      isVisibleToPatient: isPatient ? true : message.isVisibleToPatient,
      createdAt: new Date().toISOString(),
      editedAt: null
    };

    if (!isPatient && !proc.firstResponseAt && message.isVisibleToPatient) {
      proc.firstResponseAt = new Date().toISOString();
    }
    proc.updatedAt = new Date().toISOString();

    this.messages.push(newMsg);
    this.persistState();

    return newMsg;
  }

  async getStatusHistory(processId: string): Promise<ProcessStatusHistory[]> {
    await new Promise((r) => setTimeout(r, 150));
    return this.history
      .filter((h) => h.processId === processId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAssignments(processId: string): Promise<ProcessAssignment[]> {
    await new Promise((r) => setTimeout(r, 150));
    return this.assignments
      .filter((a) => a.processId === processId)
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
  }

  async getAttachments(processId: string): Promise<ProcessAttachment[]> {
    await new Promise((r) => setTimeout(r, 150));
    return this.attachments.filter((a) => a.processId === processId);
  }

  async addFeedback(processId: string, rating: number, comment?: string): Promise<Feedback> {
    await new Promise((r) => setTimeout(r, 300));
    const patientId = mockUsers[0]?.id ?? 'user-pat-001';
    const fb: Feedback = {
      id: `fb-${Date.now()}`,
      processId,
      patientId,
      rating,
      comment: comment ?? undefined,
      createdAt: new Date().toISOString()
    };
    this.feedbacks.push(fb);
    return fb;
  }
}

export const mockProcessService = new MockProcessService();
