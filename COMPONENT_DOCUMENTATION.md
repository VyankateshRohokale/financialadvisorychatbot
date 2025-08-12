# Component Documentation

## Overview
The Clau Financial Advisory Chatbot frontend is built with Angular 17 using standalone components for a modern, modular architecture.

## Components

### AppComponent
**File**: `src/app/app.component.ts`

Main application component that provides the overall layout and navigation.

**Properties:**
- `title: string` - Application title ("CLAU")
- `isDropdownOpen: boolean` - Controls dropdown menu visibility

**Methods:**
- `toggleDropdown()` - Toggles the dropdown menu state
- `sendQuickMessage(message: string)` - Handles quick message functionality
- `onDocumentClick(event: Event)` - Closes dropdown when clicking outside

**Features:**
- Responsive navigation header
- Dropdown menu with quick actions
- Document click handling for UX

---

### ChatComponent
**File**: `src/app/chat/chat.component.ts`

Core chat interface component handling user interactions and AI responses.

**Properties:**
- `userInput: string` - Current user input text
- `messages: Array` - Chat message history
- `isLoading: boolean` - Loading state indicator
- `isInitialLoad: boolean` - First-time load state
- `backend_url: string` - Backend API endpoint

**Key Methods:**

#### `sendMessage(): Promise<void>`
Processes user messages and communicates with backend API.
- Validates input
- Adds user message to chat
- Calls backend `/ask` endpoint
- Processes markdown response
- Handles errors gracefully

#### `sendQuickMessage(message: string): void`
Sends predefined quick messages.

#### `onInputKeydown(event: KeyboardEvent): void`
Handles Enter key submission (prevents Shift+Enter).

#### `clearChat(): void`
Resets chat state and message history.

**Auto-scroll Features:**
- `scrollToBottom()` - Smooth scroll to latest message
- `onMessagesScroll()` - Detects user scroll position
- `isNearBottom()` - Determines if auto-scroll should be enabled

**Lifecycle:**
- `ngOnInit()` - Focuses input on component initialization
- `ngAfterViewChecked()` - Handles auto-scrolling after DOM updates
- `ngOnDestroy()` - Cleanup scroll timeouts

## Services

### Environment Configuration
**File**: `src/environments/environment.ts`

Manages environment-specific settings.

```typescript
export const environment = {
  production: false,
  BACKEND_URL: 'http://localhost:8000'
};
```

## Data Models

### Message Interface
```typescript
interface Message {
  text: string;
  html?: SafeHtml;
  sender: 'user' | 'bot';
}
```

### API Request Format
```typescript
interface ChatRequest {
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}
```

## Key Features

### Markdown Support
- Uses `marked.js` for rich text formatting
- Sanitizes HTML content for security
- Supports bold, italic, lists, and code blocks

### Auto-scroll Behavior
- Automatically scrolls to new messages
- Disables auto-scroll when user scrolls up
- Re-enables when user scrolls near bottom

### Responsive Design
- Mobile-first approach
- Flexible chat container
- Adaptive input area

### Error Handling
- Network error recovery
- User-friendly error messages
- Graceful degradation

## Styling Architecture

### CSS Structure
- Component-scoped styles
- CSS custom properties for theming
- Responsive breakpoints
- Smooth animations and transitions

### Key Style Classes
- `.chat-container` - Main chat wrapper
- `.messages` - Scrollable message area
- `.message` - Individual message styling
- `.input-area` - Message input section
- `.loading` - Loading state indicators