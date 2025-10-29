module.exports = (app) => {
  const uploadController = require('../controllers/uploadController')
  const authMiddleware = require('../middleware/authMiddleware')

  // Upload image (protected route)
  app.post('/api/upload/image', authMiddleware, uploadController.uploadImage, uploadController.handleImageUpload)
  
  // Delete image (protected route)
  app.delete('/api/upload/image/:filename', authMiddleware, uploadController.deleteImage)
} 