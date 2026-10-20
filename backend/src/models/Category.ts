import mongoose, { Schema, Document } from 'mongoose';

export type PriorityCode = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface ICategory extends Document {
  hospitalId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  code: string;
  name: string;
  description?: string;
  defaultPriority: PriorityCode;
  defaultSlaHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    defaultPriority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' },
    defaultSlaHours: { type: Number, default: 48 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
