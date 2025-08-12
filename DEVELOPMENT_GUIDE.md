# Development Guide

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Initial Setup
1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd financial_advisory_chatbot
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Update src/environments/environment.ts
   export const environment = {
     production: false,
     BACKEND_URL: 'http://localhost:8000'
   };
   ```

3. **Start Development Server**
   ```bash
   ng serve
   ```

## Project Structure

```
src/
├── app/
│   ├── chat/                    # Chat component
│   ├── app.component.ts         # Root component
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts           # Routing setup
├── environments/               # Environment configs
├── assets/                    # Static assets
└── styles.css                # Global styles
```

## Development Workflow

### Code Standards
- Use strict TypeScript typing
- Follow Angular style guide
- Implement responsive design
- Maintain accessibility standards

### API Integration
```typescript
async sendMessage(): Promise<void> {
  const response = await fetch(`${this.backend_url}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: contents })
  });
  
  const data = await response.json();
}
```

## Testing
```bash
ng test    # Unit tests
ng build   # Build verification
```

## Build and Deployment
```bash
ng build --configuration production
```