const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AboutSchema = new Schema({
   section: {
      type: String,
      required: true,
      enum: ['hero', 'history', 'mission', 'numbers', 'achievements', 'vision', 'goals', 'values', 'team', 'stats'],
      unique: true
   },
   title: {
      type: String,
      required: true,
      trim: true
   },
   content: {
      type: String,
      required: true
   },
   data: {
      type: Schema.Types.Mixed,
      default: {}
   },
   lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   published: {
      type: Boolean,
      default: true
   }
}, {
   timestamps: true
})

// Index for efficient queries
AboutSchema.index({ section: 1, published: 1 })

module.exports = mongoose.model('About', AboutSchema, 'about')
