// HospitalCare — Ponto Central de Acesso a Serviços
// Suporta modo Híbrido: Conexão REST com Backend MongoDB (em produção/desenvolvimento)
// com Fallback Automático para Mock em Hospedagem Estática (GitHub Pages, Vercel ou Offline)

import { restAuthService } from './api/rest-auth.service';
import { restProcessService } from './api/rest-process.service';
import { restDepartmentService } from './api/rest-department.service';
import { restCategoryService } from './api/rest-category.service';
import { restNotificationService } from './api/rest-notification.service';
import { restDashboardService } from './api/rest-dashboard.service';
import { restFaqService } from './api/rest-faq.service';
import { restAuditService } from './api/rest-audit.service';

import { mockAuthService } from './mock/mock-auth.service';
import { mockProcessService } from './mock/mock-process.service';
import { mockDepartmentService } from './mock/mock-department.service';
import { mockCategoryService } from './mock/mock-category.service';
import { mockNotificationService } from './mock/mock-notification.service';
import { mockDashboardService } from './mock/mock-dashboard.service';
import { mockFaqService } from './mock/mock-faq.service';
import { mockAuditService } from './mock/mock-audit.service';

// Deteta se o ambiente é puramente estático (sem backend próprio como GitHub Pages)
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
    window.location.search.includes('mock=true'));

export const authService = isStaticHost ? mockAuthService : restAuthService;
export const processService = isStaticHost ? mockProcessService : restProcessService;
export const departmentService = isStaticHost ? mockDepartmentService : restDepartmentService;
export const categoryService = isStaticHost ? mockCategoryService : restCategoryService;
export const notificationService = isStaticHost ? mockNotificationService : restNotificationService;
export const dashboardService = isStaticHost ? mockDashboardService : restDashboardService;
export const faqService = isStaticHost ? mockFaqService : restFaqService;
export const auditService = isStaticHost ? mockAuditService : restAuditService;

export * from './contracts';
export { apiClient } from './api/api-client';
