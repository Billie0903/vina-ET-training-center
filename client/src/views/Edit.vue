<template>
  <div v-if="course" class="edit-course-page">
    <div class="page-header">
      <div class="breadcrumb">
        <router-link to="/courses">Courses</router-link>
        <span class="separator">/</span>
        <router-link :to="'/courses/show/' + course._id">{{ course.title }}</router-link>
        <span class="separator">/</span>
        <span class="current">Edit</span>
      </div>
    </div>

    <div class="edit-course-container">
      <div class="edit-course-card">
        <h2>Edit Course</h2>
        <p class="form-subtitle">Update course information</p>

        <form @submit.prevent="handleUpdateCourse">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Course Title</label>
              <input 
                type="text" 
                id="title"
                v-model="form.title" 
                class="form-input"
                placeholder="Enter course title"
                required
              >
            </div>
            <div class="form-group">
              <label for="instructor">Instructor</label>
              <input 
                type="text" 
                id="instructor"
                v-model="form.instructor" 
                class="form-input"
                placeholder="Instructor name"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              v-model="form.description" 
              class="form-textarea"
              rows="4"
              placeholder="Course description"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="duration">Duration</label>
              <input 
                type="text" 
                id="duration"
                v-model="form.duration" 
                class="form-input"
                placeholder="e.g., 8 weeks"
                required
              >
            </div>
            <div class="form-group">
              <label for="price">Price ($)</label>
              <input 
                type="number" 
                id="price"
                v-model="form.price" 
                class="form-input"
                placeholder="0"
                min="0"
                step="0.01"
                required
              >
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <input 
                type="text" 
                id="category"
                v-model="form.category" 
                class="form-input"
                placeholder="Enter category (e.g., Programming, Design, Business)"
                required
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Start Date</label>
              <input 
                type="date" 
                id="startDate"
                v-model="form.startDate" 
                class="form-input"
                required
              >
            </div>
            <div class="form-group">
              <label for="maxStudents">Maximum Students</label>
              <input 
                type="number" 
                id="maxStudents"
                v-model="form.maxStudents" 
                class="form-input"
                placeholder="25"
                min="1"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="imageUrl">Course Image URL</label>
            <input 
              type="url" 
              id="imageUrl"
              v-model="form.imageUrl" 
              class="form-input"
              placeholder="https://example.com/image.jpg"
            >
            <small class="form-help">Leave empty to use default image</small>
          </div>

          <div class="form-group">
            <label>Upload Course Preview Image</label>
            <div class="single-image-upload">
              <div class="file-upload-container">
                <input 
                  type="file" 
                  id="previewImageFile"
                  @change="handlePreviewImageUpload" 
                  class="file-input"
                  accept="image/*"
                >
                <label for="previewImageFile" class="file-upload-label">
                  <span v-if="!previewImage">Choose preview image file</span>
                  <span v-else>Change preview image</span>
                </label>
              </div>
              <small class="form-help">This image will be used as the course preview in the courses list (Max 5MB, JPG/PNG/GIF)</small>
              
              <div v-if="previewImage" class="preview-image-container">
                <h4>Preview Image:</h4>
                <div class="preview-image-item">
                  <img :src="previewImage.url" :alt="previewImage.originalName" class="preview-image-single">
                  <div class="preview-image-info">
                    <span class="preview-image-name">{{ previewImage.originalName }}</span>
                    <button 
                      type="button" 
                      @click="removePreviewImage" 
                      class="remove-preview-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Course Images</label>
            <div class="multi-image-upload">
              <div class="file-upload-container">
                <input 
                  type="file" 
                  id="imageFiles"
                  @change="handleMultipleImageUpload" 
                  class="file-input"
                  accept="image/*"
                  multiple
                >
                <label for="imageFiles" class="file-upload-label">
                  <span>Choose multiple image files</span>
                </label>
              </div>
              <small class="form-help">Supported formats: JPG, PNG, GIF (Max 5MB each, up to 10 images)</small>
              
              <div v-if="uploadedImages.length > 0" class="uploaded-images">
                <h4>Current Images ({{ uploadedImages.length }}/10):</h4>
                <div class="image-preview-grid">
                  <div 
                    v-for="(image, index) in uploadedImages" 
                    :key="index"
                    class="image-preview-item"
                  >
                    <img :src="image.url" :alt="`Preview ${index + 1}`" class="preview-image">
                    <div class="image-info">
                      <span class="image-name">{{ image.originalName }}</span>
                      <button 
                        type="button" 
                        @click="removeImage(index)" 
                        class="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Updating Course...</span>
              <span v-else>Update Course</span>
            </button>
            <router-link :to="'/courses/show/' + course._id" class="view-btn">
              View Course
            </router-link>
            <router-link to="/courses" class="cancel-btn">
              Cancel
            </router-link>
          </div>
        </form>
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
import { getCourse, updateCourse, upload } from '../helpers/api'
import { authStore } from '../store/auth'

export default {
  name: 'Edit',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    
    const course = ref(null)
    const isLoading = ref(false)
    const uploadedImages = ref([])
    const previewImage = ref(null)
    
    // Computed properties for role-based access control
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const currentUser = computed(() => authStore.user)
    const isAdmin = computed(() => {
      return isAuthenticated.value && currentUser.value && currentUser.value.role === 'admin'
    })
    
    const form = ref({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      price: '',
      category: '',
      startDate: '',
      maxStudents: '',
      imageUrl: ''
    })
    
    const selectedFile = ref(null)
    
    const fetchCourse = async () => {
      const id = route.params.id
      try {
        course.value = await getCourse(id)
        // Populate form with course data
        form.value = {
          title: course.value.title,
          description: course.value.description,
          instructor: course.value.instructor,
          duration: course.value.duration,
          price: course.value.price,
          category: course.value.category,
          startDate: new Date(course.value.startDate).toISOString().split('T')[0],
          maxStudents: course.value.maxStudents,
          imageUrl: course.value.imageUrl || ''
        }
        
        // Load existing images
        uploadedImages.value = course.value.images || []
        
        // Load existing preview image
        previewImage.value = course.value.previewImage || null
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error('Failed to load course details')
        router.push('/courses')
      }
    }
    
    const handleUpdateCourse = async () => {
      // Check admin permissions
      if (!isAdmin.value) {
        toast.error('You do not have permission to edit courses')
        return
      }
      
      if (isLoading.value) return
      
      // Validate form
      if (!form.value.title || !form.value.description || !form.value.instructor || 
          !form.value.duration || !form.value.price || !form.value.category || 
          !form.value.startDate || !form.value.maxStudents) {
        toast.error('Please fill in all required fields')
        return
      }
      
      // Validate price
      if (parseFloat(form.value.price) < 0) {
        toast.error('Price must be a positive number')
        return
      }
      
      // Validate max students
      if (parseInt(form.value.maxStudents) < 1) {
        toast.error('Maximum students must be at least 1')
        return
      }
      
      isLoading.value = true
      
      try {
        const id = route.params.id
        const courseData = {
          ...form.value,
          price: parseFloat(form.value.price),
          maxStudents: parseInt(form.value.maxStudents),
          images: uploadedImages.value,
          previewImage: previewImage.value
        }
        
        await updateCourse(id, courseData)
        toast.success('Course updated successfully!')
        router.push(`/courses/show/${id}`)
      } catch (error) {
        console.error('Error updating course:', error)
        toast.error(error.response?.data?.message || 'Error updating course. Please check all fields and try again.')
      } finally {
        isLoading.value = false
      }
    }
    
    const handleMultipleImageUpload = async (event) => {
      const files = Array.from(event.target.files)
      
      if (files.length === 0) return
      
      // Check if adding these files would exceed the limit
      if (uploadedImages.value.length + files.length > 10) {
        toast.error('Maximum 10 images allowed')
        event.target.value = ''
        return
      }
      
      // Validate each file
      for (const file of files) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File "${file.name}" is too large. Maximum size is 5MB`)
          event.target.value = ''
          return
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`File "${file.name}" is not a valid image file`)
          event.target.value = ''
          return
        }
      }
      
      // Upload files sequentially to avoid overwhelming the server
      for (const file of files) {
        try {
          // Create FormData for file upload
          const formData = new FormData()
          formData.append('image', file)
          
          // Upload the file
          const response = await upload.uploadImage(formData)
          
          // Add to uploaded images array
          uploadedImages.value.push({
            url: response.url,
            filename: response.filename,
            originalName: response.originalName
          })
          
        } catch (error) {
          console.error('Upload error:', error)
          toast.error(`Failed to upload "${file.name}". Please try again.`)
        }
      }
      
      if (files.length > 0) {
        toast.success(`${files.length} image(s) uploaded successfully!`)
      }
      
      // Clear the input
      event.target.value = ''
    }
    
    const removeSelectedFile = () => {
      selectedFile.value = null
      form.value.imageUrl = ''
      const fileInput = document.getElementById('imageFile')
      if (fileInput) {
        fileInput.value = ''
      }
    }
    
    const removeImage = (index) => {
      uploadedImages.value.splice(index, 1)
      toast.success('Image removed')
    }
    
    const handlePreviewImageUpload = async (event) => {
      const file = event.target.files[0]
      
      if (!file) return
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" is too large. Maximum size is 5MB`)
        event.target.value = ''
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" is not a valid image file`)
        event.target.value = ''
        return
      }
      
      try {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('image', file)
        
        // Upload the file
        const response = await upload.uploadImage(formData)
        
        // Set preview image
        previewImage.value = {
          url: response.url,
          filename: response.filename,
          originalName: response.originalName
        }
        
        toast.success('Preview image uploaded successfully!')
        
      } catch (error) {
        console.error('Preview image upload error:', error)
        toast.error(`Failed to upload "${file.name}". Please try again.`)
      }
      
      // Clear the input
      event.target.value = ''
    }
    
    const removePreviewImage = () => {
      previewImage.value = null
      toast.success('Preview image removed')
    }
    
    onMounted(() => {
      fetchCourse()
    })
    
    return {
      course,
      form,
      isLoading,
      selectedFile,
      uploadedImages,
      previewImage,
      isAuthenticated,
      currentUser,
      isAdmin,
      handleUpdateCourse,
      handleMultipleImageUpload,
      handlePreviewImageUpload,
      removeSelectedFile,
      removeImage,
      removePreviewImage
    }
  }
}
</script>

<style scoped>
.edit-course-page {
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
  color: #A51C30;
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

.edit-course-container {
  max-width: 800px;
  margin: 0 auto;
}

.edit-course-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-course-card h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 28px;
}

.form-subtitle {
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #A51C30;
  box-shadow: 0 0 0 3px rgba(165, 28, 48, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-help {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.file-upload-container {
  position: relative;
  margin-top: 8px;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px dashed #e1e1e1;
  border-radius: 4px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  border-color: #A51C30;
  background: #f1f3f4;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 8px 12px;
  background: #e8f5e8;
  border: 1px solid #c3e6c3;
  border-radius: 4px;
  font-size: 14px;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.remove-file-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* Single Image Upload Styles */
.single-image-upload {
  margin-top: 8px;
}

.preview-image-container {
  margin-top: 20px;
}

.preview-image-container h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.preview-image-item {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 300px;
}

.preview-image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-image-single {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.preview-image-info {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
}

.preview-image-name {
  font-size: 14px;
  color: #666;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 12px;
}

.remove-preview-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.remove-preview-btn:hover {
  background: #c82333;
}

/* Multiple Image Upload Styles */
.multi-image-upload {
  margin-top: 8px;
}

.uploaded-images {
  margin-top: 20px;
}

.uploaded-images h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.image-preview-item {
  position: relative;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.image-info {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
}

.image-name {
  font-size: 12px;
  color: #666;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.remove-image-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.remove-image-btn:hover {
  background: #c82333;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  align-items: center;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #A51C30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #8B1538;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.view-btn,
.cancel-btn {
  padding: 12px 24px;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn {
  background-color: #007bff;
  color: white;
  border: 2px solid #007bff;
}

.view-btn:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  color: white;
  text-decoration: none;
}

.cancel-btn {
  background-color: transparent;
  color: #A51C30;
  border: 2px solid #A51C30;
}

.cancel-btn:hover {
  background-color: #A51C30;
  color: white;
  text-decoration: none;
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
  .edit-course-page {
    padding: 15px;
  }
  
  .edit-course-card {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .submit-btn,
  .view-btn,
  .cancel-btn {
    text-align: center;
    justify-content: center;
  }
  
  .image-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
  
  .preview-image {
    height: 100px;
  }
  
  .preview-image-single {
    height: 150px;
  }
  
  .preview-image-item {
    max-width: 100%;
  }
}
</style>