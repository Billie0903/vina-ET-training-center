module.exports = (app) => {
   const authController = require('../controllers/AuthController')
   const authMiddleware = require('../middleware/authMiddleware')

   // Public routes
   app.post('/api/auth/register', authController.register)
   app.post('/api/auth/login', authController.login)
   
   // Protected routes
   app.get('/api/auth/profile', authMiddleware, authController.getProfile)
   app.post('/api/auth/logout', authMiddleware, authController.logout)
}