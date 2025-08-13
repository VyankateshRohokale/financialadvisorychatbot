# Clau - Financial Advisory Chatbot

A comprehensive, AI-powered financial advisory platform built with Angular 17 that provides personalized financial guidance, analytics, and insights.

## 🚀 Features

- **AI-Powered Chat**: Integrated with Google Gemini 2.5 Flash API for intelligent financial guidance
- **Financial Dashboard**: Real-time analytics tracking income, net worth, and conversation metrics
- **AI Insights**: Generate comprehensive financial insights from conversation history
- **Multi-Page Navigation**: Chat, Dashboard, and Insights sections with seamless routing
- **State Management**: Persistent chat state and financial data across sessions
- **Professional Persona**: "Clau" - your dedicated financial advisor
- **Rich Formatting**: Tables, headers, bullet points, and visual cards for better readability
- **Quick Actions**: Pre-defined quick message buttons for common queries
- **Auto-scroll**: Smart scrolling with user control
- **Responsive Design**: Works seamlessly across devices

## 🛠️ Tech Stack

- **Framework**: Angular 17 (Standalone Components)
- **State Management**: Custom ChatStateService with RxJS
- **Routing**: Angular Router for multi-page navigation
- **AI Integration**: Google Generative AI SDK
- **Styling**: Custom CSS with responsive design
- **Markdown**: Marked.js for rich text formatting
- **HTTP Client**: Native Angular HTTP for API communication

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financial_advisory_chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `src/environments/environment.ts` with your backend URL
   ```typescript
   export const environment = {
     production: false,
     BACKEND_URL: 'http://localhost:8000'
   };
   ```

4. **Start development server**
   ```bash
   ng serve
   ```

5. **Open browser**
   - **Live Demo**: [https://financialadvisorychatbot.vercel.app/](https://financialadvisorychatbot.vercel.app/)
   - **Local Development**: Navigate to `http://localhost:4200`

## 🏗️ Build

```bash
# Development build
ng build

# Production build
ng build --prod
```


## 📁 Project Structure

```
src/
├── app/
│   ├── chat/                 # Chat interface component
│   ├── dashboard/            # Financial analytics dashboard
│   ├── insights/             # AI-generated insights page
│   ├── services/             # State management services
│   │   └── chat-state.service.ts
│   ├── sidebar/              # Navigation sidebar
│   ├── app.component.ts      # Root component with navigation
│   ├── app.routes.ts         # Multi-page routing configuration
│   └── app.config.ts         # Application configuration
├── environments/             # Environment configurations
└── assets/                   # Static assets and logos
```

## 🔧 Configuration

### Environment Variables
- `BACKEND_URL`: Backend API endpoint (default: http://localhost:8000)

### Key Components
- **ChatComponent**: Main chat interface with AI communication
- **DashboardComponent**: Financial analytics and metrics display
- **InsightsComponent**: AI-generated financial insights
- **ChatStateService**: Centralized state management for messages and data
- **AppComponent**: Root component with navigation header and routing

## 🎯 Usage

### Chat Interface
1. Navigate to the Chat section
2. Start typing your financial question
3. Press Enter or click Send
4. Receive AI-powered financial advice
5. Use quick action buttons for common queries

### Dashboard Analytics
1. Visit the Dashboard to view financial metrics
2. Track conversation statistics and topic analysis
3. Monitor extracted financial data (income, net worth)
4. View message counts and engagement metrics

### AI Insights
1. Navigate to Insights after having conversations
2. Generate comprehensive financial analysis
3. Review personalized recommendations
4. Export insights for future reference

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run tests in headless mode (CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Test with sample financial questions
# See TEST_SUITE.md for comprehensive test cases
```

## 📄 License

This project is licensed under the MIT License.

## 🚀 Live Demo

**Frontend**: [https://financialadvisorychatbot.vercel.app/](https://financialadvisorychatbot.vercel.app/)
**Backend API**: [https://clau-ai-backend.onrender.com](https://clau-ai-backend.onrender.com)
**API Docs**: [https://clau-ai-backend.onrender.com/docs](https://clau-ai-backend.onrender.com/docs)