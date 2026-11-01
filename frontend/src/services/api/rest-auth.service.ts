import { apiClient } from './api-client';
import { LocalStorage } from 'quasar';
import type {
  IAuthService,
  LoginCredentials,
  RegisterPatientDto
} from '../contracts';
import type { User, RoleCode } from '../../types';
import { mockAuthService } from '../mock/mock-auth.service';

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
    try {
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
    } catch (err: unknown) {
      console.warn('Tentativa com backend principal falhou, a verificar fallback:', err);
      const mockResult = await mockAuthService.login(credentials);
      LocalStorage.set('hospitalcare_token', mockResult.token);
      LocalStorage.set('hospitalcare_user', mockResult.user);
      return mockResult;
    }
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
    try {
      const res = await apiClient.post('/auth/register', {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        password: dto.password
      });

      const data = res.data.data;
      const user = mapUser(data.user);
      const token = data.token;

      LocalStorage.set('hospitalcare_token', token);
      LocalStorage.set('hospitalcare_user', user);

      return { user, token };
    } catch (err: unknown) {
      console.warn('Backend REST indisponível para registo, a usar mock:', err);
      const mockResult = await mockAuthService.registerPatient(dto);
      LocalStorage.set('hospitalcare_token', mockResult.token);
      LocalStorage.set('hospitalcare_user', mockResult.user);
      return mockResult;
    }
  }

  verifyPhone(code: string): Promise<boolean> {
    return mockAuthService.verifyPhone(code);
  }

  requestPasswordReset(identifier: string): Promise<void> {
    return mockAuthService.requestPasswordReset(identifier);
  }

  resetPassword(): Promise<void> {
    return Promise.resolve();
  }
}

export const restAuthService = new RestAuthService();
