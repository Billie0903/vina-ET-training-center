# Training Center - Backend API

This is the backend API for the Training Center application, deployed on Railway.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Course Management**: Create, read, update, and delete training courses
- **File Upload**: Upload course images and materials
- **JWT Authentication**: Secure token-based authentication

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload middleware
- **JWT**: JSON Web Tokens for authentication

## Project Structure

```
server/
├── api/               # API routes and controllers
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   └── routes/        # API routes
├── uploads/           # File upload directory
├── app.js            # Express server setup
└── package.json      # Backend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### File Upload
- `POST /api/upload` - Upload course images

## Environment Variables

Required environment variables for Railway:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## Frontend Repository

The frontend Vue.js application is deployed separately on Netlify.
Repository: [https://github.com/Billie0903/vina-ET-training-center](https://github.com/Billie0903/vina-ET-training-center) 