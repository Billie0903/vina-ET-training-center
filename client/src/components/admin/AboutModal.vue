<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit About Section' : 'Create About Section' }}</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="saveSection" class="modal-form">
        <div class="form-group">
          <label for="section">Section Type *</label>
          <select
            id="section"
            v-model="formData.section"
            required
            class="form-select"
            :disabled="isEditing"
          >
            <option value="">Select section type</option>
            <option value="hero">Hero Section</option>
            <option value="history">Our History</option>
            <option value="mission">Our Mission</option>
            <option value="numbers">By the Numbers</option>
            <option value="achievements">Our Achievements</option>
            <option value="vision">Our Vision</option>
            <option value="goals">Our Goals</option>
            <option value="values">Our Values</option>
            <option value="team">Our People</option>
            <option value="stats">Statistics</option>
          </select>
          <div class="form-help">
            {{ getSectionDescription(formData.section) }}
          </div>
        </div>

        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Enter section title"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="content">Content *</label>
          <textarea
            id="content"
            v-model="formData.content"
            required
            placeholder="Enter section content"
            rows="8"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="data">Additional Data (JSON)</label>
          <textarea
            id="data"
            v-model="dataInput"
            placeholder="Enter additional data as JSON (optional)"
            rows="6"
            class="form-textarea"
            @blur="updateData"
          ></textarea>
          <div class="form-help">
            Use this for structured data like statistics, team members, achievements, etc.
            <br>
            Example: {"stats": [{"number": "5000+", "label": "Students Trained"}]}
          </div>
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
  name: 'AboutModal',
  props: {
    section: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const dataInput = ref('')

    const isEditing = computed(() => !!props.section)

    const formData = reactive({
      section: '',
      title: '',
      content: '',
      data: {},
      published: true
    })

    const sectionDescriptions = {
      hero: 'Main hero section with title and subtitle',
      history: 'Timeline and history of the organization',
      mission: 'Mission statement and core values',
      numbers: 'Statistics and key numbers',
      achievements: 'Awards and recognitions',
      vision: 'Future vision and goals',
      goals: 'Specific goals and objectives',
      values: 'Core values and principles',
      team: 'Team members and staff information',
      stats: 'Statistical data and metrics'
    }

    const getSectionDescription = (section) => {
      return sectionDescriptions[section] || ''
    }

    // Initialize form data
    watch(() => props.section, (newSection) => {
      if (newSection) {
        formData.section = newSection.section || ''
        formData.title = newSection.title || ''
        formData.content = newSection.content || ''
        formData.data = newSection.data || {}
        formData.published = newSection.published !== undefined ? newSection.published : true
        dataInput.value = newSection.data ? JSON.stringify(newSection.data, null, 2) : ''
      } else {
        // Reset form for new section
        formData.section = ''
        formData.title = ''
        formData.content = ''
        formData.data = {}
        formData.published = true
        dataInput.value = ''
      }
    }, { immediate: true })

    const updateData = () => {
      if (dataInput.value.trim()) {
        try {
          formData.data = JSON.parse(dataInput.value)
        } catch (error) {
          console.error('Invalid JSON:', error)
          // Keep the previous valid data
        }
      } else {
        formData.data = {}
      }
    }

    const saveSection = async () => {
      loading.value = true
      try {
        if (isEditing.value) {
          await adminApi.about.update(props.section._id, formData)
        } else {
          await adminApi.about.create(formData)
        }

        emit('saved')
      } catch (error) {
        console.error('Error saving section:', error)
        alert('Error saving section. Please try again.')
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      loading,
      dataInput,
      isEditing,
      formData,
      getSectionDescription,
      updateData,
      saveSection,
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
  max-width: 700px;
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

.form-select:disabled {
  background: var(--training-center-gray-lighter);
  color: var(--training-center-gray-medium);
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: 'Courier New', monospace;
}

.form-help {
  font-size: 0.85rem;
  color: var(--training-center-gray-medium);
  margin-top: var(--spacing-xs);
  line-height: 1.4;
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
