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
                  <i class="icon-info"></i>
                  Description
                </div>
                <div class="info-value">{{ course.description }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <i class="icon-clock"></i>
                  Duration
                </div>
                <div class="info-value">{{ course.duration }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <i class="icon-calendar"></i>
                  Start Date
                </div>
                <div class="info-value">{{ formatDate(course.startDate) }}</div>
              </div>
            </div>

            <div class="info-section">
              <h3>Course Details</h3>
              <div class="info-item">
                <div class="info-label">
                  <i class="icon-dollar"></i>
                  Price
                </div>
                <div class="info-value">
                  <span class="price-tag">${{ course.price }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <i class="icon-tag"></i>
                  Category
                </div>
                <div class="info-value">
                  <span class="category-tag">{{ course.category }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <i class="icon-users"></i>
                  Maximum Students
                </div>
                <div class="info-value">{{ course.maxStudents }} students</div>
              </div>
            </div>
          </div>
        </div>

        <div class="course-actions">
          <router-link 
            v-if="isAdmin" 
            :to="'/courses/edit/' + course._id" 
            class="edit-btn"
          >
            <i class="icon-edit"></i>
            Edit Course
          </router-link>
          <router-link to="/courses" class="back-btn">
            <i class="icon-arrow-left"></i>
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
    
    onMounted(() => {
      fetchCourse()
    })
    
    return {
      course,
      formatDate,
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

/* Icon styles */
[class^="icon-"]::before {
  display: inline-block;
  width: 1em;
  text-align: center;
}

.icon-info::before { content: "ℹ️"; }
.icon-clock::before { content: "⏰"; }
.icon-calendar::before { content: "📅"; }
.icon-dollar::before { content: "💰"; }
.icon-tag::before { content: "🏷️"; }
.icon-users::before { content: "👥"; }
.icon-edit::before { content: "✏️"; }
.icon-arrow-left::before { content: "←"; }

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
}
</style>