# AI Code Assistant

## Overview

AI Code Assistant is an innovative web application designed to help students learn and practice coding with the assistance of artificial intelligence. This platform provides a comprehensive learning environment where students can enhance their programming skills through interactive features, personalized feedback, and guided practice.

## 🚀 Features

### User Authentication
- 🔐 Secure registration and login system
- 📊 Personal progress tracking
- 🛤️ Customized learning paths based on user history

### AI-Powered Learning Tools

#### Code Review
- 🔍 Real-time code analysis and feedback
- 🐞 Identification of bugs and logical errors
- ⚡ Suggestions for code optimization and best practices
- 📝 Explanation of potential improvements

#### Code Explanation
- 📖 Detailed breakdown of code functionality
- 🔢 Line-by-line explanation of complex algorithms
- 🎨 Visualization of code execution flow
- 🔑 Identification of key programming concepts used

#### Learning Materials Generation
- 📚 AI-generated notes on programming topics
- 🎯 Customized study materials based on student's skill level
- 🧠 Comprehensive explanations of programming concepts
- 💡 Practical examples to reinforce theoretical knowledge

#### Interactive Quizzes
- ❓ Topic-specific quiz generation
- 📈 Adaptive difficulty based on student performance
- ✅ Immediate feedback on quiz answers
- 📖 Explanation of correct solutions

## 🎯 Benefits for Students

### Personalized Learning Experience
- 🎓 Learn at your own pace with customized content
- 🎯 Focus on areas that need improvement
- 📊 Track progress and celebrate achievements

### Practical Skill Development
- 💻 Apply theoretical knowledge to real coding problems
- 🔍 Develop debugging and problem-solving skills
- 🏆 Learn industry best practices and coding standards

### Immediate Feedback
- ⚡ Get instant feedback on your code
- ❓ Understand mistakes and how to correct them
- 🔄 Reinforce learning through guided practice

## 🛠️ Technical Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas (Cloud Database)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google's Gemini API
- **API Documentation**: Swagger/OpenAPI
- **Package Manager**: npm
- **Environment Management**: dotenv
- **Code Quality**: ESLint, Prettier

### Frontend
- **Framework**: React.js with Vite
- **State Management**: React Context API
- **UI Components**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Form Handling**: React Hook Form
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons

## 🏗️ Project Architecture

The application follows a modern microservices architecture with clear separation of concerns:

```
                ┌────────────────────────────┐
                │        Client (UI)         │
                │ (Learn / Review / Explain  │
                │  / Roadmap Pages + Sidebar)│
                └───────────┬────────────────┘
                            │
  ─────────── User sends a message ───────────
                            │
                            ▼
                ┌────────────────────────────┐
                │        API Gateway          │
                │   (Express.js / Fastify)   │
                └───────────┬────────────────┘
                            │
                            ▼
                ┌────────────────────────────┐
                │      Auth Middleware        │
                │  (Check JWT → userId)       │
                └───────────┬────────────────┘
                            │
          ┌─────────────────┼───────────────────┐
          ▼                 ▼                   ▼
 ┌────────────────┐  ┌────────────────────────┐   ┌───────────────────────────┐
 │ Auth Service   │  │       Chat Service     │   │        AI Service         │
 │  (validate     │  │ (Save user/AI msgs in │   │ (Send msg → Gemini API    │
 │   identity)    │  │   DB under sessionId) │   │  → Receive AI response)   │
 └────────────────┘  └────────────────────────┘   └───────────────────────────┘
                            │                                 │
                            │                                 ▼
                            │                      ┌───────────────────────────┐
                            │                      │  External AI API          │
                            │                      │  (Google Gemini / GPT)    │
                            │                      └───────────────────────────┘
                            │
                            ▼
                ┌────────────────────────────┐
                │     Chat Database (Mongo)  │
                │   Collection: Chats        │
                │   {                        │
                │     _id: ObjectId,         │
                │     sessionId: string,     │
                │     userId: string,        │
                │     messages: [            │
                │       {role: "user",       │
                │        content: "...",     │
                │        timestamp: ...},    │
                │       {role: "ai",         │
                │        content: "...",     │
                │        timestamp: ...}     │
                │     ],                     │
                │     page: "learn"          │
                │   }                        │
                └────────────────────────────┘
```

## 📦 Data Flow

1. **User Authentication**:
   - User registers/logs in through the React frontend
   - JWT token is generated and stored securely
   - All subsequent requests include the JWT for authentication

2. **Chat Interaction**:
   - User messages are sent to the Express backend
   - Auth middleware validates the JWT
   - Chat service saves the message to MongoDB
   - AI service processes the message using Gemini API
   - AI response is saved and returned to the user

3. **Data Persistence**:
   - All chat sessions are stored in MongoDB
   - User progress and preferences are tracked
   - Analytics data is collected for personalized recommendations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Google Cloud account (for Gemini API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarshsharma584/ai-code-assistant.git
   cd ai-code-assistant
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your credentials
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update .env with your API URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB Atlas for database hosting
- React and Node.js communities for amazing open-source tools

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.
