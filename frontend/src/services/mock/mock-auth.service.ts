// HospitalCare — Serviço Mock de Autenticação

import type {
  IAuthService,
  LoginCredentials,
  RegisterPatientDto
} from '../contracts';
import type { User, RoleCode } from '../../types';
import { mockUsers } from './mock-data';

const STORAGE_KEY_CURRENT_USER = 'hospitalcare_mock_current_user';
const STORAGE_KEY_TOKEN = 'hospitalcare_mock_token';

class MockAuthService implements IAuthService {
  private users: User[] = [...mockUsers];
  private currentUser: User | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Default inicial para conveniência de teste no frontend: Paciente
        this.currentUser = this.users[0] ?? null;
        if (this.currentUser) this.persistSession(this.currentUser);
      }
    } catch {
      this.currentUser = this.users[0] ?? null;
    }
  }

  private persistSession(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, `mock-jwt-token-${user.id}`);
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simula atraso de rede
    await new Promise((r) => setTimeout(r, 400));

    let user: User | undefined;

    if (credentials.roleHint) {
      user = this.users.find((u) => u.roles.includes(credentials.roleHint!));
    }

    if (!user) {
      const idClean = credentials.identifier.trim().toLowerCase();
      user = this.users.find(
        (u) =>
          u.phone.replace(/\D/g, '') === idClean.replace(/\D/g, '') ||
          u.email?.toLowerCase() === idClean
      );
    }

    if (!user) {
      // Se não encontrado, utiliza o primeiro paciente como fallback
      user = this.users[0]!;
    }

    user.lastLoginAt = new Date().toISOString();
    this.currentUser = user;
    this.persistSession(user);

    return {
      user,
      token: `mock-jwt-token-${user.id}`
    };
  }

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    this.currentUser = null;
    this.persistSession(null);
  }

  async getCurrentUser(): Promise<User | null> {
    await Promise.resolve();
    return this.currentUser;
  }

  async registerPatient(dto: RegisterPatientDto): Promise<{ user: User; token: string }> {
    await new Promise((r) => setTimeout(r, 500));

    const newUser: User = {
      id: `user-pat-${Date.now().toString().slice(-4)}`,
      hospitalId: 'hosp-001',
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      email: dto.email?.trim(),
      phoneVerifiedAt: null,
      emailVerifiedAt: null,
      isActive: true,
      roles: ['PATIENT'],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.users.unshift(newUser);
    this.currentUser = newUser;
    this.persistSession(newUser);

    return {
      user: newUser,
      token: `mock-jwt-token-${newUser.id}`
    };
  }

  async verifyPhone(code: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400));
    // Código de demonstração padrão: 123456 ou qualquer código de 6 dígitos
    if (code.length === 6 && this.currentUser) {
      this.currentUser.phoneVerifiedAt = new Date().toISOString();
      this.persistSession(this.currentUser);
      return true;
    }
    return false;
  }

  async sendPasswordReset(identifier: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400));
    return Boolean(identifier);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400));
    return Boolean(token && newPassword);
  }

  async switchDemoRole(role: RoleCode): Promise<User> {
    await Promise.resolve();
    const target = this.users.find((u) => u.roles.includes(role));
    if (!target) {
      throw new Error(`Utilizador de demonstração com perfil ${role} não encontrado`);
    }
    this.currentUser = target;
    this.persistSession(target);
    return target;
  }
}

export const mockAuthService = new MockAuthService();
