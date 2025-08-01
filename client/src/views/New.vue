<template>
  <div class="new-course-page">
    <div class="page-header">
      <div class="breadcrumb">
        <router-link to="/courses">Courses</router-link>
        <span class="separator">/</span>
        <span class="current">New Course</span>
      </div>
    </div>

    <div class="course-form-container">
      <div class="course-form-card">
        <h2>Add New Course</h2>
        <p class="form-subtitle">Fill out the course information</p>

        <form @submit.prevent="handleCreateCourse">
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
              <label for="durationValue">Duration</label>
              <div style="display: flex; gap: 10px; align-items: center;">
                <input 
                  type="number" 
                  id="durationValue"
                  v-model.number="form.durationValue" 
                  class="form-input"
                  placeholder="e.g., 8"
                  min="1"
                  step="1"
                  required
                  style="max-width: 100px;"
                >
                <select 
                  v-model="form.durationUnit" 
                  class="form-input"
                  required
                  style="max-width: 120px;"
                >
                  <option value="weeks">Weeks</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="year">Year</option>
                </select>
              </div>
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
              <select 
                id="category"
                v-model="form.category" 
                class="form-input"
                required
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Arts">Arts</option>
                <option value="Other">Other</option>
              </select>
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
            <label for="imageFile">Or Upload Image File</label>
            <div class="file-upload-container">
              <input 
                type="file" 
                id="imageFile"
                @change="handleImageUpload" 
                class="file-input"
                accept="image/*"
              >
              <label for="imageFile" class="file-upload-label">
                <i class="icon-upload"></i>
                <span>Choose an image file</span>
              </label>
            </div>
            <small class="form-help">Supported formats: JPG, PNG, GIF (Max 5MB)</small>
            <div v-if="selectedFile" class="selected-file">
              <span>Selected: {{ selectedFile.name }}</span>
              <button type="button" @click="removeSelectedFile" class="remove-file-btn">
                <i class="icon-close"></i>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Creating Course...</span>
              <span v-else>Create Course</span>
            </button>
            <router-link to="/courses" class="cancel-btn">
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { createCourse, upload } from '../helpers/api'

export default {
  name: 'New',
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    const form = ref({
      title: '',
      description: '',
      instructor: '',
      durationValue: '',
      durationUnit: 'weeks',
      price: '',
      category: '',
      startDate: '',
      maxStudents: '',
      imageUrl: ''
    })
    
    const isLoading = ref(false)
    const selectedFile = ref(null)
    
    const handleCreateCourse = async () => {
      if (isLoading.value) return
      
      // Validate form
      if (!form.value.title || !form.value.description || !form.value.instructor || 
          !form.value.durationValue || !form.value.durationUnit || !form.value.price || !form.value.category || 
          !form.value.startDate || !form.value.maxStudents) {
        toast.error('Please fill in all required fields')
        return
      }
      // Validate duration
      if (!Number.isInteger(form.value.durationValue) || form.value.durationValue < 1) {
        toast.error('Duration must be a positive integer')
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
        // Prepare course data
        const courseData = {
          ...form.value,
          duration: `${form.value.durationValue} ${form.value.durationUnit}`,
          price: parseFloat(form.value.price),
          maxStudents: parseInt(form.value.maxStudents)
        }
        // Remove helper fields
        delete courseData.durationValue
        delete courseData.durationUnit
        
        await createCourse(courseData)
        toast.success('Course created successfully!')
        router.push('/courses')
      } catch (error) {
        console.error('Error creating course:', error)
        toast.error(error.response?.data?.message || 'Error creating course. Please check all fields and try again.')
      } finally {
        isLoading.value = false
      }
    }
    
    const handleImageUpload = async (event) => {
      const file = event.target.files[0]
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB')
          event.target.value = ''
          return
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file')
          event.target.value = ''
          return
        }
        
        try {
          // Create FormData for file upload
          const formData = new FormData()
          formData.append('image', file)
          
          // Upload the file
          const response = await upload.uploadImage(formData)
          
          // Set the uploaded image URL
          form.value.imageUrl = response.url
          selectedFile.value = file
          
          toast.success('Image uploaded successfully!')
        } catch (error) {
          console.error('Upload error:', error)
          toast.error('Failed to upload image. Please try again.')
          event.target.value = ''
        }
      }
    }
    
    const removeSelectedFile = () => {
      selectedFile.value = null
      form.value.imageUrl = ''
      const fileInput = document.getElementById('imageFile')
      if (fileInput) {
        fileInput.value = ''
      }
    }
    
    return {
      form,
      isLoading,
      selectedFile,
      handleCreateCourse,
      handleImageUpload,
      removeSelectedFile
    }
  }
}
</script>

<style scoped>
.new-course-page {
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

.course-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.course-form-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.course-form-card h2 {
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
  border-color: #0B5772;
  box-shadow: 0 0 0 3px rgba(11, 87, 114, 0.1);
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
  border-color: #0B5772;
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

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  align-items: center;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #0B5772;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #063D63;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 12px 24px;
  color: #0B5772;
  text-decoration: none;
  font-weight: 600;
  border: 2px solid #0B5772;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #0B5772;
  color: white;
}

@media (max-width: 768px) {
  .new-course-page {
    padding: 15px;
  }
  
  .course-form-card {
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
  .cancel-btn {
    text-align: center;
  }
}

/* Icon styles */
[class^="icon-"]::before {
  display: inline-block;
  width: 1em;
  text-align: center;
}

.icon-upload::before { content: "📤"; }
.icon-close::before { content: "✕"; }
</style>