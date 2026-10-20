import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  hospitalId: mongoose.Types.ObjectId;
  code: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
