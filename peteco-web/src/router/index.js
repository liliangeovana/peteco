import { createRouter, createWebHistory } from 'vue-router'
import { http } from '../client/http.js'

const routes = [
  {
    path: '/login',
    component: () => import('../pages/auth/Login.vue')
  },
  {
    path: '/cadastro',
    component: () => import('../pages/auth/Cadastro.vue')
  },
  {
    path: '/',
    component: () => import('../pages/mapa/Mapa.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/heatmap',
    component: () => import('../pages/mapa/Heatmap.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/clusters',
    component: () => import('../pages/mapa/Clusters.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/dashboard',
    component: () => import('../pages/dashboard/Dashboard.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/analise',
    component: () => import('../pages/analise/Analise.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/pets',
    component: () => import('../pages/pets/ListaPets.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/perfil',
    component: () => import('../pages/perfil/Perfil.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/perfil/editar',
    component: () => import('../pages/perfil/EditarPerfil.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  if (!to.meta.requerAuth) return true
  try {
    await http.get('/auth/me')
    return true
  } catch {
    return '/login'
  }
})

export default router
