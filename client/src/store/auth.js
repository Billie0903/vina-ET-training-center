import { reactive } from 'vue'

export const authStore = reactive({
   user: null,
   token: localStorage.getItem('token') || null,
   
   // Check if user is authenticated
   get isAuthenticated() {
      return !!this.token && !!this.user
   },
   
   // Set user and token
   setAuth(user, token) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
   },
   
   // Clear authentication
   clearAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
   },
   
   // Initialize from localStorage
   init() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
         this.token = token
         this.user = JSON.parse(user)
      }
   }
})