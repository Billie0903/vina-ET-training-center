const News = require('../models/newsModel')
const User = require('../models/UserModel')

// Get all news (public)
const getAllNews = async (req, res) => {
   try {
      const { page = 1, limit = 10, category, featured } = req.query
      const query = { published: true }
      
      if (category) query.category = category
      if (featured === 'true') query.featured = true
      
      const news = await News.find(query)
         .populate('author', 'name')
         .sort({ publishedAt: -1, createdAt: -1 })
         .limit(limit * 1)
         .skip((page - 1) * limit)
         .exec()
      
      // Fix image URLs for existing articles
      const baseUrl = `${req.protocol}://${req.get('host')}`
      news.forEach(article => {
         if (article.image && article.image.url && !article.image.url.startsWith('http')) {
            article.image.url = `${baseUrl}${article.image.url}`
         }
      })
      
      const total = await News.countDocuments(query)
      
      res.json({
         news,
         totalPages: Math.ceil(total / limit),
         currentPage: page,
         total
      })
   } catch (error) {
      res.status(500).json({ message: 'Error fetching news', error: error.message })
   }
}

// Get single news article (public)
const getNewsById = async (req, res) => {
   try {
      const { slug } = req.params
      const news = await News.findOne({ slug, published: true })
         .populate('author', 'name')
         .exec()
      
      if (!news) {
         return res.status(404).json({ message: 'News article not found' })
      }
      
      // Fix image URL if needed
      const baseUrl = `${req.protocol}://${req.get('host')}`
      if (news.image && news.image.url && !news.image.url.startsWith('http')) {
         news.image.url = `${baseUrl}${news.image.url}`
      }
      
      // Increment views
      news.views += 1
      await news.save()
      
      res.json(news)
   } catch (error) {
      res.status(500).json({ message: 'Error fetching news article', error: error.message })
   }
}

// Admin: Get all news (including unpublished)
const adminGetAllNews = async (req, res) => {
   try {
      const { page = 1, limit = 10, category, published } = req.query
      const query = {}
      
      if (category) query.category = category
      if (published !== undefined) query.published = published === 'true'
      
      const news = await News.find(query)
         .populate('author', 'name')
         .sort({ createdAt: -1 })
         .limit(limit * 1)
         .skip((page - 1) * limit)
         .exec()
      
      // Fix image URLs for existing articles
      const baseUrl = `${req.protocol}://${req.get('host')}`
      news.forEach(article => {
         if (article.image && article.image.url && !article.image.url.startsWith('http')) {
            article.image.url = `${baseUrl}${article.image.url}`
         }
      })
      
      const total = await News.countDocuments(query)
      
      res.json({
         news,
         totalPages: Math.ceil(total / limit),
         currentPage: page,
         total
      })
   } catch (error) {
      res.status(500).json({ message: 'Error fetching news', error: error.message })
   }
}

// Admin: Create news article
const createNews = async (req, res) => {
   try {
      const { title, content, excerpt, category, featured, published, tags } = req.body
      
      // Validate required fields
      if (!title || !content || !excerpt || !category) {
         return res.status(400).json({ 
            message: 'Missing required fields: title, content, excerpt, and category are required' 
         })
      }
      
      if (!req.userId) {
         return res.status(401).json({ message: 'User ID not found in request' })
      }
      
      // Generate slug from title
      const generateSlug = (title) => {
         return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
      }
      
      const newsData = {
         title,
         content,
         excerpt,
         category,
         featured: featured === 'true' || featured === true,
         published: published === 'true' || published === true,
         tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
         author: req.userId,
         slug: generateSlug(title)
      }
      
      // Handle image upload if present
      if (req.file) {
         const baseUrl = `${req.protocol}://${req.get('host')}`
         newsData.image = {
            url: `${baseUrl}/uploads/${req.file.filename}`,
            filename: req.file.filename,
            originalName: req.file.originalname
         }
      }
      
      const news = new News(newsData)
      await news.save()
      
      const populatedNews = await News.findById(news._id).populate('author', 'name')
      
      res.status(201).json({
         message: 'News article created successfully',
         news: populatedNews
      })
   } catch (error) {
      res.status(500).json({ message: 'Error creating news article', error: error.message })
   }
}

// Admin: Update news article
const updateNews = async (req, res) => {
   try {
      const { id } = req.params
      const { title, content, excerpt, category, featured, published, tags } = req.body
      
      const updateData = {
         title,
         content,
         excerpt,
         category,
         featured: featured || false,
         published: published || false,
         tags: tags || []
      }
      
      // Handle image upload if present
      if (req.file) {
         const baseUrl = `${req.protocol}://${req.get('host')}`
         updateData.image = {
            url: `${baseUrl}/uploads/${req.file.filename}`,
            filename: req.file.filename,
            originalName: req.file.originalname
         }
      }
      
      const news = await News.findByIdAndUpdate(
         id,
         updateData,
         { new: true, runValidators: true }
      ).populate('author', 'name')
      
      if (!news) {
         return res.status(404).json({ message: 'News article not found' })
      }
      
      res.json({
         message: 'News article updated successfully',
         news
      })
   } catch (error) {
      res.status(500).json({ message: 'Error updating news article', error: error.message })
   }
}

// Admin: Delete news article
const deleteNews = async (req, res) => {
   try {
      const { id } = req.params
      
      const news = await News.findByIdAndDelete(id)
      
      if (!news) {
         return res.status(404).json({ message: 'News article not found' })
      }
      
      res.json({ message: 'News article deleted successfully' })
   } catch (error) {
      res.status(500).json({ message: 'Error deleting news article', error: error.message })
   }
}

// Admin: Get single news article for editing
const adminGetNewsById = async (req, res) => {
   try {
      const { id } = req.params
      const news = await News.findById(id).populate('author', 'name')
      
      if (!news) {
         return res.status(404).json({ message: 'News article not found' })
      }
      
      res.json(news)
   } catch (error) {
      res.status(500).json({ message: 'Error fetching news article', error: error.message })
   }
}

module.exports = {
   getAllNews,
   getNewsById,
   adminGetAllNews,
   createNews,
   updateNews,
   deleteNews,
   adminGetNewsById
}
