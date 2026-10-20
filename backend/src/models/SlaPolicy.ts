import mongoose, { Schema, Document } from 'mongoose';
import type { PriorityCode } from './Category.js';

export interface ISlaPolicy extends Document {
  hospitalId: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  priority: PriorityCode;
  responseTimeHours: number;
  resolutionTimeHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SlaPolicySchema = new Schema<ISlaPolicy>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], required: true },
    responseTimeHours: { type: Number, required: true },
    resolutionTimeHours: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SlaPolicy = mongoose.model<ISlaPolicy>('SlaPolicy', SlaPolicySchema);
