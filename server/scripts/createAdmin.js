const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../api/models/UserModel')

// Connect to database
const db = process.env.MONGODB_URI || "mongodb://localhost:27017/training-center"

async function createAdmin() {
   try {
      await mongoose.connect(db)
      console.log('Connected to database')
      
      // Check if admin already exists
      const existingAdmin = await User.findOne({ role: 'admin' })
      
      if (existingAdmin) {
         console.log('Admin user already exists:')
         console.log(`Email: ${existingAdmin.email}`)
         console.log(`Name: ${existingAdmin.name}`)
         console.log(`Role: ${existingAdmin.role}`)
         return
      }
      
      // Create admin user
      const adminData = {
         name: 'Admin User',
         email: 'admin@vina-et.com',
         password: 'admin123', // Change this to a secure password
         role: 'admin'
      }
      
      const admin = new User(adminData)
      await admin.save()
      
      console.log('Admin user created successfully!')
      console.log(`Email: ${admin.email}`)
      console.log(`Password: admin123`)
      console.log(`Role: ${admin.role}`)
      console.log('\n⚠️  IMPORTANT: Change the password after first login!')
      
   } catch (error) {
      console.error('Error creating admin user:', error)
   } finally {
      await mongoose.disconnect()
      console.log('Disconnected from database')
   }
}

// Run the script
createAdmin()
