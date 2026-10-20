import type { RoleCode } from '../models/User.js';

export interface AuthenticatedUser {
  id: string;
  hospitalId: string;
  fullName: string;
  phone?: string;
  email?: string;
  roles: RoleCode[];
  departmentId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
