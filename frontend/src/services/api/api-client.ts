import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { LocalStorage } from 'quasar';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.API_URL) ||
  import.meta.env?.VITE_API_URL ||
  'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Intercetor de pedidos: anexa o token JWT se presente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = LocalStorage.getItem<string>('hospitalcare_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

// Intercetor de respostas: tratamento padronizado de erros e expiração de sessão
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sessão expirada
      LocalStorage.remove('hospitalcare_token');
      LocalStorage.remove('hospitalcare_user');
      if (typeof window !== 'undefined' && !window.location.hash.includes('/entrar')) {
        // Redirecionamento suave
        window.location.href = '/entrar';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Erro de comunicação com o servidor hospitalar.';

    return Promise.reject(new Error(message));
  }
);
