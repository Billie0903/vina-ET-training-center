<template>
  <div v-if="article" class="news-detail-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb-section">
      <div class="training-center-container">
        <nav class="breadcrumb">
          <router-link to="/news" class="breadcrumb-link">News</router-link>
          <span class="separator">/</span>
          <span class="current">{{ article.title }}</span>
        </nav>
      </div>
    </div>

    <!-- Article Header -->
    <section class="article-header">
      <div class="training-center-container">
        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
          <span class="article-category">{{ article.category }}</span>
          <span v-if="article.featured" class="featured-badge">Featured</span>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-excerpt">{{ article.excerpt }}</p>
        <div class="article-stats">
          <span class="views">{{ article.views }} views</span>
        </div>
      </div>
    </section>

    <!-- Article Image -->
    <section v-if="article.image?.url" class="article-image-section">
      <div class="training-center-container">
        <div class="article-image-container">
          <img 
            :src="article.image.url" 
            :alt="article.title"
            class="article-image"
            @error="handleImageError"
          >
        </div>
      </div>
    </section>

    <!-- Article Content -->
    <section class="article-content-section">
      <div class="training-center-container">
        <div class="article-content">
          <div v-html="formattedContent" class="content-body"></div>
        </div>
      </div>
    </section>


    <!-- Navigation -->
    <section class="article-navigation">
      <div class="training-center-container">
        <div class="nav-buttons">
          <router-link to="/news" class="back-btn">
            ← Back to News
          </router-link>
          <button @click="shareArticle" class="share-btn">
            Share Article
          </button>
        </div>
      </div>
    </section>

    <!-- Related Articles (if any) -->
    <section v-if="relatedArticles.length > 0" class="related-articles">
      <div class="training-center-container">
        <h2>Related Articles</h2>
        <div class="related-grid">
          <article 
            v-for="related in relatedArticles" 
            :key="related._id"
            class="related-article"
            @click.prevent="navigateToArticle(related.slug)"
          >
            <div class="related-image">
              <img v-if="related.image?.url" :src="related.image.url" :alt="related.title">
              <div v-else class="placeholder-image">📰</div>
            </div>
            <div class="related-content">
              <h3>{{ related.title }}</h3>
              <p>{{ related.excerpt }}</p>
              <span class="related-date">{{ formatDate(related.publishedAt || related.createdAt) }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
  
  <div v-else-if="loading" class="loading-page">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading article...</p>
    </div>
  </div>
  
  <div v-else class="error-page">
    <div class="error-content">
      <h1>Article Not Found</h1>
      <p>The article you're looking for doesn't exist or has been removed.</p>
      <router-link to="/news" class="back-btn">← Back to News</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { publicApi } from '../helpers/adminApi'

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const article = ref(null)
    const relatedArticles = ref([])
    const loading = ref(true)
    
    const fetchArticle = async () => {
      try {
        loading.value = true
        const slug = route.params.slug
        const response = await publicApi.news.getBySlug(slug)
        article.value = response
        
        // Fetch related articles (same category, excluding current)
        await fetchRelatedArticles()
      } catch (error) {
        console.error('Error fetching article:', error)
        article.value = null
      } finally {
        loading.value = false
      }
    }
    
    const fetchRelatedArticles = async () => {
      try {
        if (article.value && article.value.category) {
          const response = await publicApi.news.getAll({
            category: article.value.category,
            limit: 3
          })
          // Filter out current article
          relatedArticles.value = response.news.filter(
            related => related._id !== article.value._id
          ).slice(0, 3)
        }
      } catch (error) {
        console.error('Error fetching related articles:', error)
        relatedArticles.value = []
      }
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const formattedContent = computed(() => {
      if (!article.value || !article.value.content) return ''
      
      // Convert line breaks to HTML
      return article.value.content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
    })
    
    const handleImageError = (event) => {
      event.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
    
    const navigateToArticle = (slug) => {
      console.log('Navigating to article:', slug)
      // Force a page reload to ensure navigation works
      window.location.href = `/news/${slug}`
    }
    
    const shareArticle = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.value.title,
            text: article.value.excerpt,
            url: window.location.href
          })
        } catch (error) {
          console.log('Error sharing:', error)
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('Article link copied to clipboard!')
        } catch (error) {
          console.log('Error copying to clipboard:', error)
        }
      }
    }
    
    onMounted(() => {
      fetchArticle()
    })
    
    return {
      article,
      relatedArticles,
      loading,
      formattedContent,
      formatDate,
      handleImageError,
      navigateToArticle,
      shareArticle
    }
  }
}
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  background: var(--training-center-white);
}

.breadcrumb-section {
  background: var(--training-center-gray-lighter);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--training-center-gray-lighter);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  color: var(--training-center-gray-medium);
}

.breadcrumb-link {
  color: var(--training-center-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--training-center-primary-dark);
  text-decoration: underline;
}

.separator {
  color: var(--training-center-gray-medium);
}

.current {
  color: var(--training-center-gray-dark);
  font-weight: 600;
}

.article-header {
  padding: var(--spacing-xxxl) 0;
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
}

.article-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.article-date {
  color: rgba(255, 255, 255, 0.8);
}

.article-category {
  background: rgba(255, 255, 255, 0.2);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.featured-badge {
  background: var(--training-center-success);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
  color: var(--training-center-white);
}

.article-excerpt {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.article-stats {
  display: flex;
  gap: var(--spacing-lg);
  font-size: 0.9rem;
  opacity: 0.8;
}

.article-image-section {
  padding: var(--spacing-xxxl) 0;
  background: var(--training-center-gray-lighter);
}

.article-image-container {
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.article-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  display: block;
}

.article-content-section {
  padding: var(--spacing-xxxl) 0;
}

.article-content {
  max-width: 800px;
  margin: 0 auto;
}

.content-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--training-center-gray-dark);
}

.content-body h1,
.content-body h2,
.content-body h3,
.content-body h4,
.content-body h5,
.content-body h6 {
  color: var(--training-center-primary);
  margin: var(--spacing-xl) 0 var(--spacing-md) 0;
  font-weight: 600;
}

.content-body h1 { font-size: 2rem; }
.content-body h2 { font-size: 1.75rem; }
.content-body h3 { font-size: 1.5rem; }
.content-body h4 { font-size: 1.25rem; }

.content-body p {
  margin-bottom: var(--spacing-lg);
}

.content-body img {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  margin: var(--spacing-lg) 0;
  box-shadow: var(--shadow-subtle);
}

.content-body ul,
.content-body ol {
  margin: var(--spacing-lg) 0;
  padding-left: var(--spacing-xl);
}

.content-body li {
  margin-bottom: var(--spacing-sm);
}

.content-body blockquote {
  border-left: 4px solid var(--training-center-primary);
  padding-left: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
  font-style: italic;
  color: var(--training-center-gray-medium);
  background: var(--training-center-gray-lighter);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
}


.article-navigation {
  padding: var(--spacing-xl) 0;
  background: var(--training-center-white);
  border-top: 1px solid var(--training-center-gray-lighter);
}

.nav-buttons {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: var(--spacing-lg);
  justify-content: space-between;
  align-items: center;
}

.back-btn,
.share-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  text-decoration: none;
  font-weight: 600;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.back-btn {
  background: transparent;
  color: var(--training-center-primary);
  border: 2px solid var(--training-center-primary);
}

.back-btn:hover {
  background: var(--training-center-primary);
  color: var(--training-center-white);
}

.share-btn {
  background: var(--training-center-success);
  color: var(--training-center-white);
  border: 2px solid var(--training-center-success);
}

.share-btn:hover {
  background: var(--training-center-success-dark, #28a745);
  border-color: var(--training-center-success-dark, #28a745);
}

.related-articles {
  padding: var(--spacing-xxxl) 0;
  background: var(--training-center-gray-lighter);
}

.related-articles h2 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
  font-size: 2rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1000px;
  margin: 0 auto;
}

.related-article {
  background: var(--training-center-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-subtle);
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-article:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.related-image {
  height: 200px;
  background: var(--training-center-gray-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 3rem;
  opacity: 0.3;
}

.related-content {
  padding: var(--spacing-lg);
}

.related-content h3 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.1rem;
  line-height: 1.3;
}

.related-content p {
  color: var(--training-center-gray-dark);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
}

.related-date {
  color: var(--training-center-gray-medium);
  font-size: 0.8rem;
}

.loading-page,
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background: var(--training-center-gray-lighter);
}

.loading-spinner,
.error-content {
  text-align: center;
}

.spinner {
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

.error-content h1 {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 2rem;
}

.error-content p {
  color: var(--training-center-gray-medium);
  margin-bottom: var(--spacing-xl);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }
  
  .article-excerpt {
    font-size: 1.1rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .article-stats {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .nav-buttons {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .back-btn,
  .share-btn {
    width: 100%;
    justify-content: center;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .content-body {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .article-header {
    padding: var(--spacing-xl) 0;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
  
  .article-excerpt {
    font-size: 1rem;
  }
  
  .article-content-section {
    padding: var(--spacing-xl) 0;
  }
  
  .related-articles {
    padding: var(--spacing-xl) 0;
  }
}
</style>
