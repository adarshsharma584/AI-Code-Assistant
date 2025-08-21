# AI Code Assistant - Backend

## Overview

The backend of AI Code Assistant is built with Node.js and Express, providing a robust API for user authentication, code analysis, and AI-powered learning features. It integrates with MongoDB for data persistence and Google's Gemini API for AI capabilities.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API
- **API Documentation**: Swagger/OpenAPI
- **Package Manager**: npm
- **Environment Management**: dotenv
- **Code Quality**: ESLint, Prettier

## Project Structure

```
backend/
├── config/               # Configuration files
│   └── db.config.js      # Database configuration
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── chat.controller.js
│   └── user.controller.js
├── middlewares/          # Custom middleware
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/               # MongoDB models
│   ├── user.model.js
│   ├── chat.model.js
│   └── message.model.js
├── routes/               # API routes
│   ├── auth.route.js
│   ├── chat.route.js
│   └── user.route.js
├── services/            # Business logic
│   ├── ai.service.js
│   └── user.service.js
├── utils/               # Utility functions
│   ├── dbConnection.js
│   ├── errorHandler.js
│   └── logger.js
├── .env.example        # Environment variables example
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── package.json        # Project dependencies
└── index.js           # Application entry point
```

## Data Flow

1. **Request Handling**:
   - Incoming HTTP requests are received by Express
   - Request is routed to the appropriate controller
   - Middleware processes the request (authentication, validation, etc.)

2. **Business Logic**:
   - Controllers call service layer for business logic
   - Services interact with models for database operations
   - External API calls (like Gemini AI) are made from services

3. **Response Generation**:
   - Processed data is sent back to the client
   - Error handling middleware catches and processes errors
   - Response is formatted according to API standards

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB Atlas account
- Google Cloud account (for Gemini API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarshsharma584/ai-code-assistant.git
   cd ai-code-assistant/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   JWT_COOKIE_EXPIRES=30
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## API Documentation

### Base URL
`http://localhost:5000/api/v1`

### Authentication
All endpoints except `/auth/*` require a valid JWT token in the `Authorization` header.



## Security

- **Authentication**: JWT-based stateless authentication
- **Password Hashing**: bcrypt with 10 salt rounds
- **CORS**: Configured to allow requests from trusted origins


## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Chats Collection
```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User' },
  title: String,
  messages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  tags: [String],
  isArchived: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication

#### Register User
- **URL**: `/auth/register`
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**:
  ```json
  {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "progress": 0,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "User registered successfully"
  }
  ```

#### Login User
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**:
  ```json
  {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "progress": 0,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "User logged in successfully"
  }
  ```

#### Logout User
- **URL**: `/api/v1/auth/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "User logged out successfully"
  }
  ```

### Learning Features Endpoints

> **Note:** The following endpoints are planned for future implementation as part of the AI Code Assistant's learning features.

#### Code Review
- **URL**: `/api/v1/code/review`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "code": "function sum(a, b) { return a + b; }",
    "language": "javascript"
  }
  ```
- **Success Response**:
  ```json
  {
    "review": {
      "summary": "Your code is correct and follows good practices.",
      "suggestions": [
        {
          "line": 1,
          "message": "Consider adding parameter type validation",
          "severity": "suggestion"
        }
      ],
      "bestPractices": [
        "Add JSDoc comments for better documentation"
      ]
    }
  }
  ```

#### Code Explanation
- **URL**: `/api/v1/code/explain`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "code": "function quickSort(arr) { /* sorting algorithm */ }",
    "language": "javascript"
  }
  ```
- **Success Response**:
  ```json
  {
    "explanation": {
      "overview": "This function implements the QuickSort algorithm, which is a divide-and-conquer sorting algorithm.",
      "lineByLine": [
        {
          "line": 1,
          "explanation": "Function declaration for quickSort that takes an array parameter."
        }
      ],
      "complexity": {
        "time": "O(n log n) average case",
        "space": "O(log n)"
      },
      "concepts": [
        "Divide and conquer",
        "Recursion",
        "Partitioning"
      ]
    }
  }
  ```

#### Generate Learning Materials
- **URL**: `/api/v1/learn/materials`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "topic": "Recursion",
    "level": "intermediate"
  }
  ```
- **Success Response**:
  ```json
  {
    "materials": {
      "title": "Understanding Recursion in Programming",
      "content": "Recursion is a programming technique where a function calls itself...",
      "examples": [
        {
          "title": "Factorial calculation",
          "code": "function factorial(n) { if (n <= 1) return 1; return n * factorial(n-1); }",
          "explanation": "This recursive function calculates the factorial of a number."
        }
      ],
      "exercises": [
        {
          "description": "Implement a recursive function to calculate Fibonacci numbers",
          "difficulty": "medium"
        }
      ]
    }
  }
  ```

#### Generate Quiz
- **URL**: `/api/v1/learn/quiz`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "topic": "JavaScript Arrays",
    "difficulty": "beginner",
    "questionCount": 5
  }
  ```
- **Success Response**:
  ```json
  {
    "quiz": {
      "title": "JavaScript Arrays Quiz",
      "questions": [
        {
          "id": 1,
          "question": "Which method adds an element to the end of an array?",
          "options": ["push()", "pop()", "shift()", "unshift()"],
          "correctAnswer": "push()",
          "explanation": "The push() method adds one or more elements to the end of an array and returns the new length of the array."
        }
      ]
    }
  }
  ```

#### User Progress
- **URL**: `/api/v1/user/progress`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Success Response**:
  ```json
  {
    "progress": {
      "overall": 65,
      "topics": [
        {
          "name": "JavaScript Basics",
          "progress": 90,
          "completedLessons": 9,
          "totalLessons": 10
        },
        {
          "name": "Data Structures",
          "progress": 40,
          "completedLessons": 4,
          "totalLessons": 10
        }
      ],
      "recentActivity": [
        {
          "type": "quiz",
          "topic": "JavaScript Arrays",
          "score": 80,
          "date": "2023-06-25T14:30:00.000Z"
        }
      ]
    }
  }
  ```

## Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Optional technical error details"
}
```

### Common Error Status Codes

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Getting Started

1. Register for an account
2. Explore available coding topics
3. Practice coding with AI assistance
4. Get your code reviewed
5. Generate study materials
6. Test your knowledge with quizzes

## Future Enhancements

- Collaborative coding sessions
- Peer code review facilitation
- Expanded programming language support
- Integration with popular IDEs
- Gamification elements for increased engagement

---

AI Code Assistant is committed to making coding education more accessible, interactive, and effective for students at all levels of expertise. By combining AI technology with educational best practices, we aim to create a new standard for programming education.