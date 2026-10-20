import mongoose, { Schema, Document } from 'mongoose';
import type { StatusCode } from './Process.js';

export interface IProcessStatusHistory extends Document {
  processId: mongoose.Types.ObjectId;
  changedById?: mongoose.Types.ObjectId;
  changedByName: string;
  fromStatus?: StatusCode;
  toStatus: StatusCode;
  reason?: string;
  createdAt: Date;
}

const ProcessStatusHistorySchema = new Schema<IProcessStatusHistory>(
  {
    processId: { type: Schema.Types.ObjectId, ref: 'Process', required: true, index: true },
    changedById: { type: Schema.Types.ObjectId, ref: 'User' },
    changedByName: { type: String, required: true },
    fromStatus: { type: String },
    toStatus: { type: String, required: true },
    reason: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ProcessStatusHistory = mongoose.model<IProcessStatusHistory>(
  'ProcessStatusHistory',
  ProcessStatusHistorySchema
);
