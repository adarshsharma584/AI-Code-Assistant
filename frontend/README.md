# AI Code Assistant - Frontend

## 🚀 Overview

The frontend of AI Code Assistant is a modern React application that provides an interactive interface for users to learn and practice coding with AI assistance. It features a clean, responsive design with real-time code editing and feedback.

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Code Editor**: Monaco Editor
- **Icons**: React Icons
- **Linting**: ESLint
- **Code Formatting**: Prettier

## 📁 Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, and other static assets
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Common components (buttons, inputs, etc.)
│   │   ├── layout/      # Layout components (header, footer, sidebar)
│   │   └── ui/          # UI components (modals, toasts, etc.)
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── Auth/        # Authentication pages
│   │   ├── Dashboard/   # Main dashboard
│   │   ├── Learn/       # Learning interface
│   │   └── Profile/     # User profile
│   ├── services/        # API service functions
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Application entry point
├── .env.example        # Environment variables example
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── index.html          # HTML template
├── package.json        # Project dependencies
└── vite.config.js      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adarshsharma584/ai-code-assistant.git
   cd ai-code-assistant/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   VITE_API_BASE_URL=https://ai-code-assistant-one.vercel.app/api/v1
   VITE_APP_NAME=AI Code Assistant
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## 🎨 Styling

The application uses Tailwind CSS for styling with the following conventions:

- **Utility-First**: Use Tailwind's utility classes for styling
- **Responsive Design**: Use responsive prefixes (sm:, md:, lg:, xl:)
- **Custom Themes**: Extend the theme in `tailwind.config.js`
- **Custom Components**: Create reusable styled components in `src/components/ui`

## 🌐 API Integration

API calls are handled through the `src/services` directory. Each service corresponds to a specific API resource.

Example service:

```javascript
// src/services/auth.service.js
import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
```

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 🚀 Deployment

1. Build the production version:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [React](https://reactjs.org/) for the UI library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Icons](https://react-icons.github.io/react-icons/) for icons
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
