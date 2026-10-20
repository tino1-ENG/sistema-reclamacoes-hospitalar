// HospitalCare — Pinia Store de Autenticação e Sessão

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, RoleCode } from '../types';
import { authService } from '../services';
import type { LoginCredentials, RegisterPatientDto } from '../services/contracts';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const primaryRole = computed<RoleCode>(() => {
    if (!user.value || !user.value.roles.length) return 'PATIENT';
    return user.value.roles[0] ?? 'PATIENT';
  });

  const isPatient = computed(() => user.value?.roles.includes('PATIENT') ?? false);
  const isStaff = computed(() => user.value?.roles.includes('STAFF') ?? false);
  const isSupervisor = computed(() => user.value?.roles.includes('SUPERVISOR') ?? false);
  const isAdmin = computed(() => user.value?.roles.includes('ADMIN') ?? false);

  async function init(): Promise<void> {
    loading.value = true;
    try {
      user.value = await authService.getCurrentUser();
    } finally {
      loading.value = false;
    }
  }

  async function login(credentials: LoginCredentials): Promise<User> {
    loading.value = true;
    try {
      const result = await authService.login(credentials);
      user.value = result.user;
      token.value = result.token;
      return result.user;
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    loading.value = true;
    try {
      await authService.logout();
      user.value = null;
      token.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function register(dto: RegisterPatientDto): Promise<User> {
    loading.value = true;
    try {
      const result = await authService.registerPatient(dto);
      user.value = result.user;
      token.value = result.token;
      return result.user;
    } finally {
      loading.value = false;
    }
  }

  async function switchDemoRole(role: RoleCode): Promise<User> {
    loading.value = true;
    try {
      const updatedUser = await authService.switchDemoRole(role);
      user.value = updatedUser;
      return updatedUser;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    primaryRole,
    isPatient,
    isStaff,
    isSupervisor,
    isAdmin,
    init,
    login,
    logout,
    register,
    switchDemoRole
  };
});
