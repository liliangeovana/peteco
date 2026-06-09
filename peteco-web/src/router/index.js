import { createRouter, createWebHistory } from 'vue-router'
import { http } from '../client/http.js'

const routes = [
  {
    path: '/',
    component: () => import('../pages/landing/Landing.vue')
  },
  {
    path: '/login',
    component: () => import('../pages/auth/Login.vue')
  },
  {
    path: '/cadastro',
    component: () => import('../pages/auth/Cadastro.vue')
  },
  {
    path: '/feed',
    component: () => import('../pages/feed/Feed.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/pet/:id',
    component: () => import('../pages/pet/DetalhePet.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/analytics',
    component: () => import('../pages/analytics/Analytics.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/pets',
    component: () => import('../pages/pets/ListaPets.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/analise',
    component: () => import('../pages/analise/Analise.vue'),
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
    redirect: '/feed'
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  if (!to.meta.requerAuth) return true
  try {
    await http.get('/auth/me')
    return true
  } catch {
    if (localStorage.getItem('peteco_usuario')) return true
    return '/login'
  }
})

export default router
