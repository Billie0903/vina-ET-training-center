const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsSchema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true
   },
   content: {
      type: String,
      required: true
   },
   excerpt: {
      type: String,
      required: true,
      maxlength: 200
   },
   category: {
      type: String,
      required: true,
      enum: ['Announcement', 'Achievement', 'Partnership', 'Award', 'Course Update', 'Student Success', 'General'],
      default: 'General'
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   featured: {
      type: Boolean,
      default: false
   },
   published: {
      type: Boolean,
      default: false
   },
   publishedAt: {
      type: Date,
      default: null
   },
   imageUrl: {
      type: String,
      default: ''
   },
   image: {
      url: {
         type: String
      },
      filename: {
         type: String
      },
      originalName: {
         type: String
      }
   },
   tags: [{
      type: String,
      trim: true
   }],
   views: {
      type: Number,
      default: 0
   },
   slug: {
      type: String,
      unique: true,
      required: false
   }
}, {
   timestamps: true
})

// Create slug from title before saving
NewsSchema.pre('save', function(next) {
   if ((this.isModified('title') || this.isNew) && this.title) {
      let slug = this.title
         .toLowerCase()
         .replace(/[^a-z0-9 -]/g, '')
         .replace(/\s+/g, '-')
         .replace(/-+/g, '-')
         .trim('-')
      
      // Ensure slug is not empty
      if (!slug) {
         slug = 'news-' + Date.now()
      }
      
      this.slug = slug
   }
   next()
})

// Set publishedAt when published is set to true
NewsSchema.pre('save', function(next) {
   if (this.isModified('published') && this.published && !this.publishedAt) {
      this.publishedAt = new Date()
   }
   next()
})

module.exports = mongoose.model('News', NewsSchema, 'news')
