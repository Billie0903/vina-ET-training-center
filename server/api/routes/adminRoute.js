const express = require('express')
const multer = require('multer')
const path = require('path')
const adminMiddleware = require('../middleware/adminMiddleware')
const newsController = require('../controllers/newsController')
const aboutController = require('../controllers/aboutController')

// Configure multer for file uploads
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
   }
})

const upload = multer({ 
   storage: storage,
   limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
   },
   fileFilter: function (req, file, cb) {
      // Check if file is an image
      if (file.mimetype.startsWith('image/')) {
         cb(null, true)
      } else {
         cb(new Error('Only image files are allowed'), false)
      }
   }
})

const adminRouter = express.Router()

// Apply admin middleware to all routes
adminRouter.use(adminMiddleware)

// News Management Routes
adminRouter.get('/news', newsController.adminGetAllNews)
adminRouter.get('/news/:id', newsController.adminGetNewsById)
adminRouter.post('/news', upload.single('image'), newsController.createNews)
adminRouter.put('/news/:id', upload.single('image'), newsController.updateNews)
adminRouter.delete('/news/:id', newsController.deleteNews)

// About Content Management Routes
adminRouter.get('/about', aboutController.adminGetAboutContent)
adminRouter.get('/about/section/:id', aboutController.adminGetAboutSection)
adminRouter.post('/about/section', aboutController.upsertAboutSection)
adminRouter.put('/about/section/:id', aboutController.updateAboutSection)
adminRouter.delete('/about/section/:id', aboutController.deleteAboutSection)
adminRouter.post('/about/bulk-update', aboutController.bulkUpdateAboutSections)

module.exports = adminRouter
