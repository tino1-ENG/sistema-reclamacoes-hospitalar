import { apiClient } from './api-client';
import { LocalStorage } from 'quasar';
import type {
  IAuthService,
  LoginCredentials,
  RegisterPatientDto
} from '../contracts';
import type { User, RoleCode } from '../../types';

interface BackendUser {
  id: string;
  hospitalId: string;
  fullName: string;
  email?: string;
  phone?: string;
  roles: RoleCode[];
  status?: string;
  departmentId?: string;
}

function mapUser(u: BackendUser): User {
  return {
    id: u.id,
    hospitalId: u.hospitalId,
    fullName: u.fullName,
    phone: u.phone || '',
    email: u.email,
    isActive: u.status === 'ACTIVE' || true,
    roles: u.roles,
    departmentIds: u.departmentId ? [u.departmentId] : [],
    createdAt: new Date().toISOString()
  };
}

export class RestAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const res = await apiClient.post('/auth/login', {
      identifier: credentials.identifier,
      password: credentials.password || '123456',
      roleHint: credentials.roleHint
    });

    const data = res.data.data;
    const user = mapUser(data.user);
    const token = data.token;

    LocalStorage.set('hospitalcare_token', token);
    LocalStorage.set('hospitalcare_user', user);

    return { user, token };
  }

  logout(): Promise<void> {
    LocalStorage.remove('hospitalcare_token');
    LocalStorage.remove('hospitalcare_user');
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<User | null> {
    const token = LocalStorage.getItem<string>('hospitalcare_token');
    if (!token) return null;

    try {
      const res = await apiClient.get('/auth/me');
      const u = res.data.data;
      const user = mapUser(u);
      LocalStorage.set('hospitalcare_user', user);
      return user;
    } catch {
      return LocalStorage.getItem<User>('hospitalcare_user');
    }
  }

  async registerPatient(dto: RegisterPatientDto): Promise<{ user: User; token: string }> {
    const res = await apiClient.post('/auth/register', {
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      password: dto.password || '123456'
    });

    const data = res.data.data;
    const user = mapUser(data.user);
    const token = data.token;

    LocalStorage.set('hospitalcare_token', token);
    LocalStorage.set('hospitalcare_user', user);

    return { user, token };
  }

  verifyPhone(code?: string): Promise<boolean> {
    void code;
    return Promise.resolve(true);
  }

  sendPasswordReset(identifier?: string): Promise<boolean> {
    void identifier;
    return Promise.resolve(true);
  }

  resetPassword(token?: string, newPassword?: string): Promise<boolean> {
    void token;
    void newPassword;
    return Promise.resolve(true);
  }

  async switchDemoRole(role: RoleCode): Promise<User> {
    let identifier = '+258 84 912 3456';
    if (role === 'STAFF') identifier = 'carlos.mondlane@hcm.gov.mz';
    else if (role === 'SUPERVISOR') identifier = 'ana.bila@hcm.gov.mz';
    else if (role === 'ADMIN') identifier = 'rui.nhantumbo@hcm.gov.mz';

    const { user } = await this.login({
      identifier,
      password: '123456',
      roleHint: role
    });

    return user;
  }
}

export const restAuthService = new RestAuthService();
