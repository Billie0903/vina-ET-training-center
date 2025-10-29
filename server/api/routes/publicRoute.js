const express = require('express')
const newsController = require('../controllers/newsController')
const aboutController = require('../controllers/aboutController')

const publicRouter = express.Router()

// Public News Routes
publicRouter.get('/news', newsController.getAllNews)
publicRouter.get('/news/article/:slug', newsController.getNewsById)

// Public About Routes
publicRouter.get('/about', aboutController.getAboutContent)
publicRouter.get('/about/section/:section', aboutController.getAboutSection)

module.exports = publicRouter
