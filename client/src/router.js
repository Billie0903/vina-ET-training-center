import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from './store/auth'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Courses from './views/Courses.vue'
import Show from './views/Show.vue'
import New from './views/New.vue'
import Edit from './views/Edit.vue'
import About from './views/About.vue'
import Contact from './views/Contact.vue'
import News from './views/News.vue'
import NewsDetail from './views/NewsDetail.vue'
import AdminDashboard from './views/AdminDashboard.vue'

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
   },
   {
      path: '/about',
      name: 'About',
      component: About
   },
   {
      path: '/contact',
      name: 'Contact',
      component: Contact
   },
   {
      path: '/news',
      name: 'News',
      component: News
   },
   {
      path: '/news/:slug',
      name: 'NewsDetail',
      component: NewsDetail
   },
   {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
   // Initialize auth store if not already done
   if (!authStore.user && localStorage.getItem('user')) {
      authStore.init()
   }
   
   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
   } else if (to.meta.requiresAdmin) {
      if (!authStore.isAuthenticated) {
         next('/login')
      } else if (!authStore.user || authStore.user.role !== 'admin') {
         // Redirect to home page with error message for non-admin users
         next('/')
         alert('Access denied. Admin privileges required.')
      } else {
         next()
      }
   } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/courses')
   } else {
      next()
   }
})

export default router