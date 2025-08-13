import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatStateService, ChatMessage } from '../services/chat-state.service';
import { Subscription, Observable } from 'rxjs'; // Import Observable

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;

  userInput: string = '';
  messages: ChatMessage[] = [];
  isLoading$: Observable<boolean>; // Changed to an Observable
  isInitialLoad: boolean = true;

  private messagesSubscription!: Subscription;
  private shouldScrollToBottom: boolean = false;
  
  backend_url = environment.BACKEND_URL || 'http://localhost:8000';

  constructor(
    private sanitizer: DomSanitizer,
    public chatState: ChatStateService
  ) {
    // Initialize isLoading$ from the service
    this.isLoading$ = this.chatState.isLoading$;
  }

  ngOnInit(): void {
    this.messagesSubscription = this.chatState.messages$.subscribe(messages => {
      this.messages = messages;
      this.isInitialLoad = messages.length === 0;
      this.shouldScrollToBottom = true;
      this.focusInput();
    });

    setTimeout(() => this.focusInput(), 100);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const messagesElement = this.messagesContainer.nativeElement;
      messagesElement.scrollTo({ top: messagesElement.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
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

  async sendMessage(): Promise<void> {
    if (this.userInput.trim() === '') return;

    const userMessageText = this.userInput;
    this.chatState.addMessage({ text: userMessageText, sender: 'user' });
    this.userInput = '';
    
    // Use the service to set the loading state
    this.chatState.setLoading(true);

    try {
      const history = this.chatState.getMessages().map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(`${this.backend_url}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: history }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const botText = data.answer || 'No answer received.';
      const htmlContent = await Promise.resolve(marked.parse(botText));
      
      this.chatState.addMessage({
        text: botText,
        html: this.sanitizer.bypassSecurityTrustHtml(htmlContent),
        sender: 'bot',
      });

    } catch (error) {
      console.error('Error calling backend:', error);
      const errorHtml = this.sanitizer.bypassSecurityTrustHtml('Sorry, I encountered an error. Please try again.');
      this.chatState.addMessage({ text: 'Error', html: errorHtml, sender: 'bot' });
    } finally {
      // Use the service to turn off loading
      this.chatState.setLoading(false);
      this.focusInput();
    }
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
