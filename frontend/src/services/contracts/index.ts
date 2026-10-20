// HospitalCare — Contratos Abstratos de Serviços
// Permite alternar perfeitamente entre Mock e API REST na Fase 3

import type {
  User,
  RoleCode,
  Process,
  ProcessType,
  Category,
  Department,
  ProcessStatus,
  Priority,
  ProcessMessage,
  ProcessAttachment,
  ProcessStatusHistory,
  ProcessAssignment,
  Notification,
  FAQ,
  DashboardMetrics,
  AuditLog,
  Feedback,
  SlaPolicy
} from '../../types';

export interface LoginCredentials {
  identifier: string; // Telefone ou Email
  password?: string | undefined;
  roleHint?: RoleCode | undefined;
}

export interface RegisterPatientDto {
  fullName: string;
  phone: string;
  email?: string | undefined;
  preferredContactChannel: 'IN_APP' | 'SMS' | 'EMAIL';
  password?: string | undefined;
}

export interface CreateProcessDto {
  processTypeId: number;
  categoryId: string;
  departmentId?: string | undefined;
  subject: string;
  description: string;
  incidentDate?: string | undefined;
  attachments?: File[] | undefined;
}

export interface ProcessFilters {
  searchTerm?: string | undefined;
  statusId?: number | undefined;
  categoryId?: string | undefined;
  departmentId?: string | undefined;
  priorityId?: number | undefined;
  processTypeId?: number | undefined;
  patientId?: string | undefined;
  assignedTo?: string | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  registerPatient(dto: RegisterPatientDto): Promise<{ user: User; token: string }>;
  verifyPhone(code: string): Promise<boolean>;
  sendPasswordReset(identifier: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  switchDemoRole(role: RoleCode): Promise<User>;
}

export interface IProcessService {
  getProcesses(filters?: ProcessFilters): Promise<Process[]>;
  getProcessById(id: string): Promise<Process | null>;
  getProcessByReference(referenceCode: string): Promise<Process | null>;
  createProcess(dto: CreateProcessDto, authorId: string): Promise<Process>;
  updateStatus(processId: string, statusId: number, reason: string, changedBy: string): Promise<Process>;
  assignProcess(processId: string, assignedTo: string, departmentId: string | undefined, note: string, assignedBy: string): Promise<ProcessAssignment>;
  getMessages(processId: string, userRole: RoleCode): Promise<ProcessMessage[]>;
  addMessage(processId: string, message: { body: string; messageType: ProcessMessage['messageType']; isVisibleToPatient: boolean }, authorId: string): Promise<ProcessMessage>;
  getStatusHistory(processId: string): Promise<ProcessStatusHistory[]>;
  getAssignments(processId: string): Promise<ProcessAssignment[]>;
  getAttachments(processId: string): Promise<ProcessAttachment[]>;
  addFeedback(processId: string, rating: number, comment?: string): Promise<Feedback>;
}

export interface IDepartmentService {
  getDepartments(): Promise<Department[]>;
  getDepartmentById(id: string): Promise<Department | null>;
  createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department>;
  updateDepartment(id: string, department: Partial<Department>): Promise<Department>;
}

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getProcessTypes(): Promise<ProcessType[]>;
  getStatuses(): Promise<ProcessStatus[]>;
  getPriorities(): Promise<Priority[]>;
  getSlaPolicies(): Promise<SlaPolicy[]>;
}

export interface INotificationService {
  getUserNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface IDashboardService {
  getMetrics(role: RoleCode, userId?: string): Promise<DashboardMetrics>;
}

export interface IFaqService {
  getPublishedFaqs(): Promise<FAQ[]>;
  getAllFaqs(): Promise<FAQ[]>;
  saveFaq(faq: Partial<FAQ>): Promise<FAQ>;
  deleteFaq(id: string): Promise<void>;
}

export interface IAuditService {
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  logAction(action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>): Promise<void>;
}
