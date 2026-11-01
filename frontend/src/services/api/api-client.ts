import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { LocalStorage } from 'quasar';

const getBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.API_URL) {
    return process.env.API_URL;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const custom = window.localStorage.getItem('hospitalcare_api_url');
    if (custom) return custom;

    // Se estiver no GitHub Pages ou hospedagem estática, direciona para o backend de produção na nuvem Render
    if (window.location.hostname.includes('github.io')) {
      return 'https://sistema-reclamacoes-hospitalar-2.onrender.com/api';
    }
    return window.location.port !== '9000' ? '/api' : 'http://localhost:5000/api';
  }
  return 'https://sistema-reclamacoes-hospitalar-2.onrender.com/api';
};

export const API_BASE_URL = getBaseUrl();

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
      if (typeof window !== 'undefined') {
        const hash = window.location.hash || '';
        if (!hash.includes('/entrar')) {
          // Redirecionamento que respeita modo hash e nunca perde o prefixo do repositório no GitHub Pages
          window.location.hash = '#/entrar';
        }
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
