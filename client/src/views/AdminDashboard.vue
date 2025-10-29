<template>
  <div class="admin-dashboard">
    <!-- Admin Header -->
    <header class="admin-header">
      <div class="training-center-container">
        <div class="admin-header-content">
          <h1 class="admin-title">Admin Dashboard</h1>
          <div class="admin-actions">
            <span class="admin-welcome">Welcome, {{ user?.name }}</span>
            <button @click="logout" class="training-center-btn training-center-btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Admin Navigation -->
    <nav class="admin-nav">
      <div class="training-center-container">
        <ul class="admin-nav-list">
          <li 
            v-for="item in navItems" 
            :key="item.id"
            class="admin-nav-item"
            :class="{ active: activeTab === item.id }"
            @click="setActiveTab(item.id)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Admin Content -->
    <main class="admin-content">
      <div class="training-center-container">
        <!-- News Management -->
        <div v-if="activeTab === 'news'" class="admin-section">
          <div class="section-header">
            <h2>News Management</h2>
            <button @click="openNewsModal()" class="training-center-btn training-center-btn-primary">
              <span class="btn-icon">➕</span>
              Add News Article
            </button>
          </div>
          
          <div class="news-list">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading news articles...</p>
            </div>
            
            <div v-else-if="news.length === 0" class="empty-state">
              <p>No news articles found. Create your first article!</p>
            </div>
            
            <div v-else class="news-grid">
              <div 
                v-for="article in news" 
                :key="article._id"
                class="news-card"
                :class="{ featured: article.featured, unpublished: !article.published }"
              >
                <div class="news-image">
                  <img v-if="article.image?.url" :src="article.image.url" :alt="article.title">
                  <div v-else class="placeholder-image">📰</div>
                </div>
                <div class="news-content">
                  <div class="news-meta">
                    <span class="news-category">{{ article.category }}</span>
                    <span class="news-date">{{ formatDate(article.createdAt) }}</span>
                    <span v-if="article.featured" class="featured-badge">Featured</span>
                    <span v-if="!article.published" class="unpublished-badge">Draft</span>
                  </div>
                  <h3 class="news-title">{{ article.title }}</h3>
                  <p class="news-excerpt">{{ article.excerpt }}</p>
                  <div class="news-actions">
                    <button @click="openNewsModal(article)" class="btn-edit">Edit</button>
                    <button @click="deleteNews(article._id)" class="btn-delete">Delete</button>
                    <button @click="togglePublish(article)" class="btn-publish">
                      {{ article.published ? 'Unpublish' : 'Publish' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Management -->
        <div v-if="activeTab === 'courses'" class="admin-section">
          <div class="section-header">
            <h2>Course Management</h2>
            <router-link to="/courses/new" class="training-center-btn training-center-btn-primary">
              <span class="btn-icon">➕</span>
              Add New Course
            </router-link>
          </div>
          
          <div class="course-management-info">
            <div class="info-card">
              <h3>Course Management</h3>
              <p>Create, edit, and manage training courses from this admin panel.</p>
              <div class="quick-actions">
                <router-link to="/courses/new" class="action-btn primary">
                  <span class="btn-icon">📝</span>
                  Create New Course
                </router-link>
                <router-link to="/courses" class="action-btn secondary">
                  <span class="btn-icon">📚</span>
                  View All Courses
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div v-if="activeTab === 'stats'" class="admin-section">
          <h2>Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📰</div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalNews }}</span>
                <span class="stat-label">Total News Articles</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📄</div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.publishedNews }}</span>
                <span class="stat-label">Published Articles</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalAboutSections }}</span>
                <span class="stat-label">About Sections</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👁️</div>
              <div class="stat-content">
                <span class="stat-number">{{ stats.totalViews }}</span>
                <span class="stat-label">Total Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- News Modal -->
    <NewsModal 
      v-if="showNewsModal"
      :article="selectedNews"
      @close="closeNewsModal"
      @saved="handleNewsSaved"
    />

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../store/auth'
import { adminApi } from '../helpers/adminApi'
import NewsModal from '../components/admin/NewsModal.vue'

export default {
  name: 'AdminDashboard',
  components: {
    NewsModal
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('news')
    const loading = ref(false)
    const news = ref([])
    const showNewsModal = ref(false)
    const selectedNews = ref(null)

    const user = computed(() => authStore.user)

    const navItems = [
      { id: 'news', title: 'News Management', icon: '📰' },
      { id: 'courses', title: 'Course Management', icon: '📚' },
      { id: 'stats', title: 'Statistics', icon: '📊' }
    ]

    const stats = computed(() => ({
      totalNews: news.value.length,
      publishedNews: news.value.filter(article => article.published).length,
      totalViews: news.value.reduce((sum, article) => sum + (article.views || 0), 0)
    }))

    const setActiveTab = (tabId) => {
      activeTab.value = tabId
      if (tabId === 'news') {
        loadNews()
      }
    }

    const loadNews = async () => {
      loading.value = true
      try {
        const response = await adminApi.news.getAll()
        news.value = response.news
      } catch (error) {
        console.error('Error loading news:', error)
      } finally {
        loading.value = false
      }
    }

    const openNewsModal = (article = null) => {
      selectedNews.value = article
      showNewsModal.value = true
    }

    const closeNewsModal = () => {
      showNewsModal.value = false
      selectedNews.value = null
    }

    const handleNewsSaved = () => {
      loadNews()
      closeNewsModal()
    }

    const deleteNews = async (id) => {
      if (confirm('Are you sure you want to delete this news article?')) {
        try {
          await adminApi.news.delete(id)
          loadNews()
        } catch (error) {
          console.error('Error deleting news:', error)
        }
      }
    }

    const togglePublish = async (article) => {
      try {
        await adminApi.news.update(article._id, {
          ...article,
          published: !article.published
        })
        loadNews()
      } catch (error) {
        console.error('Error toggling publish status:', error)
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const truncateText = (text, length) => {
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    }

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    onMounted(() => {
      // Initialize auth store if needed
      if (!authStore.user && localStorage.getItem('user')) {
        authStore.init()
      }
      
      // Check authentication and admin role
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      if (!authStore.user || authStore.user.role !== 'admin') {
        router.push('/')
        alert('Access denied. Admin privileges required.')
        return
      }
      
      // Load initial data
      loadNews()
    })

    return {
      activeTab,
      loading,
      news,
      showNewsModal,
      selectedNews,
      user,
      navItems,
      stats,
      setActiveTab,
      openNewsModal,
      closeNewsModal,
      handleNewsSaved,
      deleteNews,
      togglePublish,
      formatDate,
      truncateText,
      logout
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--training-center-gray-lighter);
}

.admin-header {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  padding: var(--spacing-lg) 0;
  box-shadow: var(--shadow-medium);
}

.admin-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.admin-welcome {
  font-size: 1rem;
  opacity: 0.9;
}

.admin-nav {
  background: var(--training-center-white);
  border-bottom: 1px solid var(--training-center-gray-lighter);
  padding: 0;
}

.admin-nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  color: var(--training-center-gray-dark);
  font-weight: 500;
}

.admin-nav-item:hover {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-primary);
}

.admin-nav-item.active {
  color: var(--training-center-primary);
  border-bottom-color: var(--training-center-primary);
  background: var(--training-center-gray-lighter);
}

.nav-icon {
  font-size: 1.25rem;
}

.admin-content {
  padding: var(--spacing-xxxl) 0;
}

.admin-section {
  background: var(--training-center-white);
  border-radius: var(--border-radius);
  padding: var(--spacing-xxxl);
  box-shadow: var(--shadow-subtle);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--training-center-gray-lighter);
}

.section-header h2 {
  color: var(--training-center-primary);
  margin: 0;
  font-size: 1.75rem;
}

.btn-icon {
  margin-right: var(--spacing-xs);
}

.loading-state, .empty-state {
  text-align: center;
  padding: var(--spacing-xxxl);
  color: var(--training-center-gray-medium);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--training-center-gray-lighter);
  border-top: 4px solid var(--training-center-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.news-card {
  background: var(--training-center-white);
  border: 1px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-subtle);
}

.news-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
}

.news-card.featured {
  border-color: var(--training-center-primary);
  border-width: 2px;
}

.news-card.unpublished {
  opacity: 0.7;
  border-color: var(--training-center-warning);
}

.news-image {
  height: 200px;
  background: var(--training-center-gray-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 3rem;
  opacity: 0.3;
}

.news-content {
  padding: var(--spacing-lg);
}

.news-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-size: 0.85rem;
}

.news-category {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-weight: 500;
}

.news-date {
  color: var(--training-center-gray-medium);
}

.featured-badge {
  background: var(--training-center-success);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-weight: 500;
}

.unpublished-badge {
  background: var(--training-center-warning);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-weight: 500;
}

.news-title {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.1rem;
  line-height: 1.3;
}

.news-excerpt {
  color: var(--training-center-gray-dark);
  line-height: 1.5;
  margin-bottom: var(--spacing-lg);
  font-size: 0.95rem;
}

.news-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-edit, .btn-delete, .btn-publish {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: var(--training-center-primary);
  color: var(--training-center-white);
}

.btn-edit:hover {
  background: var(--training-center-primary-dark);
}

.btn-delete {
  background: var(--training-center-danger);
  color: var(--training-center-white);
}

.btn-delete:hover {
  background: #c82333;
}

.btn-publish {
  background: var(--training-center-success);
  color: var(--training-center-white);
}

.btn-publish:hover {
  background: #1e7e34;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-card {
  background: var(--training-center-white);
  border: 1px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-subtle);
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.section-card.unpublished {
  opacity: 0.7;
  border-color: var(--training-center-warning);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.section-title {
  color: var(--training-center-primary);
  margin: 0;
  font-size: 1.25rem;
}

.section-badges {
  display: flex;
  gap: var(--spacing-sm);
}

.section-type {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-gray-dark);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.section-preview {
  color: var(--training-center-gray-dark);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.section-meta {
  display: flex;
  gap: var(--spacing-lg);
  font-size: 0.85rem;
  color: var(--training-center-gray-medium);
  margin-bottom: var(--spacing-lg);
}

.section-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Course Management */
.course-management-info {
  margin-top: var(--spacing-lg);
}

.info-card {
  background: var(--training-center-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-subtle);
  border-left: 4px solid var(--training-center-primary);
}

.info-card h3 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-md);
}

.info-card p {
  color: var(--training-center-gray-medium);
  margin-bottom: var(--spacing-lg);
}

.quick-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: var(--training-center-primary);
  color: var(--training-center-white);
}

.action-btn.primary:hover {
  background: var(--training-center-primary-dark);
  color: var(--training-center-white);
  text-decoration: none;
}

.action-btn.secondary {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-gray-dark);
}

.action-btn.secondary:hover {
  background: var(--training-center-gray-medium);
  color: var(--training-center-white);
  text-decoration: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
}

.stat-card {
  background: var(--training-center-white);
  border: 2px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--training-center-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--training-center-gray-dark);
  font-weight: 500;
}

@media (max-width: 768px) {
  .admin-header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .admin-nav-list {
    flex-direction: column;
  }
  
  .admin-nav-item {
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .admin-content {
    padding: var(--spacing-lg) 0;
  }
  
  .admin-section {
    padding: var(--spacing-lg);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
