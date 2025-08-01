import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from './store/auth'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Courses from './views/Courses.vue'
import Show from './views/Show.vue'
import New from './views/New.vue'
import Edit from './views/Edit.vue'

const routes = [
   {
      path: '/',
      name: 'Home',
      component: Home
   },
   {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }
   },
   {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true }
   },
   {
      path: '/courses',
      name: 'Courses',
      component: Courses
   },
   {
      path: '/courses/new',
      name: 'New',
      component: New,
      meta: { requiresAuth: true }
   },
   {
      path: '/courses/show/:id',
      name: 'Show',
      component: Show
   },
   {
      path: '/courses/edit/:id',
      name: 'Edit',
      component: Edit,
      meta: { requiresAuth: true }
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
   } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/courses')
   } else {
      next()
   }
})

export default router