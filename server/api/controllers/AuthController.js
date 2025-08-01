const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-here'
const JWT_EXPIRES_IN = '7d'

// Generate JWT token
const generateToken = (userId) => {
   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Register new user
exports.register = async (req, res) => {
   try {
      const { name, email, password, role } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
         return res.status(400).json({ message: 'User already exists with this email' })
      }

      // Create new user
      const user = new User({ name, email, password, role })
      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.status(201).json({
         message: 'User registered successfully',
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
         }
      })
   } catch (error) {
      res.status(400).json({ message: error.message })
   }
}

// Login user
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(401).json({ message: 'Invalid email or password' })
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
         return res.status(401).json({ message: 'Invalid email or password' })
      }

      // Generate token
      const token = generateToken(user._id)

      res.json({
         message: 'Login successful',
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
         }
      })
   } catch (error) {
      res.status(500).json({ message: error.message })
   }
}

// Get current user profile
exports.getProfile = async (req, res) => {
   try {
      const user = await User.findById(req.userId).select('-password')
      res.json(user)
   } catch (error) {
      res.status(500).json({ message: error.message })
   }
}

// Logout (client-side will handle token removal)
exports.logout = (req, res) => {
   res.json({ message: 'Logout successful' })
}