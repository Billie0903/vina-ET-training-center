<template>
  <div class="courses-page">
    <div class="page-header">
      <h2>Training Courses</h2>
      <p class="page-subtitle">All available courses</p>
      <div class="header-actions">
        <router-link to="/courses/new" class="add-course-btn" v-if="isAdmin">
          <i class="icon-plus"></i>
          Add New Course
        </router-link>
      </div>
    </div>

    <div class="courses-container">
      <div v-if="isLoading" class="loading-section">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>

      <div v-else-if="courses.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="icon-book"></i>
        </div>
        <h3>No courses available</h3>
        <p>Get started by adding your first course</p>
        <router-link to="/courses/new" class="add-course-btn" v-if="isAdmin">
          <i class="icon-plus"></i>
          Add the first course
        </router-link>
      </div>

      <div v-else class="courses-grid">
        <div 
          v-for="course in courses" 
          :key="course._id" 
          class="course-card"
          :style="{ backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'})` }"
        >
          <div class="course-header">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-category">{{ course.category }}</div>
          </div>
          
          <div class="course-content">
            <p class="course-description">
              {{ truncateDescription(course.description, 120) }}
            </p>
            
            <div class="course-meta">
              <div class="meta-item">
                <i class="icon-user"></i>
                <span>{{ course.instructor }}</span>
              </div>
              <div class="meta-item">
                <i class="icon-clock"></i>
                <span>{{ course.duration }}</span>
              </div>
              <div class="meta-item">
                <i class="icon-calendar"></i>
                <span>{{ formatDate(course.startDate) }}</span>
              </div>
            </div>
            
            <div class="course-stats">
              <div class="stat-item">
                <span class="stat-label">Price</span>
                <span class="stat-value price">${{ course.price }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Max Students</span>
                <span class="stat-value">{{ course.maxStudents }}</span>
              </div>
            </div>
          </div>
          
          <div class="course-actions">
            <router-link :to="'/courses/show/' + course._id" class="action-btn view-btn">
              <i class="icon-eye"></i>
              View
            </router-link>
            <router-link 
              v-if="isAdmin" 
              :to="'/courses/edit/' + course._id" 
              class="action-btn edit-btn"
            >
              <i class="icon-edit"></i>
              Edit
            </router-link>
            <button 
              v-if="isAdmin" 
              @click="deleteCourse(course._id)" 
              class="action-btn delete-btn"
            >
              <i class="icon-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { getCourses, deleteCourse } from '../helpers/api'
import { authStore } from '../store/auth'

export default {
  name: 'Courses',
  setup() {
    const toast = useToast()
    
    const courses = ref([])
    const isLoading = ref(false)
    
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
    
    const fetchCourses = async () => {
      isLoading.value = true
      try {
        courses.value = await getCourses()
      } catch (error) {
        console.error('Error fetching courses:', error)
        toast.error('Failed to load courses')
      } finally {
        isLoading.value = false
      }
    }
    
    const handleDeleteCourse = async (id) => {
      // Double-check admin permissions before deletion
      if (!isAdmin.value) {
        toast.error('You do not have permission to delete courses')
        return
      }
      
      if (confirm('Are you sure you want to delete this course?')) {
        try {
          await deleteCourse(id)
          toast.success('Course deleted successfully')
          await fetchCourses() // Refresh the list
        } catch (error) {
          console.error('Error deleting course:', error)
          toast.error('Failed to delete course')
        }
      }
    }
    
    const truncateDescription = (description, maxLength) => {
      if (description.length <= maxLength) return description
      return description.substring(0, maxLength) + '...'
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    onMounted(() => {
      fetchCourses()
    })
    
    return {
      courses,
      isLoading,
      isAuthenticated,
      currentUser,
      isAdmin,
      isInstructor,
      canManageCourses,
      deleteCourse: handleDeleteCourse,
      truncateDescription,
      formatDate
    }
  }
}
</script>

<style scoped>
.courses-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 80px);
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 32px;
}

.page-subtitle {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.header-actions {
  margin-top: 20px;
}

.add-course-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #0B5772;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.add-course-btn:hover {
  background-color: #063D63;
  color: white;
  text-decoration: none;
}

.courses-container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin-bottom: 10px;
  color: #333;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.course-card {
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
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
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-size: 110% 110%;
}

.course-card:hover::before {
  background: rgba(255, 255, 255, 1);
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.course-header {
  padding: 20px 20px 15px;
  border-bottom: 1px solid rgba(225, 225, 225, 0.3);
  position: relative;
  z-index: 2;
}

.course-title {
  margin-bottom: 8px;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.course-category {
  display: inline-block;
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.course-content {
  padding: 20px;
  position: relative;
  z-index: 2;
}

.course-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.course-meta {
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.course-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.stat-value.price {
  color: #28a745;
}

.course-actions {
  display: flex;
  gap: 8px;
  padding: 0 20px 20px;
  position: relative;
  z-index: 2;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.view-btn {
  background-color: #007bff;
  color: white;
}

.view-btn:hover {
  background-color: #0056b3;
  color: white;
  text-decoration: none;
}

.edit-btn {
  background-color: #ffc107;
  color: #333;
}

.edit-btn:hover {
  background-color: #e0a800;
  color: #333;
  text-decoration: none;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* Icon styles */
[class^="icon-"]::before {
  display: inline-block;
  width: 1em;
  text-align: center;
}

.icon-plus::before { content: "➕"; }
.icon-book::before { content: "📚"; }
.icon-user::before { content: "👤"; }
.icon-clock::before { content: "⏰"; }
.icon-calendar::before { content: "📅"; }
.icon-eye::before { content: "👁️"; }
.icon-edit::before { content: "✏️"; }
.icon-trash::before { content: "🗑️"; }

@media (max-width: 768px) {
  .courses-page {
    padding: 15px;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .course-actions {
    flex-direction: column;
  }
  
  .action-btn {
    text-align: center;
  }
}
</style>