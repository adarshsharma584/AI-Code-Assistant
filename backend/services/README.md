# AI Services Setup

## Gemini Flash 2.0 Integration

This directory contains services for integrating Google's Gemini Flash 2.0 AI model into the application.

### Files

- `gemini.service.js`: Core service for interacting with the Gemini API
- `prompt.service.js`: Specialized prompt functions for different use cases

### Environment Variables

To use these services, you need to set up the following environment variables in your `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### How to Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env` file

### Usage

#### Basic Usage

```javascript
import { generatePageContent } from '../services/gemini.service.js';

// Generate content for a specific page type
const response = await generatePageContent('learn', 'Explain JavaScript closures', { temperature: 0.7 });
```

#### Specialized Prompts

```javascript
import { generateQuiz, generateCodeReview } from '../services/prompt.service.js';

// Generate a quiz
const quiz = await generateQuiz('JavaScript Basics', 'JavaScript variables and data types', 'medium', 5);

// Generate a code review
const review = await generateCodeReview(codeString, 'javascript', 'This is a function to calculate factorial');
```

### System Prompts

The service includes specialized system prompts for four different page types:

1. **Learn**: For generating educational content on programming topics
2. **Review**: For code review and feedback
3. **Explain**: For explaining how code works
4. **Roadmap**: For creating personalized learning paths

Each prompt is optimized for its specific use case to provide the best possible AI responses.