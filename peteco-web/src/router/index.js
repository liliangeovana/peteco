import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/cadastrar',
    component: () => import('../pages/cadastrar/CadastrarPet.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/meus-pets',
    component: () => import('../pages/meus-pets/MeusPets.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/mapa',
    component: () => import('../pages/mapa/MapaPets.vue'),
    meta: { requerAuth: true }
  },
  {
    path: '/pet/:id',
    component: () => import('../pages/pet/DetalhePet.vue'),
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

router.beforeEach((to) => {
  if (!to.meta.requerAuth) return true
  return localStorage.getItem('peteco_usuario') ? true : '/login'
})

export default router
