// HospitalCare — Definição de Rotas e Áreas Funcionais

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // 1. Rotas Públicas
  {
    path: '/',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/public/HomePage.vue') },
      { path: 'sobre', component: () => import('../pages/public/AboutPage.vue') },
      { path: 'contactos', component: () => import('../pages/public/ContactPage.vue') },
      { path: 'faq', component: () => import('../pages/public/FaqPage.vue') }
    ]
  },

  // 2. Rotas de Autenticação
  {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      { path: 'entrar', component: () => import('../pages/auth/LoginPage.vue') },
      { path: 'registar', component: () => import('../pages/auth/RegisterPage.vue') },
      { path: 'recuperar-senha', component: () => import('../pages/auth/ForgotPasswordPage.vue') },
      { path: 'redefinir-senha', component: () => import('../pages/auth/ResetPasswordPage.vue') },
      { path: 'verificar-contacto', component: () => import('../pages/auth/VerifyPhonePage.vue') }
    ]
  },

  // 3. Portal do Paciente / Utente
  {
    path: '/paciente',
    component: () => import('../layouts/PatientLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['PATIENT', 'ADMIN'] },
    children: [
      { path: '', redirect: '/paciente/dashboard' },
      { path: 'dashboard', component: () => import('../pages/patient/PatientDashboardPage.vue') },
      { path: 'processos', component: () => import('../pages/patient/PatientProcessListPage.vue') },
      { path: 'processos/novo', component: () => import('../pages/patient/ProcessCreatePage.vue') },
      { path: 'processos/:id', component: () => import('../pages/patient/PatientProcessDetailsPage.vue') },
      { path: 'processos/:id/avaliacao', component: () => import('../pages/patient/ProcessFeedbackPage.vue') },
      { path: 'perfil', component: () => import('../pages/patient/PatientProfilePage.vue') }
    ]
  },

  // 4. Portal dos Colaboradores Hospitalares (Staff)
  {
    path: '/funcionario',
    component: () => import('../layouts/StaffLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['STAFF', 'SUPERVISOR', 'ADMIN'] },
    children: [
      { path: '', redirect: '/funcionario/dashboard' },
      { path: 'dashboard', component: () => import('../pages/staff/StaffDashboardPage.vue') },
      { path: 'processos', component: () => import('../pages/staff/StaffAssignedProcessesPage.vue') },
      { path: 'processos/:id', component: () => import('../pages/staff/StaffProcessDetailsPage.vue') }
    ]
  },

  // 5. Painel de Supervisão Clínica
  {
    path: '/supervisor',
    component: () => import('../layouts/SupervisorLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['SUPERVISOR', 'ADMIN'] },
    children: [
      { path: '', redirect: '/supervisor/dashboard' },
      { path: 'dashboard', component: () => import('../pages/supervisor/SupervisorDashboardPage.vue') },
      { path: 'reatribuicao', component: () => import('../pages/supervisor/SupervisorReassignmentPage.vue') },
      { path: 'prazos', component: () => import('../pages/supervisor/SupervisorSlaTrackingPage.vue') },
      { path: 'relatorios', component: () => import('../pages/supervisor/SupervisorReportsPage.vue') }
    ]
  },

  // 6. Painel Administrativo Geral
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['ADMIN'] },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: () => import('../pages/admin/AdminDashboardPage.vue') },
      { path: 'utilizadores', component: () => import('../pages/admin/AdminUsersPage.vue') },
      { path: 'departamentos', component: () => import('../pages/admin/AdminDepartmentsPage.vue') },
      { path: 'categorias', component: () => import('../pages/admin/AdminCategoriesPage.vue') },
      { path: 'sla', component: () => import('../pages/admin/AdminSlaPoliciesPage.vue') },
      { path: 'faqs', component: () => import('../pages/admin/AdminFaqsPage.vue') },
      { path: 'auditoria', component: () => import('../pages/admin/AdminAuditLogsPage.vue') },
      { path: 'configuracoes', component: () => import('../pages/admin/AdminSettingsPage.vue') }
    ]
  },

  // Páginas de Erro e Acesso
  {
    path: '/403',
    component: () => import('../pages/errors/Error403Page.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/errors/Error404Page.vue')
  }
];

export default routes;
