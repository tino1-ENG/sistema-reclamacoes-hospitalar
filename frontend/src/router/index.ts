import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from '../stores/auth.store';
import type { RoleCode } from '../types';

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : (import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  });

  // Guardas de Navegação e Proteção Visual por Perfil
  Router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();
    if (!authStore.user) {
      await authStore.init();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ path: '/entrar', query: { redirect: to.fullPath } });
    }

    if (to.meta.allowedRoles) {
      const allowed = to.meta.allowedRoles as RoleCode[];
      const userRoles = authStore.user?.roles || [];
      const hasPermission = userRoles.some((r) => allowed.includes(r));
      if (!hasPermission) {
        return next('/403');
      }
    }

    next();
  });

  return Router;
});
