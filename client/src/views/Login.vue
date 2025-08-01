
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h2>Sign In</h2>
        
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              v-model="form.email" 
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password"
              v-model="form.password" 
              class="form-input"
              required
            >
          </div>
          
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Signing In...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
        
        <div class="auth-links">
          <p>Don't have an account? 
            <router-link to="/register">Register here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../store/auth'
import { login } from '../helpers/api'

export default {
  name: 'Login',
  
  setup() {
    const router = useRouter()
    
    const form = ref({
      email: '',
      password: ''
    })
    
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const handleLogin = async () => {
      // Prevent multiple simultaneous login attempts
      if (isLoading.value) return
      
      errorMessage.value = ''
      isLoading.value = true
      
      try {
        // Attempt to authenticate user with provided credentials
        const response = await login(form.value.email, form.value.password)
        
        // Store user data and token in global auth store for session management
        authStore.setAuth(response.user, response.token)
        
        // Redirect user to home page after successful authentication
        router.push('/')
      } catch (error) {
        console.error('Login error:', error)
        errorMessage.value = 'Email or password is incorrect.'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      form,
      isLoading,
      handleLogin,
      errorMessage
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0B5772;
  box-shadow: 0 0 0 3px rgba(11, 87, 114, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #0B5772;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #063D63;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-links {
  text-align: center;
  margin-top: 20px;
}

.auth-links a {
  color: #0B5772;
  font-weight: 600;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  background: #fff0f0;
  border: 1px solid #f5c6cb;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 18px;
  text-align: center;
  font-weight: 600;
}
</style>