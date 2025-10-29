// Load environment variables
require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')

const cors = require('cors')
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const mongoose = require('mongoose')
const db = process.env.MONGODB_URI || "mongodb://localhost:27017/training-center"
mongoose.connect(db)
   .then(console.log('Connect DB succeed !'))
   .catch(err => console.log('Connect db failed ! ' + err))

// Routes
const courseRouter = require("./api/routes/courseRoute")
const authRouter = require("./api/routes/AuthRoute")
const uploadRouter = require("./api/routes/uploadRoute")
const adminRouter = require("./api/routes/adminRoute")
const publicRouter = require("./api/routes/publicRoute")

courseRouter(app)
authRouter(app)
uploadRouter(app)

// Admin routes (protected)
app.use('/api/admin', adminRouter)

// Public routes
app.use('/api/public', publicRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
   console.log("Server is running at http://localhost:" + port)
})