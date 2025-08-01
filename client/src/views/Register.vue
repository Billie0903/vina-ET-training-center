<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <h2>Create Account</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name"
              v-model="form.name" 
              class="form-input"
              required
            >
          </div>
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
              minlength="6"
              required
            >
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select 
              id="role"
              v-model="form.role" 
              class="form-input"
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
        </form>
        <div class="auth-links">
          <p>Already have an account? 
            <router-link to="/login">Sign In</router-link>
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
import { useToast } from 'vue-toastification'
import { register } from '../helpers/api'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    const form = ref({
      name: '',
      email: '',
      password: '',
      role: 'student'
    })
    
    const isLoading = ref(false)
    
    const handleRegister = async () => {
      if (isLoading.value) return
      
      isLoading.value = true
      
      try {
        const response = await register(form.value)
        authStore.setAuth(response.user, response.token)
        toast.success('Account created successfully!')
        router.push('/courses')
      } catch (error) {
        console.error('Registration error:', error)
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      form,
      isLoading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-card h2 {
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
</style>