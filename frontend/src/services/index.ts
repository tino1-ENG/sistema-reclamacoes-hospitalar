// HospitalCare — Ponto Central de Acesso a Serviços
// FASE 3: Totalmente integrado com o backend REST HTTP (Node.js/Express + MongoDB)

import { restAuthService } from './api/rest-auth.service';
import { restProcessService } from './api/rest-process.service';
import { restDepartmentService } from './api/rest-department.service';
import { restCategoryService } from './api/rest-category.service';
import { restNotificationService } from './api/rest-notification.service';
import { restDashboardService } from './api/rest-dashboard.service';
import { restFaqService } from './api/rest-faq.service';
import { restAuditService } from './api/rest-audit.service';

export const authService = restAuthService;
export const processService = restProcessService;
export const departmentService = restDepartmentService;
export const categoryService = restCategoryService;
export const notificationService = restNotificationService;
export const dashboardService = restDashboardService;
export const faqService = restFaqService;
export const auditService = restAuditService;

export * from './contracts';
export { apiClient } from './api/api-client';
