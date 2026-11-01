// HospitalCare — Serviço Mock de Autenticação Realista
// Valida credenciais reais por email ou telemóvel sem pré-seleção forçada de perfil

import type {
  IAuthService,
  LoginCredentials,
  RegisterPatientDto
} from '../contracts';
import type { User, RoleCode } from '../../types';
import { mockUsers } from './mock-data';

const STORAGE_KEY_CURRENT_USER = 'hospitalcare_mock_current_user';
const STORAGE_KEY_TOKEN = 'hospitalcare_mock_token';
const STORAGE_KEY_ALL_USERS = 'hospitalcare_mock_registered_users';

class MockAuthService implements IAuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadUsers();
    this.restoreSession();
  }

  private loadUsers(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      if (stored) {
        const extraUsers: User[] = JSON.parse(stored);
        this.users = [...mockUsers, ...extraUsers.filter((eu) => !mockUsers.some((mu) => mu.id === eu.id))];
      } else {
        this.users = [...mockUsers];
      }
    } catch {
      this.users = [...mockUsers];
    }
  }

  private persistUsers(): void {
    try {
      const extra = this.users.filter((u) => !mockUsers.some((mu) => mu.id === u.id));
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(extra));
    } catch {
      // Ignorar quota cheia
    }
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Sistema Real: Ninguém fica autenticado automaticamente!
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
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
    await new Promise((r) => setTimeout(r, 350));

    const idClean = credentials.identifier.trim().toLowerCase();
    const phoneDigits = idClean.replace(/\D/g, '');

    // Localizar utilizador por Email OU Telemóvel
    const user = this.users.find((u) => {
      const uEmail = u.email?.toLowerCase().trim();
      const uPhoneDigits = u.phone.replace(/\D/g, '');

      // Correspondência por email
      if (uEmail && (uEmail === idClean || idClean.includes(uEmail))) {
        return true;
      }

      // Correspondência por telefone (compara os últimos 7-9 dígitos)
      if (phoneDigits.length >= 7 && (uPhoneDigits.endsWith(phoneDigits) || phoneDigits.endsWith(uPhoneDigits))) {
        return true;
      }

      return false;
    });

    if (!user) {
      throw new Error('Credenciais inválidas. Verifique o email/telemóvel ou registe uma nova conta de paciente.');
    }

    if (!user.isActive) {
      throw new Error('Esta conta encontra-se desativada pela administração.');
    }

    // Validação de palavra-passe
    if (!credentials.password || credentials.password.trim().length < 4) {
      throw new Error('A palavra-passe introduzida é inválida.');
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
    await new Promise((r) => setTimeout(r, 150));
    this.currentUser = null;
    this.persistSession(null);
  }

  async getCurrentUser(): Promise<User | null> {
    await Promise.resolve();
    return this.currentUser;
  }

  async registerPatient(dto: RegisterPatientDto): Promise<{ user: User; token: string }> {
    await new Promise((r) => setTimeout(r, 400));

    const phoneClean = dto.phone.trim();
    const emailClean = dto.email?.trim().toLowerCase();

    // Impedir duplicados
    const existing = this.users.find(
      (u) =>
        u.phone.replace(/\D/g, '') === phoneClean.replace(/\D/g, '') ||
        (emailClean && u.email?.toLowerCase().trim() === emailClean)
    );

    if (existing) {
      throw new Error('Já existe uma conta registada com este telemóvel ou email.');
    }

    const newUser: User = {
      id: `user-pat-${Date.now().toString().slice(-6)}`,
      hospitalId: 'hosp-001',
      fullName: dto.fullName.trim(),
      phone: phoneClean.startsWith('+') ? phoneClean : `+258 ${phoneClean}`,
      email: emailClean,
      phoneVerifiedAt: new Date().toISOString(),
      emailVerifiedAt: emailClean ? new Date().toISOString() : null,
      isActive: true,
      roles: ['PATIENT'],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.users.unshift(newUser);
    this.persistUsers();

    this.currentUser = newUser;
    this.persistSession(newUser);

    return {
      user: newUser,
      token: `mock-jwt-token-${newUser.id}`
    };
  }

  async verifyPhone(code: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300));
    if (code.length === 6 && this.currentUser) {
      this.currentUser.phoneVerifiedAt = new Date().toISOString();
      this.persistSession(this.currentUser);
      return true;
    }
    return false;
  }

  async sendPasswordReset(identifier: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300));
    return Boolean(identifier);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300));
    return Boolean(token && newPassword);
  }

  async switchDemoRole(role: RoleCode): Promise<User> {
    await Promise.resolve();
    const target = this.users.find((u) => u.roles.includes(role));
    if (!target) {
      throw new Error(`Utilizador com perfil ${role} não encontrado`);
    }
    this.currentUser = target;
    this.persistSession(target);
    return target;
  }
}

export const mockAuthService = new MockAuthService();
