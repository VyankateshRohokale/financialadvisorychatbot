import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  userInput: string = '';
  messages: { text: string; html?: SafeHtml; sender: 'user' | 'bot' }[] = [];
  isLoading: boolean = false;
  public isInitialLoad: boolean = true;
  private shouldScrollToBottom: boolean = false;
  private autoScrollEnabled: boolean = true;
  private scrollToBottomTimeout: any;

  backend_url = environment.BACKEND_URL || 'http://localhost:8000';

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Focus on input when component initializes
    setTimeout(() => {
      this.focusInput();
    }, 100);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.autoScrollEnabled) {
      // Clear any existing timeout
      if (this.scrollToBottomTimeout) {
        clearTimeout(this.scrollToBottomTimeout);
      }
      
      // Add a small delay to ensure DOM is fully rendered
      this.scrollToBottomTimeout = setTimeout(() => {
        this.scrollToBottom();
        this.shouldScrollToBottom = false;
      }, 50);
    }
  }

  private scrollToBottom(): void {
    try {
      const messagesElement = document.querySelector('.messages');
      if (messagesElement) {
        // Smooth scroll to bottom
        messagesElement.scrollTo({
          top: messagesElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }

  private scrollToBottomInstant(): void {
    try {
      const messagesElement = document.querySelector('.messages');
      if (messagesElement) {
        // Instant scroll to bottom
        messagesElement.scrollTop = messagesElement.scrollHeight;
      }
    } catch (error) {
      console.error('Error scrolling to bottom instantly:', error);
    }
  }

  private focusInput(): void {
    try {
      const inputElement = this.isInitialLoad 
        ? document.querySelector('.input-area-initial input') as HTMLInputElement
        : document.querySelector('.input-area input') as HTMLInputElement;
      
      if (inputElement) {
        inputElement.focus();
      }
    } catch (error) {
      console.error('Error focusing input:', error);
    }
  }

  // Check if user is near bottom of messages
  private isNearBottom(): boolean {
    const messagesElement = document.querySelector('.messages');
    if (!messagesElement) return true;
    
    const threshold = 100; // pixels from bottom
    const scrollTop = messagesElement.scrollTop;
    const scrollHeight = messagesElement.scrollHeight;
    const clientHeight = messagesElement.clientHeight;
    
    return scrollHeight - scrollTop - clientHeight < threshold;
  }

  // Handle scroll events to determine if auto-scroll should be enabled
  onMessagesScroll(): void {
    this.autoScrollEnabled = this.isNearBottom();
  }

  async sendMessage(): Promise<void> {
    if (this.userInput.trim() === '') return;

    const userMessage = this.userInput;
    
    // Add user message
    this.messages.push({ text: userMessage, sender: 'user' });
    
    // Clear input immediately for better UX
    this.userInput = '';
    
    // Enable auto-scroll and mark for scrolling
    this.autoScrollEnabled = true;
    this.shouldScrollToBottom = true;

    // Switch to chat view if this is the first message
    if (this.isInitialLoad) {
      this.isInitialLoad = false;
      // Give time for the view to switch before scrolling
      setTimeout(() => {
        this.shouldScrollToBottom = true;
        this.focusInput();
      }, 100);
    }

    this.isLoading = true;

    try {
      const contents = this.messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
      
      console.log('Sending contents to backend:', contents);

      const response = await fetch(`${this.backend_url}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contents }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.answer || 'No answer received.';
      
      // Process markdown
      const htmlContent = await Promise.resolve(marked.parse(text));

      // Add bot message
      this.messages.push({
        text: text,
        html: this.sanitizer.bypassSecurityTrustHtml(htmlContent),
        sender: 'bot',
      });

      // Enable auto-scroll for bot response
      this.autoScrollEnabled = true;
      this.shouldScrollToBottom = true;
      
    } catch (error) {
      console.error('Error calling backend:', error);
      this.messages.push({
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      });
      this.shouldScrollToBottom = true;
    } finally {
      this.isLoading = false;
      
      // Focus input after response is complete
      setTimeout(() => {
        this.focusInput();
      }, 100);
    }
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }

  // Handle Enter key in input
  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Clear chat functionality (optional)
  clearChat(): void {
    this.messages = [];
    this.isInitialLoad = true;
    this.userInput = '';
    this.autoScrollEnabled = true;
    setTimeout(() => {
      this.focusInput();
    }, 100);
  }

  // Scroll to top functionality (optional)
  scrollToTop(): void {
    const messagesElement = document.querySelector('.messages');
    if (messagesElement) {
      messagesElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    this.autoScrollEnabled = false;
  }

  // Force scroll to bottom (optional - for user triggered scroll to bottom)
  forceScrollToBottom(): void {
    this.autoScrollEnabled = true;
    this.shouldScrollToBottom = true;
    this.scrollToBottomInstant();
  }

  ngOnDestroy(): void {
    if (this.scrollToBottomTimeout) {
      clearTimeout(this.scrollToBottomTimeout);
    }
  }
}