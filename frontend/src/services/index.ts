// HospitalCare — Ponto Central de Acesso a Serviços
// Suporta arquitetura híbrida resiliente: Conexão REST com Backend MongoDB (na Nuvem ou Local)
// com Fallback Automático transparente para Mock se o backend estiver inacessível ou em caso de ?mock=true

import { restAuthService } from './api/rest-auth.service';
import { restProcessService } from './api/rest-process.service';
import { restDepartmentService } from './api/rest-department.service';
import { restCategoryService } from './api/rest-category.service';
import { restNotificationService } from './api/rest-notification.service';
import { restDashboardService } from './api/rest-dashboard.service';
import { restFaqService } from './api/rest-faq.service';
import { restAuditService } from './api/rest-audit.service';
import { aiService } from './api/rest-ai.service';

import { mockAuthService } from './mock/mock-auth.service';
import { mockProcessService } from './mock/mock-process.service';
import { mockDepartmentService } from './mock/mock-department.service';
import { mockCategoryService } from './mock/mock-category.service';
import { mockNotificationService } from './mock/mock-notification.service';
import { mockDashboardService } from './mock/mock-dashboard.service';
import { mockFaqService } from './mock/mock-faq.service';
import { mockAuditService } from './mock/mock-audit.service';

// Força mock apenas se explicitamente solicitado via query parameter (ex: ?mock=true)
const forceMock =
  typeof window !== 'undefined' && window.location.search.includes('mock=true');

export const authService = forceMock ? mockAuthService : restAuthService;
export const processService = forceMock ? mockProcessService : restProcessService;
export const departmentService = forceMock ? mockDepartmentService : restDepartmentService;
export const categoryService = forceMock ? mockCategoryService : restCategoryService;
export const notificationService = forceMock ? mockNotificationService : restNotificationService;
export const dashboardService = forceMock ? mockDashboardService : restDashboardService;
export const faqService = forceMock ? mockFaqService : restFaqService;
export const auditService = forceMock ? mockAuditService : restAuditService;
export { aiService };

export * from './contracts';
export { apiClient, API_BASE_URL } from './api/api-client';
