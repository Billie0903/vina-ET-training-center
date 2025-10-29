<template>
  <div class="news-page">
    <!-- Hero Section -->
    <section class="news-hero">
      <div class="training-center-container">
        <h1 class="news-hero-title">News & Updates</h1>
        <p class="news-hero-subtitle">
          Stay updated with the latest news and announcements from Vina E&T Training Center
        </p>
      </div>
    </section>

    <!-- News Content -->
    <section class="news-content">
      <div class="training-center-container">
        <!-- Filters -->
        <div class="news-filters">
          <div class="filter-group">
            <label>Category:</label>
            <select v-model="selectedCategory" @change="filterByCategory(selectedCategory)" class="filter-select">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="checkbox-label">
              <input v-model="showFeatured" @change="toggleFeatured" type="checkbox" class="checkbox-input">
              <span>Featured Only</span>
            </label>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading news articles...</p>
        </div>

        <!-- News Grid -->
        <div v-else-if="news.length > 0" class="news-grid">
          <!-- Featured News -->
          <article v-if="featuredNews" class="news-article featured" @click="navigateToArticle(featuredNews.slug)">
            <div class="article-image">
              <img v-if="featuredNews.image?.url" :src="featuredNews.image.url" :alt="featuredNews.title">
              <div v-else class="placeholder-image">📰</div>
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span class="article-date">{{ formatDate(featuredNews.publishedAt || featuredNews.createdAt) }}</span>
                <span class="article-category">{{ featuredNews.category }}</span>
                <span class="featured-badge">Featured</span>
              </div>
              <h2 class="article-title">{{ featuredNews.title }}</h2>
              <p class="article-excerpt">{{ featuredNews.excerpt }}</p>
              <router-link :to="`/news/${featuredNews.slug}`" class="read-more" @click.stop>Read More →</router-link>
            </div>
          </article>

          <!-- Regular News Articles -->
          <article 
            v-for="article in regularNews" 
            :key="article._id"
            class="news-article"
          >
            <div class="article-image">
              <img v-if="article.image?.url" :src="article.image.url" :alt="article.title">
              <div v-else class="placeholder-image">📰</div>
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span class="article-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                <span class="article-category">{{ article.category }}</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <router-link :to="`/news/${article.slug}`" class="read-more">Read More →</router-link>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>No news articles found.</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            :class="{ active: currentPage === page }"
            class="page-btn"
          >
            {{ page }}
          </button>
        </div>

        <!-- Newsletter Signup -->
        <div class="newsletter-section">
          <div class="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive the latest news and updates directly in your inbox.</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Enter your email address" required>
              <button type="submit" class="training-center-btn training-center-btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { publicApi } from '../helpers/adminApi'

export default {
  name: 'News',
  setup() {
    const router = useRouter()
    const news = ref([])
    const loading = ref(true)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const selectedCategory = ref('')
    const showFeatured = ref(false)

    const categories = [
      'All',
      'Announcement',
      'Achievement', 
      'Partnership',
      'Award',
      'Course Update',
      'Student Success',
      'General'
    ]

    const featuredNews = computed(() => {
      return news.value.find(article => article.featured) || news.value[0]
    })

    const regularNews = computed(() => {
      return news.value.filter(article => !article.featured)
    })

    const loadNews = async () => {
      try {
        loading.value = true
        const params = {
          page: currentPage.value,
          limit: 10
        }
        
        if (selectedCategory.value && selectedCategory.value !== 'All') {
          params.category = selectedCategory.value
        }
        
        if (showFeatured.value) {
          params.featured = 'true'
        }

        const response = await publicApi.news.getAll(params)
        news.value = response.news
        totalPages.value = response.totalPages
      } catch (error) {
        console.error('Error loading news:', error)
        // Fallback to static content if API fails
        news.value = []
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const filterByCategory = (category) => {
      selectedCategory.value = category
      currentPage.value = 1
      loadNews()
    }

    const toggleFeatured = () => {
      currentPage.value = 1
      loadNews()
    }

    const goToPage = (page) => {
      currentPage.value = page
      loadNews()
    }

    const navigateToArticle = (slug) => {
      router.push(`/news/${slug}`)
    }

    onMounted(() => {
      loadNews()
    })

    return {
      news,
      loading,
      currentPage,
      totalPages,
      selectedCategory,
      showFeatured,
      categories,
      featuredNews,
      regularNews,
      loadNews,
      formatDate,
      filterByCategory,
      toggleFeatured,
      goToPage,
      navigateToArticle
    }
  }
}
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  background: var(--training-center-white);
}

.news-hero {
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
  padding: var(--spacing-xxxl) 0;
  text-align: center;
}

.news-hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--training-center-white);
}

.news-hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.news-content {
  padding: var(--spacing-xxxl) 0;
}

.news-filters {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-group label {
  font-weight: 600;
  color: var(--training-center-gray-dark);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  background: var(--training-center-white);
  font-family: var(--training-center-font-secondary);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-weight: 500;
  color: var(--training-center-gray-dark);
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: var(--training-center-primary);
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

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-badge {
  background: var(--training-center-success);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

.page-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--training-center-gray-lighter);
  background: var(--training-center-white);
  color: var(--training-center-gray-dark);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.page-btn:hover {
  border-color: var(--training-center-primary);
  color: var(--training-center-primary);
}

.page-btn.active {
  background: var(--training-center-primary);
  border-color: var(--training-center-primary);
  color: var(--training-center-white);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxxl);
}

.news-article {
  background: var(--training-center-white);
  border: 1px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-subtle);
}

.news-article:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.news-article.featured {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.article-image {
  height: 200px;
  background: var(--training-center-gray-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.news-article.featured .article-image {
  height: 100%;
}

.placeholder-image {
  font-size: 4rem;
  opacity: 0.3;
}

.article-content {
  padding: var(--spacing-xl);
}

.article-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
}

.article-date {
  color: var(--training-center-gray-medium);
}

.article-category {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-title {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
  line-height: 1.3;
}

.news-article.featured .article-title {
  font-size: 1.5rem;
}

.article-excerpt {
  color: var(--training-center-gray-dark);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.read-more {
  color: var(--training-center-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: var(--training-center-primary-dark);
  text-decoration: underline;
}

.newsletter-section {
  background: var(--training-center-gray-lighter);
  padding: var(--spacing-xxxl);
  border-radius: var(--border-radius);
  text-align: center;
}

.newsletter-content h2 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-md);
  font-size: 2rem;
}

.newsletter-content p {
  color: var(--training-center-gray-medium);
  margin-bottom: var(--spacing-xl);
  font-size: 1.1rem;
}

.newsletter-form {
  display: flex;
  gap: var(--spacing-md);
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  font-family: var(--training-center-font-secondary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--training-center-primary);
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .news-article.featured {
    grid-column: span 1;
    grid-template-columns: 1fr;
  }
  
  .news-article.featured .article-image {
    height: 200px;
  }
  
  .news-hero-title {
    font-size: 2.25rem;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-content h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .news-hero {
    padding: var(--spacing-xl) 0;
  }
  
  .news-hero-title {
    font-size: 1.875rem;
  }
  
  .news-hero-subtitle {
    font-size: 1rem;
  }
  
  .news-content {
    padding: var(--spacing-xl) 0;
  }
  
  .article-content {
    padding: var(--spacing-lg);
  }
  
  .newsletter-section {
    padding: var(--spacing-xl);
  }
}
</style>
