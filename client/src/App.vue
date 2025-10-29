<template>
  <div id="app">
    <!-- Training Center Navigation -->
    <nav class="training-center-nav">
      <div class="training-center-container">
        <div class="training-center-nav-container">
          <!-- Logo Section -->
          <router-link to="/" class="nav-brand" @click="closeMobileMenu">
            <img alt="Training Center Logo" src="./assets/Logo.jpg" class="training-center-logo" />
            <span class="brand-text">Vina E&T Training Center</span>
          </router-link>
          
          <!-- Main Navigation Menu -->
          <ul class="training-center-nav-menu" :class="{ 'nav-open': mobileMenuOpen }">
            <li>
              <router-link to="/" class="training-center-nav-item" @click="closeMobileMenu">
                <span>Home</span>
              </router-link>
            </li>
            <li>
              <router-link to="/courses" class="training-center-nav-item" @click="closeMobileMenu">
                <span>Courses</span>
              </router-link>
            </li>
            <li>
              <router-link to="/news" class="training-center-nav-item" @click="closeMobileMenu">
                <span>News</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="training-center-nav-item" @click="closeMobileMenu">
                <span>About Us</span>
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="training-center-nav-item" @click="closeMobileMenu">
                <span>Contact Us</span>
              </router-link>
            </li>
           
            <!-- Authenticated User Menu -->
            <template v-if="authStore.isAuthenticated">
              <li class="nav-user-menu">
                <div class="user-dropdown" @click="toggleUserDropdown">
                  <div class="user-avatar">
                    <span>{{ authStore.user.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <span class="user-name">{{ authStore.user.name }}</span>
                  <span class="chevron" :class="{ 'rotated': userDropdownOpen }">▼</span>
                </div>
                <div class="dropdown-menu" :class="{ 'show': userDropdownOpen }">
                  <a href="#" class="dropdown-item" @click="viewProfile">
                    <span>Profile</span>
                  </a>
                  <router-link v-if="authStore.user && authStore.user.role === 'admin'" to="/admin" class="dropdown-item" @click="userDropdownOpen = false">
                    <span>Admin Panel</span>
                  </router-link>
                  <a href="#" class="dropdown-item" @click="logout">
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

    <!-- Footer Section -->
    <footer class="site-footer">
      <div class="training-center-container">
        <div class="footer-content training-center-grid training-center-grid-3">
          <div class="footer-section slide-up">
            <h4>Vina E&T Training Center</h4>
            <p>Follow us on social media for the latest updates.</p>
            <div class="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                <i class="icon-facebook"></i>
              </a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" class="social-link" title="Zalo">
                <i class="icon-zalo"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-link" title="LinkedIn">
                <i class="icon-youtube"></i>
              </a>
            </div>
          </div>
          <div class="footer-section slide-up">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><router-link to="/" @click="closeMobileMenu">Home</router-link></li>
              <li><router-link to="/courses" @click="closeMobileMenu">Courses</router-link></li>
              <li><router-link to="/news" @click="closeMobileMenu">News</router-link></li>
              <li><router-link to="/about" @click="closeMobileMenu">About Us</router-link></li>
              <li><router-link to="/contact" @click="closeMobileMenu">Contact Us</router-link></li>
            </ul>
          </div>
          <div class="footer-section slide-up">
            <h4>Contact Info</h4>
            <div class="contact-info">
              <p><i class="icon-address"></i> No. 3 Thanh Nhan village, Thanh Xuan commune, Soc Son district, Hanoi, Hanoi, Vietnam</p>
              <p><i class="icon-contact"></i> +84 96 531 95 66</p>
              <p><i class="icon-email"></i> hhtnb@edu.vn</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Training Center. All rights reserved.</p>
        </div>
      </div>
    </footer>

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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from './store/auth'
import api from './helpers/api'
import { useToast } from 'vue-toastification'
export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const toast = useToast()
    // const { t } = useI18n()
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
    
    const currentYear = computed(() => new Date().getFullYear())
    
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
      currentYear,
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
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.nav-brand img,
.training-center-logo,
.brand-logo {
  width: 40px !important;
  height: 40px !important;
  max-width: 40px !important;
  max-height: 40px !important;
  object-fit: contain !important;
  display: block !important;
}

.nav-brand:hover {
  text-decoration: none;
  transform: scale(1.02);
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
  font-family: var(--training-center-font-secondary);
  font-weight: 900;
  font-size: 1.3rem;
  letter-spacing: 1px;
  white-space: nowrap;
  color: #222;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke: 0.5px #222;
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

.chevron {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.chevron.rotated {
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

/* Footer */
.site-footer {
  background: var(--training-center-gray-dark);
  color: var(--training-center-white);
  padding: var(--spacing-xxxl) 0 var(--spacing-lg);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.footer-section h4 {
  color: var(--training-center-white);
  margin-bottom: var(--spacing-lg);
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
}

.footer-section p {
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

.footer-section:first-child .social-links {
  justify-content: center;
}

.footer-section:first-child p {
  text-align: center;
}

.footer-section:last-child h4 {
  text-align: left;
}

.footer-section:last-child p {
  text-align: left;
}

.footer-links {
  list-style: none;
  padding: 0;
  text-align: center;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1.05rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--training-center-white);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.social-link {
  width: 55px;
  height: 55px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--training-center-white);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--training-center-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Social Media Icons */
.icon-facebook {
  width: 28px;
  height: 28px;
  background-image: url('./assets/icons/social/facebook.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-zalo {
  width: 28px;
  height: 28px;
  background-image: url('./assets/icons/social/zalo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.icon-youtube {
  width: 28px;
  height: 28px;
  background-image: url('./assets/icons/social/youtube.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Contact Info Icons */
.icon-address {
  width: 50px;
  height: 50px;
  background-image: url('./assets/icons/address.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  margin-right: var(--spacing-sm);
  filter: brightness(0) invert(1);
}

.icon-contact {
  width: 25px;
  height: 25px;
  background-image: url('./assets/icons/contact.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  margin-right: var(--spacing-sm);
  filter: brightness(0) invert(1);
}

.icon-email {
  width: 25px;
  height: 25px;
  background-image: url('./assets/icons/email.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  margin-right: var(--spacing-sm);
  filter: brightness(0) invert(1);
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-info p {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
  line-height: 1.6;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
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


/* Responsive Design */
@media (max-width: 1024px) {
  .training-center-nav-menu {
    gap: var(--spacing-sm);
  }
  
  .training-center-nav-item {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
  
  .training-center-nav-container {
    position: relative;
  }
  
  .training-center-nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--training-center-white);
    border: 1px solid var(--training-center-gray-lighter);
    border-radius: var(--border-radius);
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    box-shadow: var(--shadow-medium);
    z-index: 1000;
    max-height: 0;
    overflow: hidden;
    margin-top: var(--spacing-sm);
  }
  
  .training-center-nav-menu.nav-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    max-height: 600px;
    overflow: visible;
  }

  .training-center-nav-menu li {
    width: 100%;
    border-bottom: 1px solid var(--training-center-gray-lighter);
  }

  .training-center-nav-menu li:last-child {
    border-bottom: none;
  }

  .training-center-nav-item,
  .training-center-btn {
    width: 100%;
    text-align: left;
    justify-content: flex-start;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: 0;
    display: block;
  }
  
  .user-dropdown {
    justify-content: flex-start;
    padding: var(--spacing-md) var(--spacing-lg);
    width: 100%;
  }
  
  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    border-top: 1px solid var(--training-center-gray-lighter);
    background: var(--training-center-gray-lighter);
    margin: 0;
    border-radius: 0;
    width: 100%;
  }
  
  .nav-brand .brand-text {
    display: none;
  }
  
  /* Footer responsive */
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .training-center-container {
    padding: 0 var(--spacing-md);
  }

  .training-center-logo {
    width: 40px !important;
    height: 40px !important;
    max-width: 40px !important;
    max-height: 40px !important;
  }
  
  .training-center-nav-item,
  .training-center-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 0.9rem;
  }
  
  .user-dropdown {
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .mobile-menu-toggle {
    width: 25px;
    height: 25px;
  }
}
</style>