<template>
  <div class="courses-page">
    <div class="page-header">
      <h2>Training Courses</h2>
      <p class="page-subtitle">All available courses</p>
      <div class="header-actions">
        <router-link to="/courses/new" class="add-course-btn" v-if="isAdmin">
          Add New Course
        </router-link>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search courses by title or description..." 
            class="search-input"
          />
        </div>
      </div>
      
      <div class="filter-container">
        <select v-model="selectedCategory" class="category-filter">
          <option value="">All Categories</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
       <div class="filter-actions">
         <span class="results-count">{{ filteredCourses.length }} course{{ filteredCourses.length !== 1 ? 's' : '' }} found</span>
         <button @click="clearFilters" class="clear-filters-btn" v-if="hasActiveFilters">
           Clear Filters
         </button>
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
        <h3>No courses available</h3>
        <p>Get started by adding your first course</p>
        <router-link to="/courses/new" class="add-course-btn" v-if="isAdmin">
          Add the first course
        </router-link>
      </div>

      <div v-else class="courses-grid">
        <div 
          v-for="course in filteredCourses" 
          :key="course._id" 
          class="course-card"
          :style="{ backgroundImage: `url(${course.imageUrl || course.previewImage?.url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'})` }"
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
                <span>{{ course.instructor }}</span>
              </div>
              <div class="meta-item">
                <span>{{ course.duration }}</span>
              </div>
              <div class="meta-item">
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
              View
            </router-link>
            <router-link 
              v-if="isAdmin" 
              :to="'/courses/edit/' + course._id" 
              class="action-btn edit-btn"
            >
              Edit
            </router-link>
            <button 
              v-if="isAdmin" 
              @click="deleteCourse(course._id)" 
              class="action-btn delete-btn"
            >
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
    const searchQuery = ref('')
    const selectedCategory = ref('')
    
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
    
    // Computed properties for search and filtering
    const availableCategories = computed(() => {
      const categories = [...new Set(courses.value.map(course => course.category))]
      return categories.sort()
    })
    
    const filteredCourses = computed(() => {
      let filtered = courses.value
      
      // Apply search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)
        )
      }
      
      // Apply category filter
      if (selectedCategory.value) {
        filtered = filtered.filter(course => course.category === selectedCategory.value)
      }
      
      return filtered
    })
    
    const hasActiveFilters = computed(() => {
      return searchQuery.value.trim() !== '' || selectedCategory.value !== ''
    })
    
    const fetchCourses = async () => {
      isLoading.value = true
      try {
        courses.value = await getCourses()
        // Debug: Log course data to see preview image structure
        console.log('Courses loaded:', courses.value)
        if (courses.value.length > 0) {
          console.log('First course preview image:', courses.value[0].previewImage)
        }
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
    
    const clearFilters = () => {
      searchQuery.value = ''
      selectedCategory.value = ''
    }
    
    onMounted(() => {
      fetchCourses()
    })
    
    return {
      courses,
      isLoading,
      searchQuery,
      selectedCategory,
      availableCategories,
      filteredCourses,
      hasActiveFilters,
      isAuthenticated,
      currentUser,
      isAdmin,
      isInstructor,
      canManageCourses,
      deleteCourse: handleDeleteCourse,
      truncateDescription,
      formatDate,
      clearFilters
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

/* Search and Filter Section */
.search-filter-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  border: 1px solid rgba(225, 225, 225, 0.5);
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto 40px auto;
}

.search-filter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0B5772 50%, #c4c1c1 50%, #0B5772 50%);
}

.search-filter-section {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 25px;
  align-items: end;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input::placeholder {
  color: #6c757d;
  font-style: italic;
}

.search-input:focus {
  outline: none;
  border-color: #0B5772;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(165, 28, 48, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  right: 18px;
  font-size: 18px;
  color: #0B5772;
  pointer-events: none;
  transition: all 0.3s ease;
}

.search-input:focus + .search-icon {
  color: #0B5772;
  transform: scale(1.1);
}

.filter-container {
  position: relative;
}

.category-filter {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230B5772' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
  padding-right: 50px;
}

.category-filter:focus {
  outline: none;
  border-color: #0B5772;
  box-shadow: 0 0 0 4px rgba(165, 28, 48, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.filter-actions {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  min-width: 140px;
  height: 100%;
}

.clear-filters-btn {
  padding: 16px 20px;
  background: transparent;
  color: #0B5772;
  border: 2px solid #0B5772;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-filters-btn:hover {
  background: #A51C30;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(165, 28, 48, 0.3);
}

.results-count {
  font-size: 16px;
  color: #0B5772;
  font-weight: 600;
  text-align: center;
  padding: 16px 20px;
  background: rgba(11, 87, 114, 0.05);
  border-radius: 8px;
  border-left: 3px solid #0B5772;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.courses-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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


@media (max-width: 768px) {
  .courses-page {
    padding: 15px;
  }
  
  .search-filter-section {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 25px 20px;
  }
  
  .search-container,
  .filter-container {
    min-width: unset;
  }
  
  .filter-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: unset;
    margin-top: 10px;
  }
  
  .clear-filters-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .results-count {
    font-size: 13px;
    padding: 6px 10px;
  }
  
  .search-input {
    padding: 14px 45px 14px 18px;
    font-size: 16px;
  }
  
  .category-filter {
    padding: 14px 45px 14px 18px;
    font-size: 16px;
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