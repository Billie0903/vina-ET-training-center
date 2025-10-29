const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true
   },
   description: {
      type: String,
      required: true
   },
   instructor: {
      type: String,
      required: true,
      trim: true
   },
   duration: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true,
      min: 0
   },
   category: {
      type: String,
      required: true
   },
   startDate: {
      type: Date,
      required: true
   },
   maxStudents: {
      type: Number,
      required: true,
      min: 1
   },
   imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
   },
   images: [{
      url: {
         type: String,
         required: true
      },
      filename: {
         type: String,
         required: true
      },
      originalName: {
         type: String,
         required: true
      }
   }],
   previewImage: {
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
   // imageFilename: {
   //    type: String,
   //    default: ''
   // },
}, {
   timestamps: true
})

module.exports = mongoose.model('Course', CourseSchema, 'courses')