const authMiddleware = require('./authMiddleware')
const User = require('../models/UserModel')

const adminMiddleware = async (req, res, next) => {
   try {
      // First apply auth middleware
      await new Promise((resolve, reject) => {
         authMiddleware(req, res, (err) => {
            if (err) reject(err)
            else resolve()
         })
      })
      
      // Double-check user role from database to ensure it's current
      if (!req.user || !req.user._id) {
         return res.status(401).json({ message: 'User not found' })
      }
      
      // Fetch fresh user data from database to verify admin role
      const user = await User.findById(req.user._id).select('role name email')
      
      if (!user) {
         return res.status(401).json({ message: 'User not found in database' })
      }
      
      if (user.role !== 'admin') {
         return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.',
            userRole: user.role 
         })
      }
      
      // Update req.user with fresh data and set userId for compatibility
      req.user = user
      req.userId = user._id
      next()
      
   } catch (error) {
      console.error('Admin middleware error:', error)
      res.status(401).json({ message: 'Authentication failed' })
   }
}

module.exports = adminMiddleware
