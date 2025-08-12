# Clau - Financial Advisory Chatbot

A modern, AI-powered financial advisory chatbot built with Angular 17 that provides personalized financial guidance and advice.

## 🚀 Features

- **AI-Powered Advice**: Integrated with Google Gemini 2.5 Flash API for intelligent financial guidance
- **Real-time Chat**: Smooth, responsive chat interface with rich markdown support
- **Professional Persona**: "Clau" - your dedicated financial advisor
- **Rich Formatting**: Tables, headers, bullet points, and visual cards for better readability
- **Quick Actions**: Pre-defined quick message buttons for common queries
- **Auto-scroll**: Smart scrolling with user control
- **Responsive Design**: Works seamlessly across devices

## 🛠️ Tech Stack

- **Framework**: Angular 17 (Standalone Components)
- **Styling**: Custom CSS
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
│   ├── chat/                 # Chat component
│   │   ├── chat.component.ts
│   │   ├── chat.component.html
│   │   └── chat.component.css
│   ├── app.component.ts      # Root component
│   └── app.routes.ts         # Routing configuration
├── environments/             # Environment configurations
└── assets/                   # Static assets
```

## 🔧 Configuration

### Environment Variables
- `BACKEND_URL`: Backend API endpoint (default: http://localhost:8000)

### Key Components
- **ChatComponent**: Main chat interface with message handling
- **AppComponent**: Root component with navigation and layout

## 🎯 Usage

1. Start typing your financial question
2. Press Enter or click Send
3. Receive AI-powered financial advice
4. Use quick action buttons for common queries
5. Scroll through chat history with auto-scroll features

## 🧪 Testing

```bash
# Run unit tests
ng test

# Test with sample financial questions
# See TEST_SUITE.md for comprehensive test cases
```

## 📄 License

This project is licensed under the MIT License.