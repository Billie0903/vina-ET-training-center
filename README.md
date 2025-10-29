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
   cd vina-ET-training-center-local
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

4. **Set up environment variables**
   
   **For the server:**
   ```bash
   cd server
   copy ..\server-env-template.txt .env
   ```
   
   **For the client:**
   ```bash
   cd client
   copy ..\client-env-template.txt .env.local
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your local machine at `mongodb://localhost:27017`

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on http://localhost:3000

7. **Start the frontend development server**
   ```bash
   cd client
   npm run serve
   ```
   The client will start on http://localhost:8080

### Quick Start (Windows)

For Windows users, you can use the provided startup scripts:

**Option 1: Batch Script**
```bash
start-local.bat
```

**Option 2: PowerShell Script**
```powershell
.\start-local.ps1
```

These scripts will automatically:
- Set up environment files if they don't exist
- Start the backend server
- Start the frontend server
- Open both in separate command windows

### Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error**
   - Make sure MongoDB is installed and running
   - Check if MongoDB is running on the default port 27017
   - You can start MongoDB with: `mongod`

2. **Port Already in Use**
   - If port 3000 is in use, change the PORT in server/.env
   - If port 8080 is in use, the Vue CLI will automatically use the next available port

3. **Environment Variables Not Loading**
   - Make sure you've copied the template files to .env and .env.local
   - Restart the servers after changing environment variables

4. **Dependencies Issues**
   - Delete node_modules folders and package-lock.json files
   - Run `npm install` again in both server and client directories

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

## License

This project is licensed under the MIT License.

## Project Link
Project Link: https://github.com/Billie0903/vina-ET-training-center
