<template>
  <div v-if="course" class="course-show-page">
    <div class="page-header">
      <div class="breadcrumb">
        <router-link to="/courses">Courses</router-link>
        <span class="separator">/</span>
        <span class="current">{{ course.title }}</span>
      </div>
    </div>

    <div class="course-details-container">
      <div class="course-details-card">
        <div class="course-header">
          <h2>{{ course.title }}</h2>
          <p class="instructor">by {{ course.instructor }}</p>
        </div>

        <div class="course-content">
          <div class="course-info-grid">
            <div class="info-section">
              <h3>Course Information</h3>
              <div class="info-item">
                <div class="info-label">
                  Description
                </div>
                <div class="info-value">{{ course.description }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  Duration
                </div>
                <div class="info-value">{{ course.duration }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  Start Date
                </div>
                <div class="info-value">{{ formatDate(course.startDate) }}</div>
              </div>
            </div>

            <div class="info-section">
              <h3>Course Details</h3>
              <div class="info-item">
                <div class="info-label">
                  Price
                </div>
                <div class="info-value">
                  <span class="price-tag">${{ course.price }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  Category
                </div>
                <div class="info-value">
                  <span class="category-tag">{{ course.category }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  Maximum Students
                </div>
                <div class="info-value">{{ course.maxStudents }} students</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Course Pictures Section - Full Width -->
        <div class="course-pictures-section">
          <h3>Course Pictures</h3>
          <div class="course-images">
            <div v-if="course.images && course.images.length > 0" class="image-carousel">
              <div class="carousel-container">
                <button 
                  v-if="course.images.length > 1"
                  @click="previousImage" 
                  class="carousel-btn prev-btn"
                  :disabled="currentImageIndex === 0"
                >
                  &#8249;
                </button>
                
                <div class="image-wrapper">
                  <img 
                    :src="course.images[currentImageIndex].url" 
                    :alt="`Course image ${currentImageIndex + 1}`"
                    class="course-image"
                    @error="handleImageError"
                  >
                </div>
                
                <button 
                  v-if="course.images.length > 1"
                  @click="nextImage" 
                  class="carousel-btn next-btn"
                  :disabled="currentImageIndex === course.images.length - 1"
                >
                  &#8250;
                </button>
              </div>
              
              <div v-if="course.images.length > 1" class="image-indicators">
                <span 
                  v-for="(image, index) in course.images" 
                  :key="index"
                  @click="goToImage(index)"
                  :class="['indicator', { active: index === currentImageIndex }]"
                ></span>
              </div>
            </div>
            
            <div v-else class="no-images">
              <p>No images available for this course</p>
            </div>
          </div>
        </div>

        <div class="course-actions">
          <router-link 
            v-if="isAdmin" 
            :to="'/courses/edit/' + course._id" 
            class="edit-btn"
          >
            Edit Course
          </router-link>
          <router-link to="/courses" class="back-btn">
            Back to List
          </router-link>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading-page">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading course details...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getCourse } from '../helpers/api'
import { authStore } from '../store/auth'

export default {
  name: 'Show',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    
    const course = ref(null)
    const currentImageIndex = ref(0)
    
    // Computed properties for role-based access control
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const currentUser = computed(() => authStore.user)
    const isAdmin = computed(() => {
      return isAuthenticated.value && currentUser.value && currentUser.value.role === 'admin'
    })
    const isInstructor = computed(() => {
      return isAuthenticated.value && currentUser.value && currentUser.value.role === 'instructor'
    })
    const canManageCourses = computed(() => {
      return isAdmin.value || isInstructor.value
    })
    
    const fetchCourse = async () => {
      const id = route.params.id
      try {
        course.value = await getCourse(id)
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error('Failed to load course details')
        router.push('/courses')
      }
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    // Image carousel functions
    const nextImage = () => {
      if (course.value && course.value.images && currentImageIndex.value < course.value.images.length - 1) {
        currentImageIndex.value++
      }
    }
    
    const previousImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--
      }
    }
    
    const goToImage = (index) => {
      currentImageIndex.value = index
    }
    
    const handleImageError = (event) => {
      event.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
    }
    
    onMounted(() => {
      fetchCourse()
    })
    
    return {
      course,
      currentImageIndex,
      formatDate,
      nextImage,
      previousImage,
      goToImage,
      handleImageError,
      isAuthenticated,
      currentUser,
      isAdmin,
      isInstructor,
      canManageCourses
    }
  }
}
</script>

<style scoped>
.course-show-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 80px);
}

.page-header {
  margin-bottom: 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #0B5772;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: #ccc;
}

.current {
  color: #333;
  font-weight: 600;
}

.course-details-container {
  max-width: 1000px;
  margin: 0 auto;
}

.course-details-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.course-header {
  margin-bottom: 30px;
  text-align: center;
}

.course-header h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 32px;
}

.instructor {
  color: #666;
  font-size: 18px;
  font-style: italic;
}

.course-content {
  margin-bottom: 40px;
}

.course-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.info-section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #A51C30;
  padding-bottom: 10px;
}

.info-item {
  margin-bottom: 20px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.info-value {
  color: #666;
  line-height: 1.6;
}

.price-tag {
  background: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 18px;
}

.category-tag {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

/* Course Pictures Section - Full Width */
.course-pictures-section {
  margin: 30px 0;
  width: 100%;
}

.course-pictures-section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #A51C30;
  padding-bottom: 10px;
}

/* Image Carousel Styles */
.course-images {
  margin-top: 8px;
}

.image-carousel {
  position: relative;
  max-width: 100%;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  width: 100%;
  margin: 0 auto;
}

.image-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
}

.course-image {
  max-width: 100%;
  width: 100%;
  max-height: 500px;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.course-image:hover {
  transform: scale(1.02);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(11, 87, 114, 0.8);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(11, 87, 114, 1);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn:disabled {
  background: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
  transform: translateY(-50%) scale(1);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.image-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #0B5772;
  transform: scale(1.2);
}

.indicator:hover {
  background: #0B5772;
}

.no-images {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.course-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding-top: 30px;
  border-top: 1px solid #e1e1e1;
}

.edit-btn,
.back-btn {
  padding: 12px 24px;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  background-color: #ffc107;
  color: #333;
  border: 2px solid #ffc107;
}

.edit-btn:hover {
  background-color: #e0a800;
  border-color: #e0a800;
}

.back-btn {
  background-color: transparent;
  color: #0B5772;
  border: 2px solid #0B5772;
}

.back-btn:hover {
  background-color: #0B5772;
  color: white;
}

.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background: #f5f5f5;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e1e1e1;
  border-top: 4px solid #A51C30;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


@media (max-width: 768px) {
  .course-show-page {
    padding: 15px;
  }
  
  .course-details-card {
    padding: 20px;
  }
  
  .course-info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .course-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .edit-btn,
  .back-btn {
    text-align: center;
    justify-content: center;
  }
  
  .carousel-container {
    min-height: 250px;
  }
  
  .course-image {
    max-height: 300px;
  }
  
  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
  
  .prev-btn {
    left: 5px;
  }
  
  .next-btn {
    right: 5px;
  }
}
</style>