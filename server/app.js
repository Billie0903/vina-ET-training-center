require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const mongoose = require('mongoose')
const db = process.env.MONGODB_URI
mongoose.connect(db)
   .then(console.log('Connect DB succeed !'))
   .catch(err => console.log('Connect db failed ! ' + err))

// Routes
const courseRouter = require("./api/routes/courseRoute")
const authRouter = require("./api/routes/AuthRoute")
const uploadRouter = require("./api/routes/uploadRoute")

courseRouter(app)
authRouter(app)
uploadRouter(app)

const port = 3000

app.listen(port, () => {
   console.log("Server is running at http://localhost:" + port)
})