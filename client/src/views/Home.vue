<template>
  <div class="home-page">
    <!-- Training Center Hero Section -->
    <section class="training-center-hero parallax-container">
      <div class="hero-background">
        <div 
          v-for="(image, index) in backgroundImages" 
          :key="index"
          class="hero-bg-image"
          :class="{ active: currentBgImage === index }"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
        <div class="hero-overlay"></div>
      </div>
      <div class="parallax-bg" data-speed="0.3"></div>
      <div class="training-center-container">
        <div class="hero-content text-center">
          <h1 class="training-center-hero-title fade-in">
            Excellence in Education
          </h1>
          <p class="training-center-hero-subtitle slide-up">
            Discover transformative learning experiences that empower minds and shape futures through world-class instruction and innovative pedagogy.
          </p>
          <div class="hero-actions slide-up">
            <router-link to="/courses" class="training-center-btn training-center-btn-primary training-center-btn-large hover-lift">
              Explore Courses
            </router-link>
            <router-link to="/register" class="training-center-btn training-center-btn-outline training-center-btn-large hover-lift" v-if="!authStore.isAuthenticated">
              Join Our Community
            </router-link>
          </div>
          
          <!-- Statistics Section -->
          <div class="hero-stats slide-up">
            <div class="stat-item">
              <div class="stat-number animate-number">{{ stats.totalCourses }}</div>
              <div class="stat-label">Courses Available</div>
            </div>
            <div class="stat-item">
              <div class="stat-number animate-number">{{ stats.totalStudents }}</div>
              <div class="stat-label">Students Enrolled</div>
            </div>
            <div class="stat-item">
              <div class="stat-number animate-number">{{ stats.totalInstructors }}</div>
              <div class="stat-label">Expert Instructors</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Excellence Section -->
    <section class="training-center-section academic-excellence">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Academic Excellence</h2>
          <p class="section-description slide-up">
            Our commitment to educational excellence drives everything we do, from curriculum design to student support.
          </p>
        </div>
        
        <div class="training-center-grid training-center-grid-3">
          <div class="training-center-feature slide-left" v-for="(feature, index) in academicFeatures" :key="index">
            <h3 class="training-center-feature-title">{{ feature.title }}</h3>
            <p class="training-center-feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses Section -->
    <section class="training-center-section featured-courses" v-if="featuredCourses.length > 0">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Featured Courses</h2>
          <p class="section-description slide-up">
            Explore our most popular and impactful courses, designed by industry experts and academic leaders.
          </p>
        </div>
        
        <div class="training-center-grid training-center-grid-3">
          <div class="course-card training-center-card hover-lift slide-up" 
               v-for="(course, index) in featuredCourses" 
               :key="course._id"
               :style="{ 
                 animationDelay: `${index * 200}ms`,
                 backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'})`
               }">
            <div class="course-header">
              <div class="course-category">{{ course.category }}</div>
              <div class="course-price">${{ course.price }}</div>
            </div>
            <h3 class="training-center-card-title">{{ course.title }}</h3>
            <div class="training-center-card-meta">
              <span class="instructor">by {{ course.instructor }}</span>
              <br>
              <span class="duration">{{ formatDuration(course.duration) }}</span>
            </div>
            <p class="training-center-card-content">
              {{ truncateDescription(course.description, 120) }}
            </p>
            <div class="course-meta">
              <div class="course-info">
                <span class="start-date">
                  {{ formatDate(course.startDate) }}
                </span>
                <span class="max-students">
                  {{ course.maxStudents }} seats
                </span>
              </div>
            </div>
            <div class="card-actions">
              <router-link :to="'/courses/show/' + course._id" class="training-center-btn training-center-btn-primary">
                View Details
              </router-link>
              <button class="training-center-btn training-center-btn-outline" @click="addToWishlist(course)">
                Save
              </button>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-xl">
          <router-link to="/courses" class="training-center-btn training-center-btn-outline training-center-btn-large">
            View All Courses
          </router-link>
        </div>
      </div>
    </section>

    <!-- Learning Approach Section -->
    <section class="training-center-section learning-approach">
      <div class="training-center-container">
        <div class="training-center-grid training-center-grid-2">
          <div class="approach-content slide-left">
            <h2>Our Learning Approach</h2>
            <p class="mb-md">
              We believe in transformative education that goes beyond traditional boundaries. Our pedagogical approach combines rigorous academic standards with practical application.
            </p>
            <ul class="approach-list">
              <li class="approach-item" v-for="item in learningApproach" :key="item.title">
                <div class="approach-text">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="approach-visual slide-right">
                          <div class="visual-element">
                <!-- Professional classroom image -->
                <img src="https://extension.harvard.edu/wp-content/uploads/sites/8/2021/03/male-harvard-extension-student.jpg" class="learning-approach-image">
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Research & Innovation Section -->
    <section class="training-center-section research-innovation">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Research & Innovation</h2>
          <p class="section-description slide-up">
            At the forefront of educational research, we continuously evolve our methods to provide cutting-edge learning experiences.
          </p>
        </div>
        
        <div class="research-highlights">
          <div
            class="research-item slide-up"
            v-for="(item, index) in researchHighlights"
            :key="index"
            :class="{ 'reverse-row': item.title === 'AI-Enhanced Learning' }"
          >
            <div class="research-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <a href="#" class="research-link">Learn More</a>
            </div>
            <img :src="item.image" :alt="item.title + ' image'" class="research-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="training-center-section latest-news">
      <div class="training-center-container">
        <div class="section-header text-center mb-xl">
          <h2 class="slide-up">Latest News</h2>
          <p class="section-description slide-up">
            Stay updated with the latest announcements, achievements, and insights from our training center.
          </p>
        </div>
        
        <div class="news-slider-container">
          <div class="news-slider" ref="newsSlider">
            <div 
              v-for="(article, index) in featuredNews" 
              :key="article._id"
              class="news-slide"
              :class="{ active: currentSlide === index }"
              v-show="currentSlide === index"
            >
              <div class="news-slide-content">
                <div class="news-image">
                  <img v-if="article.image?.url" :src="article.image.url" :alt="article.title">
                  <div v-else class="placeholder-image">📰</div>
                </div>
                <div class="news-text">
                  <div class="news-meta">
                    <span class="news-category">{{ article.category }}</span>
                    <span class="news-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                    <span v-if="article.featured" class="featured-badge">Featured</span>
                  </div>
                  <h3 class="news-title">{{ article.title }}</h3>
                  <p class="news-excerpt">{{ article.excerpt }}</p>
                  <router-link :to="`/news/${article.slug}`" class="news-read-more">
                    Read More →
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation Dots -->
          <div class="slider-dots">
            <button 
              v-for="(article, index) in featuredNews" 
              :key="index"
              class="dot"
              :class="{ active: currentSlide === index }"
              @click="goToSlide(index)"
            ></button>
          </div>
          
        </div>
        
        <div class="text-center mt-xl">
          <router-link to="/news" class="training-center-btn training-center-btn-outline training-center-btn-large">
            View All News
          </router-link>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="training-center-section cta-section">
      <div class="training-center-container">
        <div class="cta-content text-center">
          <h2 class="slide-up">Ready to Begin Your Journey?</h2>
          <p class="cta-description slide-up">
            Join thousands of learners who have transformed their careers and expanded their knowledge through our comprehensive programs.
          </p>
          <div class="cta-actions slide-up">
            <router-link to="/register" class="training-center-btn training-center-btn-primary training-center-btn-large" v-if="!authStore.isAuthenticated">
              Get Started Today
            </router-link>
            <router-link to="/courses" class="training-center-btn training-center-btn-outline training-center-btn-large">
              Browse Courses
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { getCourses } from '../helpers/api'
import { publicApi } from '../helpers/adminApi'
import { authStore } from '../store/auth'
import { useToast } from 'vue-toastification'

// Import background images dynamically using webpack's require.context
// This will automatically detect all images in the bg-carousel folder
function getBackgroundImages() {
  const images = []
  
  try {
    // Use webpack's require.context to dynamically import all images
    const requireContext = require.context('../assets/bg-carousel', false, /\.(jpg|jpeg|png|webp)$/i)
    
    // Get all image paths
    requireContext.keys().forEach((item) => {
      images.push(requireContext(item))
    })
  } catch (error) {
    console.warn('Error loading carousel images:', error)
  }
  
  // Fallback to default image if no carousel images found
  if (images.length === 0) {
    try {
      const defaultImage = require('../assets/hero-background.jpg')
      images.push(defaultImage)
    } catch (error) {
      console.warn('Default image not found')
    }
  }
  
  return images
}

export default {
  name: 'Home',
  setup() {
    const toast = useToast()
    const featuredCourses = ref([])
    const featuredNews = ref([])
    const currentSlide = ref(0)
    const autoSlideInterval = ref(null)
    const bgCarouselInterval = ref(null)
    const newsSlider = ref(null)
    
    // Background carousel
    const backgroundImages = ref(getBackgroundImages())
    const currentBgImage = ref(0)
    const stats = ref({
      totalCourses: 0,
      totalStudents: 2400,
      totalInstructors: 48
    })
    
    const academicFeatures = ref([
      {
        title: 'Expert Faculty',
        description: 'Learn from distinguished professors and industry leaders with decades of experience in their respective fields.'
      },
      {
        title: 'Innovative Curriculum',
        description: 'Our cutting-edge curriculum is designed to meet current industry demands and future challenges.'
      },
      {
        title: 'Global Perspective',
        description: 'Gain international insights and connect with learners from around the world in our diverse community.'
      }
    ])
    
    const learningApproach = ref([
      {
        title: 'Rigorous Academics',
        description: 'Comprehensive theoretical foundation combined with practical application.'
      },
      {
        title: 'Collaborative Learning',
        description: 'Engage with peers through group projects and interactive discussions.'
      },
      {
        title: 'Data-Driven Insights',
        description: 'Track your progress with detailed analytics and personalized feedback.'
      },
      {
        title: 'Industry Recognition',
        description: 'Earn certificates that are recognized by leading employers worldwide.'
      }
    ])
    
    const researchHighlights = ref([
      {
        title: 'Pedagogical Research',
        description: 'Advancing the science of learning through innovative research initiatives. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur sed ipsum quis aliquam. Integer lobortis risus ac enim auctor rutrum. Nullam suscipit odio non felis sollicitudin dictum. Sed nec purus eu magna hendrerit tempor. Duis maximus turpis ut arcu sodales ultricies. Donec et justo auctor, commodo magna sit amet, tempor magna. Nam sit amet bibendum dolor, ut aliquet sem. Sed a mi orci. Aenean hendrerit fermentum quam et convallis. Aliquam lorem odio, consectetur et tristique vel, hendrerit sit amet elit. Phasellus interdum nisi et ex laoreet, vitae rhoncus mauris sodales. Donec sit amet convallis eros. Donec magna augue, ullamcorper nec metus a, mattis vulputate purus.',
        image: 'https://www.eng.mcmaster.ca//app/uploads/2025/02/Students-in-Eng-Phys-LAb-1-1600x790.jpg',
      },
      {
        title: 'AI-Enhanced Learning',
        description: 'Utilizing artificial intelligence to personalize and optimize learning experiences. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur sed ipsum quis aliquam. Integer lobortis risus ac enim auctor rutrum. Nullam suscipit odio non felis sollicitudin dictum. Sed nec purus eu magna hendrerit tempor. Duis maximus turpis ut arcu sodales ultricies. Donec et justo auctor, commodo magna sit amet, tempor magna. Nam sit amet bibendum dolor, ut aliquet sem. Sed a mi orci. Aenean hendrerit fermentum quam et convallis. Aliquam lorem odio, consectetur et tristique vel, hendrerit sit amet elit. Phasellus interdum nisi et ex laoreet, vitae rhoncus mauris sodales. Donec sit amet convallis eros. Donec magna augue, ullamcorper nec metus a, mattis vulputate purus.',
        image: 'https://cdn.standardmedia.co.ke/images/wysiwyg/images/Za4ythzrgGLcFtyrw9L0DmMYUJrPrWSRBKL5Cz6k.jpg'
      },
    ])
    
    const currentYear = computed(() => new Date().getFullYear())
    
    const fetchFeaturedCourses = async () => {
      try {
        const allCourses = await getCourses()
        featuredCourses.value = allCourses.slice(0, 3)
        // Update the total courses count with actual data
        stats.value.totalCourses = allCourses.length
      } catch (error) {
        console.error('Error fetching featured courses:', error)
        toast.error('Failed to load featured courses')
      }
    }

    const fetchFeaturedNews = async () => {
      try {
        const response = await publicApi.news.getAll({ limit: 5 })
        featuredNews.value = response.news
      } catch (error) {
        console.error('Error fetching featured news:', error)
        // Don't show error toast for news as it's not critical
      }
    }

    const nextSlide = () => {
      if (featuredNews.value.length === 0) return
      currentSlide.value = (currentSlide.value + 1) % featuredNews.value.length
    }

    const goToSlide = (index) => {
      currentSlide.value = index
    }

    const startAutoSlide = () => {
      if (featuredNews.value.length <= 1) return
      autoSlideInterval.value = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    const stopAutoSlide = () => {
      if (autoSlideInterval.value) {
        clearInterval(autoSlideInterval.value)
        autoSlideInterval.value = null
      }
    }
    
    // Background carousel functions
    const nextBackgroundImage = () => {
      if (backgroundImages.value.length > 1) {
        currentBgImage.value = (currentBgImage.value + 1) % backgroundImages.value.length
      }
    }
    
    const startBackgroundCarousel = () => {
      if (backgroundImages.value.length > 1) {
        bgCarouselInterval.value = setInterval(() => {
          nextBackgroundImage()
        }, 8000) // Change image every 8 seconds
      }
    }
    
    const stopBackgroundCarousel = () => {
      if (bgCarouselInterval.value) {
        clearInterval(bgCarouselInterval.value)
        bgCarouselInterval.value = null
      }
    }
    
    const truncateDescription = (description, maxLength) => {
      if (description.length <= maxLength) return description
      return description.substring(0, maxLength) + '...'
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    const addToWishlist = (course) => {
      // Placeholder for wishlist functionality
      toast.success(`${course.title} added to wishlist`)
    }

    function formatDuration(duration) {
      if (!duration) return ''
      // Expecting format: '3 week', '1 year', etc.
      const match = duration.match(/(\d+)\s*(\w+)/)
      if (!match) return duration
      const num = parseInt(match[1])
      let unit = match[2].toLowerCase()
      // Normalize unit
      if (unit.endsWith('s')) unit = unit.slice(0, -1)
      let displayUnit = unit
      if (num > 1) {
        if (unit === 'day') displayUnit = 'days'
        else if (unit === 'week') displayUnit = 'weeks'
        else if (unit === 'month') displayUnit = 'months'
        else if (unit === 'year') displayUnit = 'years'
      } else {
        displayUnit = unit
      }
      return `${num} ${displayUnit}`
    }
    
    onMounted(async () => {
      await fetchFeaturedCourses()
      await fetchFeaturedNews()
      
      // Start background carousel
      startBackgroundCarousel()
      
      // Start auto-sliding after a short delay
      setTimeout(() => {
        startAutoSlide()
      }, 1000)
      
      // Initialize animations after content loads
      setTimeout(() => {
        if (typeof TrainingCenterAnimations !== 'undefined') {
          const animations = new TrainingCenterAnimations()
          animations.animateNumbers()
        }
      }, 500)
    })

    onUnmounted(() => {
      stopAutoSlide()
      stopBackgroundCarousel()
    })

    return {
      authStore,
      featuredCourses,
      featuredNews,
      currentSlide,
      newsSlider,
      stats,
      academicFeatures,
      learningApproach,
      researchHighlights,
      currentYear,
      backgroundImages,
      currentBgImage,
      truncateDescription,
      formatDate,
      addToWishlist,
      formatDuration,
      nextSlide,
      goToSlide
    }
  }
}
</script>
<style scoped>
/* Hero Section Styles */
.training-center-hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.hero-bg-image.active {
  opacity: 0.8;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 2;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.training-center-container {
  position: relative;
  z-index: 4;
}

.hero-content {
  position: relative;
  z-index: 4;
  color: white;
}

.training-center-hero-title {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  white-space: nowrap; /* Prevent line breaks */
  word-spacing: normal; /* Ensure normal word spacing */
  letter-spacing: normal; /* Ensure normal letter spacing */
}

.training-center-hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  margin: var(--spacing-xl) 0;
  flex-wrap: wrap;
}

.hero-actions .training-center-btn-outline {
  background-color: var(--training-center-primary) !important;
  color: white !important;
  border-color: var(--training-center-primary) !important;
}

.hero-actions .training-center-btn-outline:hover {
  background-color: var(--training-center-primary-dark) !important;
  border-color: var(--training-center-primary-dark) !important;
  color: white !important;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xxxl);
  margin-top: var(--spacing-xxxl);
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
}

.stat-label {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--spacing-xs);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Section Headers */
.section-header {
  max-width: 600px;
  margin: 0 auto;
}

.section-description {
  font-size: 1.1rem;
  color: var(--training-center-gray-medium);
  line-height: 1.7;
}

/* Academic Excellence */
.academic-excellence {
  background: var(--training-center-gray-lighter);
}

/* Course Cards */
.course-card {
  position: relative;
  background-size: cover;
  background-position: center;
  transition: all 0.3s ease;
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  transition: background 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px) scale(1.02);
  background-size: 110% 110%;
}

.course-card:hover::before {
  background: rgba(255, 255, 255, 1);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  position: relative;
  z-index: 2;
}

.course-category {
  background: #0B5772; /* Match View Details button */
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

.course-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--training-center-primary);
}

.training-center-card-title {
  margin-bottom: var(--spacing-sm);
  color: var(--training-center-gray-dark);
  font-size: 1.25rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.training-center-card-meta,
.training-center-card-content,
.course-meta {
  position: relative;
  z-index: 2;
}

.course-meta {
  margin: var(--spacing-md) 0;
}

.course-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--training-center-gray-medium);
}

.course-info span {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  position: relative;
  z-index: 2;
}

.card-actions .training-center-btn {
  flex: 1;
  text-align: center;
}

/* Learning Approach */
.learning-approach {
  background: var(--training-center-white);
}

.approach-list {
  list-style: none;
  padding: 0;
}

.approach-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.approach-text h4 {
  margin-bottom: var(--spacing-xs);
  color: var(--training-center-gray-dark);
}

.approach-text p {
  margin-bottom: 0;
}

.approach-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.learning-approach-image {
  width: 500px;
  height: 400px;
  border-radius: 0px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.learning-approach-image:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Research Section */
.research-innovation {
  background: var(--training-center-gray-lighter);
}
.research-highlights {
  display: grid;
  gap: var(--spacing-xl);
}
.research-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  background: var(--training-center-white);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-subtle);
  justify-content: space-between;
}
.research-item.reverse-row {
  flex-direction: row-reverse;
}
.research-item.reverse-row .research-content {
  text-align: right;
  align-items: flex-end;
  margin-left: auto;
}
.research-content {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.research-image {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 0px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-left: var(--spacing-xl);
  margin-right: var(--spacing-xl);
}
@media (max-width: 900px) {
  .research-item, .research-item.reverse-row {
    flex-direction: column !important;
    text-align: center;
  }
  .research-image {
    margin: var(--spacing-lg) 0 0 0;
    width: 100%;
    max-width: 400px;
    height: auto;
  }
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--training-center-primary) 0%, var(--training-center-primary-dark) 100%);
  color: var(--training-center-white);
}

.cta-section h2 {
  color: var(--training-center-white);
}

.cta-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
}

.cta-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

/* Latest News Section */
.latest-news {
  background: var(--training-center-white);
}

.news-slider-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.news-slider {
  position: relative;
  width: 100%;
}

.news-slide {
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
}

.news-slide.active {
  opacity: 1;
  position: relative;
}

.news-slide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: 400px;
}

.news-image {
  background: var(--training-center-gray-lighter);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 4rem;
  opacity: 0.3;
}

.news-text {
  padding: var(--spacing-xxxl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--training-center-white);
}

.news-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.news-category {
  background: var(--training-center-primary);
  color: var(--training-center-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 15px;
  font-size: 0.8rem;
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
  font-size: 0.8rem;
  font-weight: 500;
}

.news-title {
  color: var(--training-center-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
}

.news-excerpt {
  color: var(--training-center-gray-dark);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  font-size: 1rem;
}

.news-read-more {
  color: var(--training-center-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
  align-self: flex-start;
}

.news-read-more:hover {
  color: var(--training-center-primary-dark);
  text-decoration: underline;
}

/* Slider Navigation */
.slider-dots {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: var(--training-center-gray-lighter);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--training-center-primary);
  transform: scale(1.2);
}

.dot:hover {
  background: var(--training-center-primary);
  opacity: 0.7;
}


/* Responsive Design */
@media (max-width: 768px) {
  .news-slide-content {
    grid-template-columns: 1fr;
  }
  
  .news-image {
    height: 250px;
  }
  
  .news-text {
    padding: var(--spacing-xl);
  }
  
  .news-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .news-text {
    padding: var(--spacing-lg);
  }
  
  .news-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}


</style>
