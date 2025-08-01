<template>
  <div id="app">
    <!-- Training Center Navigation -->
    <nav class="training-center-nav">
      <div class="training-center-container">
        <div class="training-center-nav-container">
          <!-- Logo Section -->
          <div class="nav-brand">
            <img alt="Training Center Logo" src="./assets/Logo.jpg" class="training-center-logo" />
            <span class="brand-text">Vina E&T Training Center</span>
          </div>
          
          <!-- Main Navigation Menu -->
          <ul class="training-center-nav-menu" :class="{ 'nav-open': mobileMenuOpen }">
            <li>
              <router-link to="/" class="training-center-nav-item" @click="closeMobileMenu">
                <i class="icon-home"></i>
                <span>Home</span>
              </router-link>
            </li>
            <li>
              <router-link to="/courses" class="training-center-nav-item" @click="closeMobileMenu">
                <i class="icon-list"></i>
                <span>Courses</span>
              </router-link>
            </li>
            
            <!-- Authenticated User Menu -->
            <template v-if="authStore.isAuthenticated">
              <li v-if="authStore.user && authStore.user.role === 'admin'">
                <router-link to="/courses/new" class="training-center-nav-item" @click="closeMobileMenu" >
                  <i class="icon-plus" ></i>
                  <span>New Course</span>
                </router-link>
              </li>
              <li class="nav-user-menu">
                <div class="user-dropdown" @click="toggleUserDropdown">
                  <div class="user-avatar">
                    <i class="icon-user"></i>
                  </div>
                  <span class="user-name">{{ authStore.user.name }}</span>
                  <i class="icon-chevron-down" :class="{ 'rotated': userDropdownOpen }"></i>
                </div>
                <div class="dropdown-menu" :class="{ 'show': userDropdownOpen }">
                  <a href="#" class="dropdown-item" @click="viewProfile">
                    <i class="icon-user"></i>
                    <span>Profile</span>
                  </a>
                  <a href="#" class="dropdown-item" @click="logout">
                    <i class="icon-logout"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </li>
            </template>
            
            <!-- Guest Menu -->
            <template v-else>
              <li>
                <router-link to="/login" class="training-center-btn training-center-btn-outline" @click="closeMobileMenu">
                  Login
                </router-link>
              </li>
              <li>
                <router-link to="/register" class="training-center-btn training-center-btn-primary" @click="closeMobileMenu">
                  Register
                </router-link>
              </li>
            </template>
          </ul>
          
          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ 'active': mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Toast Notifications Container -->
    <div id="toast-container"></div>
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { authStore } from './store/auth'
import api from './helpers/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'App',
  setup() {
    const toast = useToast()
    const mobileMenuOpen = ref(false)
    const userDropdownOpen = ref(false)
    const isLoading = ref(false)
    
    // Handle mobile menu
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }
    
    // Handle user dropdown
    const toggleUserDropdown = () => {
      userDropdownOpen.value = !userDropdownOpen.value
    }
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        userDropdownOpen.value = false
      }
      if (!event.target.closest('.training-center-nav-container')) {
        mobileMenuOpen.value = false
      }
    }
    
    // Navigation actions
    const logout = async () => {
      isLoading.value = true
      try {
        await api.logout()
        authStore.clearAuth()
        toast.success('Logged out successfully')
        window.location.href = '/'
      } catch (error) {
        console.error('Logout error:', error)
        authStore.clearAuth()
        toast.error('Logout failed, but session cleared')
        window.location.href = '/'
      } finally {
        isLoading.value = false
        userDropdownOpen.value = false
      }
    }
    
    const viewProfile = () => {
      // Implement profile navigation
      toast.info('Profile feature coming soon!')
      userDropdownOpen.value = false
    }
    
    // Setup event listeners
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      
      // Initialize Training Center animations
      if (typeof TrainingCenterAnimations !== 'undefined') {
        new TrainingCenterAnimations()
      }
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      authStore,
      mobileMenuOpen,
      userDropdownOpen,
      isLoading,
      toggleMobileMenu,
      closeMobileMenu,
      toggleUserDropdown,
      logout,
      viewProfile
    }
  }
}
</script>

<style>
/* Import Training Center Base Styles */
@import url('./styles/training-center-base.css');

/* Brand Styling */
.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 700;
  color: var(--training-center-gray-dark);
}

.brand-text {
  font-family: var(--training-center-font-primary);
  font-size: 1.25rem;
  color: var(--training-center-primary);
}

/* Navigation Item Icons */
.training-center-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.training-center-nav-item:hover {
  background-color: var(--training-center-gray-lighter);
  text-decoration: none;
}

.training-center-nav-item.router-link-active {
  color: var(--training-center-primary);
  background-color: rgba(165, 28, 48, 0.1);
}

/* User Dropdown */
.nav-user-menu {
  position: relative;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.user-dropdown:hover {
  background-color: var(--training-center-gray-lighter);
}

.user-avatar {
  width: 35px;
  height: 35px;
  background: var(--training-center-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-name {
  font-weight: 500;
  color: var(--training-center-gray-dark);
}

.icon-chevron-down {
  transition: transform 0.3s ease;
}

.icon-chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--training-center-white);
  border: 1px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  color: var(--training-center-gray-dark);
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: var(--training-center-gray-lighter);
  text-decoration: none;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  width: 30px;
  height: 30px;
  justify-content: space-between;
}

.mobile-menu-toggle span {
  width: 100%;
  height: 2px;
  background: var(--training-center-gray-dark);
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-toggle.active span:first-child {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:last-child {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Main Content */
.main-content {
  min-height: calc(100vh - var(--header-height));
  padding-top: 0;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--training-center-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: 0.33s;
  border-top-color: var(--training-center-primary-dark);
}

.spinner-ring:nth-child(3) {
  animation-delay: 0.66s;
  border-top-color: var(--training-center-gray-medium);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Icon Font (Simple CSS Icons) */
[class^="icon-"]::before {
  font-family: 'Font Awesome', sans-serif;
  font-weight: 900;
  display: inline-block;
}

.icon-home::before { content: "🏠"; }
.icon-list::before { content: "📋"; }
.icon-plus::before { content: "➕"; }
.icon-user::before { content: "👤"; }
.icon-logout::before { content: "🚪"; }
.icon-chevron-down::before { content: "⌄"; }

/* Responsive Design */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
  
  .training-center-nav-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--training-center-white);
  border-top: 1px solid var(--training-center-gray-lighter);
  flex-direction: column;
  align-items: stretch;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-medium);
}
  
  .training-center-nav-menu.nav-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.training-center-nav-menu li {
  width: 100%;
}

.training-center-nav-item,
.training-center-btn {
  width: 100%;
  text-align: left;
  justify-content: flex-start;
}
  
  .user-dropdown {
    justify-content: flex-start;
  }
  
  .dropdown-menu {
  position: static;
  box-shadow: none;
  border: none;
  border-top: 1px solid var(--training-center-gray-lighter);
  background: var(--training-center-gray-lighter);
}
  
  .nav-brand .brand-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .training-center-container {
  padding: 0 var(--spacing-md);
}
  
  .training-center-logo {
  height: 40px;
}
}
</style>