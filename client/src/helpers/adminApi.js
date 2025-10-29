import api from './api'

// Admin API methods
const adminApi = {
  // News management
  news: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams(params).toString()
      return api.get(`/admin/news${queryParams ? '?' + queryParams : ''}`)
    },
    getById: (id) => api.get(`/admin/news/${id}`),
    create: (newsData) => {
      const formData = new FormData()
      
      // Add text fields
      Object.keys(newsData).forEach(key => {
        if (key !== 'image' && newsData[key] !== null && newsData[key] !== undefined) {
          if (Array.isArray(newsData[key])) {
            formData.append(key, JSON.stringify(newsData[key]))
          } else {
            formData.append(key, newsData[key])
          }
        }
      })
      
      // Add image if present
      if (newsData.image && newsData.image instanceof File) {
        formData.append('image', newsData.image)
      }
      
      return api.post('/admin/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    update: (id, newsData) => {
      const formData = new FormData()
      
      // Add text fields
      Object.keys(newsData).forEach(key => {
        if (key !== 'image' && newsData[key] !== null && newsData[key] !== undefined) {
          if (Array.isArray(newsData[key])) {
            formData.append(key, JSON.stringify(newsData[key]))
          } else {
            formData.append(key, newsData[key])
          }
        }
      })
      
      // Add image if present
      if (newsData.image && newsData.image instanceof File) {
        formData.append('image', newsData.image)
      }
      
      return api.put(`/admin/news/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    delete: (id) => api.delete(`/admin/news/${id}`)
  },

  // About content management
  about: {
    getAll: () => api.get('/admin/about'),
    getById: (id) => api.get(`/admin/about/section/${id}`),
    create: (sectionData) => api.post('/admin/about/section', sectionData),
    update: (id, sectionData) => api.put(`/admin/about/section/${id}`, sectionData),
    delete: (id) => api.delete(`/admin/about/section/${id}`),
    bulkUpdate: (sections) => api.post('/admin/about/bulk-update', { sections })
  }
}

// Public API methods
const publicApi = {
  // Public news
  news: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams(params).toString()
      return api.get(`/public/news${queryParams ? '?' + queryParams : ''}`)
    },
    getBySlug: (slug) => api.get(`/public/news/article/${slug}`)
  },

  // Public about content
  about: {
    getAll: () => api.get('/public/about'),
    getSection: (section) => api.get(`/public/about/section/${section}`)
  }
}

export { adminApi, publicApi }
export default adminApi
