const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

const JWT_SECRET = 'your-secret-key-here'

const authMiddleware = async (req, res, next) => {
   try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      
      if (!token) {
         return res.status(401).json({ message: 'No token provided, access denied' })
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
         return res.status(401).json({ message: 'Token is not valid' })
      }

      req.userId = user._id
      req.user = user
      next()
   } catch (error) {
      res.status(401).json({ message: 'Token is not valid' })
   }
}

module.exports = authMiddleware