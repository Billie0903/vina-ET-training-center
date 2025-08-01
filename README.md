# Training Center

A full-stack web application for managing training courses and user authentication. Built with Vue.js frontend and Node.js/Express backend with MongoDB database.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Course Management**: Create, read, update, and delete training courses
- **File Upload**: Upload course images and materials
- **Responsive Design**: Modern UI with animations and responsive layout
- **Real-time Updates**: Dynamic course updates and user interactions

## Tech Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **Vue Router**: Client-side routing
- **Vuex**: State management
- **CSS3**: Custom styling with animations
- **JavaScript**: ES6+ features

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload middleware
- **JWT**: JSON Web Tokens for authentication

## Project Structure

```
training-center/
├── client/                 # Vue.js frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── assets/        # Images and static assets
│   │   ├── helpers/       # API helper functions
│   │   ├── router.js      # Vue Router configuration
│   │   ├── store/         # Vuex store modules
│   │   ├── styles/        # CSS files
│   │   ├── utils/         # Utility functions
│   │   ├── views/         # Vue components
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Application entry point
│   ├── package.json       # Frontend dependencies
│   └── jsconfig.json      # JavaScript configuration
├── server/                # Node.js backend
│   ├── api/               # API routes and controllers
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   └── routes/        # API routes
│   ├── uploads/           # File upload directory
│   ├── app.js            # Express server setup
│   └── package.json      # Backend dependencies
└── README.md             # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd training-center
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd client
   npm run serve
   ```

## Usage

1. Open your browser and navigate to `http://localhost:8080`
2. Register a new account or login with existing credentials
3. Create, edit, and manage training courses
4. Upload course images and materials
5. View and interact with the course catalog

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your_username/training-center](https://github.com/your_username/training-center) 