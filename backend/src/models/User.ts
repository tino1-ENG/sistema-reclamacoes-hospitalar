import mongoose, { Schema, Document } from 'mongoose';

export type RoleCode = 'PATIENT' | 'STAFF' | 'SUPERVISOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface IUser extends Document {
  hospitalId: mongoose.Types.ObjectId;
  fullName: string;
  phone?: string;
  email?: string;
  passwordHash: string;
  roles: RoleCode[];
  status: UserStatus;
  isPhoneVerified: boolean;
  departmentId?: mongoose.Types.ObjectId;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, index: true, sparse: true },
    email: { type: String, index: true, sparse: true },
    passwordHash: { type: String, required: true },
    roles: [{ type: String, enum: ['PATIENT', 'STAFF', 'SUPERVISOR', 'ADMIN'], default: ['PATIENT'] }],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    isPhoneVerified: { type: Boolean, default: false },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
