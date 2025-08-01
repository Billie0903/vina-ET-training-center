module.exports = (app) => {
   const courseController = require('../controllers/courseController')
   const authMiddleware = require('../middleware/authMiddleware')

   // Public routes (anyone can view courses)
   app.get('/api/courses', courseController.index) 
   app.get('/api/courses/:id', courseController.show)

   // Protected routes (only authenticated users can modify)
   app.post('/api/courses', authMiddleware, courseController.store)
   app.put('/api/courses/:id', authMiddleware, courseController.update)
   app.delete('/api/courses/:id', authMiddleware, courseController.destroy)
}