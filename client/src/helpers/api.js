import axios from 'axios'
import { authStore } from '../store/auth'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Show loading indicator
    if (typeof window !== 'undefined' && window.TrainingCenterAnimations) {
      const loader = document.querySelector('.loading-overlay')
      if (!loader) {
        document.body.appendChild(createLoader())
      }
    }
    
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    hideLoader()
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    hideLoader()
    return response.data
  },
  (error) => {
    hideLoader()
    if (error.response?.status === 401) {
      authStore.clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

function createLoader() {
  const loader = document.createElement('div')
  loader.className = 'loading-overlay'
  loader.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
  `
  return loader
}

function hideLoader() {
  const loader = document.querySelector('.loading-overlay')
  if (loader) {
    loader.style.opacity = '0'
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader)
      }
    }, 300)
  }
}

// Auth API methods
const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
}

// Course API methods
const courses = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`)
}

// Upload API methods
const upload = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteImage: (filename) => api.delete(`/upload/image/${filename}`)
}

// Export individual methods for backward compatibility
export const register = auth.register
export const login = auth.login
export const logout = auth.logout
export const getProfile = auth.getProfile
export const getCourses = courses.getAll
export const getCourse = courses.getById
export const createCourse = courses.create
export const updateCourse = courses.update
export const deleteCourse = courses.delete

// Export the main api instance and grouped methods
export { auth, courses, upload }
export default api