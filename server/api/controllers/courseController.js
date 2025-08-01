const Course = require('../models/courseModel')

// Get all courses
exports.index = async (req, res) => {
   try {
      const courses = await Course.find().sort({ createdAt: -1 })
      res.json(courses)
   } catch (error) {
      res.status(500).json({ message: error.message })
   }
}

// Get single course
exports.show = async (req, res) => {
   try {
      const course = await Course.findById(req.params.id)
      if (!course) {
         return res.status(404).json({ message: 'Course not found' })
      }
      res.json(course)
   } catch (error) {
      res.status(500).json({ message: error.message })
   }
}

// Create new course
exports.store = async (req, res) => {
   try {
      const course = new Course(req.body)
      const savedCourse = await course.save()
      res.status(201).json(savedCourse)
   } catch (error) {
      res.status(400).json({ message: error.message })
   }
}

// Update course
exports.update = async (req, res) => {
   try {
      const course = await Course.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true, runValidators: true }
      )
      if (!course) {
         return res.status(404).json({ message: 'Course not found' })
      }
      res.json(course)
   } catch (error) {
      res.status(400).json({ message: error.message })
   }
}

// Delete course
exports.destroy = async (req, res) => {
   try {
      const course = await Course.findByIdAndDelete(req.params.id)
      if (!course) {
         return res.status(404).json({ message: 'Course not found' })
      }
      res.json({ message: 'Course deleted successfully' })
   } catch (error) {
      res.status(500).json({ message: error.message })
   }
}