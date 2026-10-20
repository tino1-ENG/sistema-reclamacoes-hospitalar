import mongoose, { Schema, Document } from 'mongoose';
import type { PriorityCode } from './Category.js';

export type ProcessTypeCode = 'COMPLAINT' | 'CLARIFICATION' | 'SUGGESTION';
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

export interface IProcess extends Document {
  referenceNumber: string;
  hospitalId: mongoose.Types.ObjectId;
  patientId?: mongoose.Types.ObjectId;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  departmentId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  type: ProcessTypeCode;
  status: StatusCode;
  priority: PriorityCode;
  title: string;
  description: string;
  incidentDate?: Date;
  incidentLocation?: string;
  isAnonymous: boolean;
  trackingPinHash: string;
  assignedStaffId?: mongoose.Types.ObjectId;
  slaDueAt: Date;
  firstResponseAt?: Date;
  closedAt?: Date;
  reopenCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProcessSchema = new Schema<IProcess>(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    patientName: { type: String },
    patientPhone: { type: String },
    patientEmail: { type: String },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    type: {
      type: String,
      enum: ['COMPLAINT', 'CLARIFICATION', 'SUGGESTION'],
      required: true
    },
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'TRIAGE',
        'ASSIGNED',
        'IN_REVIEW',
        'WAITING_PATIENT',
        'WAITING_DEPARTMENT',
        'ANSWERED',
        'CLOSED',
        'REOPENED'
      ],
      default: 'SUBMITTED',
      index: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
      index: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    incidentDate: { type: Date },
    incidentLocation: { type: String },
    isAnonymous: { type: Boolean, default: false },
    trackingPinHash: { type: String, required: true },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    slaDueAt: { type: Date, required: true },
    firstResponseAt: { type: Date },
    closedAt: { type: Date },
    reopenCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Process = mongoose.model<IProcess>('Process', ProcessSchema);
