// HospitalCare — Modelos e Contratos TypeScript
// Baseado estritamente em HospitalCare_Arquitetura_Tecnica_Base_Dados.md

export type RoleCode = 'PATIENT' | 'STAFF' | 'SUPERVISOR' | 'ADMIN';

export interface Role {
  id: number;
  code: RoleCode;
  name: string;
  description?: string | undefined;
  isSystemRole: boolean;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  address?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  hospitalId: string;
  fullName: string;
  phone: string;
  email?: string | undefined;
  phoneVerifiedAt?: string | null | undefined;
  emailVerifiedAt?: string | null | undefined;
  isActive: boolean;
  roles: RoleCode[];
  departmentIds?: string[] | undefined;
  createdAt: string;
  lastLoginAt?: string | null | undefined;
}

export interface PatientProfile {
  userId: string;
  preferredContactChannel: 'IN_APP' | 'SMS' | 'EMAIL';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  description?: string | undefined;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProcessTypeCode = 'COMPLAINT' | 'CLARIFICATION' | 'SUGGESTION';

export interface ProcessType {
  id: number;
  code: ProcessTypeCode;
  name: string;
  description?: string | undefined;
  isActive: boolean;
}

export interface Category {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  description?: string | undefined;
  defaultDepartmentId?: string | undefined;
  isActive: boolean;
  createdAt: string;
}

export type StatusCode = 
  | 'SUBMITTED' 
  | 'TRIAGE' 
  | 'ASSIGNED' 
  | 'IN_REVIEW' 
  | 'WAITING_PATIENT' 
  | 'WAITING_DEPARTMENT' 
  | 'ANSWERED' 
  | 'CLOSED' 
  | 'REOPENED';

export interface ProcessStatus {
  id: number;
  code: StatusCode;
  name: string;
  description?: string | undefined;
  isFinal: boolean;
  isPatientVisible: boolean;
  sortOrder: number;
  isActive: boolean;
  color?: string | undefined;
}

export type PriorityCode = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Priority {
  id: number;
  code: PriorityCode;
  name: string;
  weight: number;
  isActive: boolean;
  color?: string | undefined;
}

export interface ProcessAttachment {
  id: string;
  processId: string;
  uploadedBy: string;
  uploaderName?: string | undefined;
  messageId?: string | undefined;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  url?: string | undefined;
}

export type MessageType = 'PUBLIC_REPLY' | 'PATIENT_MESSAGE' | 'INTERNAL_NOTE' | 'INFO_REQUEST';

export interface ProcessMessage {
  id: string;
  processId: string;
  authorId: string;
  authorName: string;
  authorRole: RoleCode;
  messageType: MessageType;
  body: string;
  isVisibleToPatient: boolean;
  createdAt: string;
  editedAt?: string | null | undefined;
  attachments?: ProcessAttachment[] | undefined;
}

export interface ProcessStatusHistory {
  id: string;
  processId: string;
  fromStatusId?: number | null | undefined;
  fromStatusName?: string | undefined;
  toStatusId: number;
  toStatusName: string;
  changedBy?: string | null | undefined;
  changerName?: string | undefined;
  reason?: string | undefined;
  createdAt: string;
}

export interface ProcessAssignment {
  id: string;
  processId: string;
  assignedTo: string;
  assigneeName: string;
  assignedBy: string;
  assignerName: string;
  departmentId?: string | undefined;
  departmentName?: string | undefined;
  assignmentNote?: string | undefined;
  assignedAt: string;
  endedAt?: string | null | undefined;
}

export interface Process {
  id: string;
  referenceCode: string;
  hospitalId: string;
  patientId: string;
  patientName?: string | undefined;
  patientPhone?: string | undefined;
  processTypeId: number;
  processType: ProcessType;
  categoryId: string;
  category?: Category | undefined;
  departmentId?: string | null | undefined;
  department?: Department | null | undefined;
  statusId: number;
  status: ProcessStatus;
  priorityId: number;
  priority: Priority;
  subject: string;
  description: string;
  incidentDate?: string | null | undefined;
  assignedTo?: string | null | undefined;
  assignedStaffName?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string | null | undefined;
  closedAt?: string | null | undefined;
  closureReason?: string | null | undefined;
  slaDueAt?: string | null | undefined;
  slaOverdue?: boolean | undefined;
}

export interface Notification {
  id: string;
  userId: string;
  processId?: string | undefined;
  eventType: string;
  title: string;
  body: string;
  readAt?: string | null | undefined;
  createdAt: string;
}

export interface FAQ {
  id: string;
  hospitalId: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  category?: string | undefined;
  createdAt: string;
}

export interface Feedback {
  id: string;
  processId: string;
  patientId: string;
  rating: number; // 1 a 5
  comment?: string | undefined;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUserId?: string | undefined;
  actorName?: string | undefined;
  action: string;
  entityType: string;
  entityId?: string | undefined;
  requestId?: string | undefined;
  ipAddress?: string | undefined;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SlaPolicy {
  id: string;
  hospitalId: string;
  name: string;
  processTypeId?: number | undefined;
  categoryId?: string | undefined;
  priorityId?: number | undefined;
  firstResponseHours: number;
  resolutionHours: number;
  isActive: boolean;
}

export interface DashboardMetrics {
  totalProcesses: number;
  pendingProcesses: number;
  inReviewProcesses: number;
  resolvedProcesses: number;
  overdueProcesses: number;
  averageResponseTimeHours: number;
  satisfactionRatePercent: number;
  distributionByType: { type: string; count: number }[];
  distributionByDepartment: { department: string; count: number }[];
  distributionByStatus: { status: string; count: number }[];
}
