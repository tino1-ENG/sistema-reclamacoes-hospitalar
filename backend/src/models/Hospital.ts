import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  timezone: string;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    timezone: { type: String, default: 'Africa/Maputo' },
    currency: { type: String, default: 'MZN' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Hospital = mongoose.model<IHospital>('Hospital', HospitalSchema);
