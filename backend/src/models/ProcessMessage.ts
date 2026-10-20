import mongoose, { Schema, Document } from 'mongoose';
import type { RoleCode } from './User.js';

export type MessageType = 'PUBLIC_REPLY' | 'INTERNAL_NOTE' | 'PATIENT_MESSAGE';

export interface IProcessMessage extends Document {
  processId: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
  senderName: string;
  senderRole: RoleCode;
  messageType: MessageType;
  body: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProcessMessageSchema = new Schema<IProcessMessage>(
  {
    processId: { type: Schema.Types.ObjectId, ref: 'Process', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ['PATIENT', 'STAFF', 'SUPERVISOR', 'ADMIN'],
      required: true
    },
    messageType: {
      type: String,
      enum: ['PUBLIC_REPLY', 'INTERNAL_NOTE', 'PATIENT_MESSAGE'],
      required: true
    },
    body: { type: String, required: true },
    isInternal: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const ProcessMessage = mongoose.model<IProcessMessage>('ProcessMessage', ProcessMessageSchema);
