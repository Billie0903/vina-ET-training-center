<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit News Article' : 'Create News Article' }}</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="saveArticle" class="modal-form">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Enter article title"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="excerpt">Summary *</label>
          <textarea
            id="excerpt"
            v-model="formData.excerpt"
            required
            placeholder="Enter article summary (max 200 characters)"
            maxlength="200"
            rows="3"
            class="form-textarea"
          ></textarea>
          <div class="char-count">{{ formData.excerpt.length }}/200</div>
        </div>

        <div class="form-group">
          <label for="content">Content *</label>
          <textarea
            id="content"
            v-model="formData.content"
            required
            placeholder="Enter article content"
            rows="10"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Category *</label>
            <select
              id="category"
              v-model="formData.category"
              required
              class="form-select"
            >
              <option value="">Select category</option>
              <option value="Announcement">Announcement</option>
              <option value="Achievement">Achievement</option>
              <option value="Partnership">Partnership</option>
              <option value="Award">Award</option>
              <option value="Course Update">Course Update</option>
              <option value="Student Success">Student Success</option>
              <option value="General">General</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tags">Tags</label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="Enter tags separated by commas"
              class="form-input"
              @blur="updateTags"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="image">Featured Image</label>
          <div class="image-upload">
            <input
              id="image"
              ref="imageInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="file-input"
            >
            <label for="image" class="file-label">
              <span class="file-icon">📷</span>
              <span class="file-text">
                {{ selectedImage ? 'Change Image' : 'Choose Image' }}
              </span>
            </label>
            <div v-if="selectedImage" class="image-preview">
              <img :src="imagePreview" :alt="formData.title" class="preview-img">
              <button type="button" @click="removeImage" class="remove-image-btn">Remove</button>
            </div>
            <div v-else-if="formData.image?.url" class="current-image">
              <img :src="formData.image.url" :alt="formData.title" class="current-img">
              <button type="button" @click="removeCurrentImage" class="remove-image-btn">Remove</button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="formData.featured"
                type="checkbox"
                class="checkbox-input"
              >
              <span class="checkbox-text">Featured Article</span>
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="formData.published"
                type="checkbox"
                class="checkbox-input"
              >
              <span class="checkbox-text">Published</span>
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn-cancel">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn-save">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { adminApi } from '../../helpers/adminApi'

export default {
  name: 'NewsModal',
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const selectedImage = ref(null)
    const imagePreview = ref('')
    const tagsInput = ref('')
    const imageInput = ref(null)

    const isEditing = computed(() => !!props.article)

    const formData = reactive({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      featured: false,
      published: false,
      image: null
    })

    // Initialize form data
    watch(() => props.article, (newArticle) => {
      if (newArticle) {
        formData.title = newArticle.title || ''
        formData.excerpt = newArticle.excerpt || ''
        formData.content = newArticle.content || ''
        formData.category = newArticle.category || ''
        formData.tags = newArticle.tags || []
        formData.featured = newArticle.featured || false
        formData.published = newArticle.published || false
        formData.image = newArticle.image || null
        tagsInput.value = newArticle.tags ? newArticle.tags.join(', ') : ''
      } else {
        // Reset form for new article
        Object.keys(formData).forEach(key => {
          if (key === 'tags') {
            formData[key] = []
          } else if (key === 'featured' || key === 'published') {
            formData[key] = false
          } else {
            formData[key] = ''
          }
        })
        tagsInput.value = ''
        selectedImage.value = null
        imagePreview.value = ''
      }
    }, { immediate: true })

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedImage.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const removeImage = () => {
      selectedImage.value = null
      imagePreview.value = ''
      if (imageInput.value) {
        imageInput.value.value = ''
      }
    }

    const removeCurrentImage = () => {
      formData.image = null
    }

    const updateTags = () => {
      if (tagsInput.value.trim()) {
        formData.tags = tagsInput.value
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      } else {
        formData.tags = []
      }
    }

    const saveArticle = async () => {
      loading.value = true
      try {
        const articleData = {
          ...formData,
          image: selectedImage.value || formData.image
        }

        if (isEditing.value) {
          await adminApi.news.update(props.article._id, articleData)
        } else {
          await adminApi.news.create(articleData)
        }

        emit('saved')
      } catch (error) {
        console.error('Error saving article:', error)
        alert('Error saving article. Please try again.')
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      loading,
      selectedImage,
      imagePreview,
      tagsInput,
      imageInput,
      isEditing,
      formData,
      handleImageUpload,
      removeImage,
      removeCurrentImage,
      updateTags,
      saveArticle,
      closeModal
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--training-center-white);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-large);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--training-center-gray-lighter);
}

.modal-header h2 {
  color: var(--training-center-primary);
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--training-center-gray-medium);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-gray-dark);
}

.modal-form {
  padding: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--training-center-gray-dark);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  font-family: var(--training-center-font-secondary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--training-center-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 0.85rem;
  color: var(--training-center-gray-medium);
  margin-top: var(--spacing-xs);
}

.image-upload {
  border: 2px dashed var(--training-center-gray-lighter);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  text-align: center;
  transition: border-color 0.3s ease;
}

.image-upload:hover {
  border-color: var(--training-center-primary);
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  color: var(--training-center-gray-medium);
  transition: color 0.3s ease;
}

.file-label:hover {
  color: var(--training-center-primary);
}

.file-icon {
  font-size: 2rem;
}

.file-text {
  font-weight: 500;
}

.image-preview,
.current-image {
  margin-top: var(--spacing-lg);
  position: relative;
  display: inline-block;
}

.preview-img,
.current-img {
  max-width: 200px;
  max-height: 150px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-subtle);
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--training-center-danger);
  color: var(--training-center-white);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  margin-bottom: 0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: var(--training-center-primary);
}

.checkbox-text {
  font-weight: 500;
  color: var(--training-center-gray-dark);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--training-center-gray-lighter);
}

.btn-cancel,
.btn-save {
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-cancel {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-gray-dark);
}

.btn-cancel:hover {
  background: var(--training-center-gray-medium);
  color: var(--training-center-white);
}

.btn-save {
  background: var(--training-center-primary);
  color: var(--training-center-white);
}

.btn-save:hover:not(:disabled) {
  background: var(--training-center-primary-dark);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>
