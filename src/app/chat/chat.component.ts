import { Component, OnInit } from '@angular/core';
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
export class ChatComponent implements OnInit {
  userInput: string = '';
  messages: { text: string; html?: SafeHtml; sender: 'user' | 'bot' }[] = [];
  isLoading: boolean = false;
  public isInitialLoad: boolean = true;

  backend_url = environment.BACKEND_URL || 'http://localhost:8000';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  async sendMessage(): Promise<void> {
    if (this.userInput.trim() === '') return;

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user' });

    this.userInput = '';
    this.isLoading = true;
    this.isInitialLoad = false;

    try {
      const contents = this.messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
      console.log('Sending contents to backend:', contents);

      // The backend now expects the entire 'contents' array
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
      const htmlContent = await Promise.resolve(marked.parse(text));

      this.messages.push({
        text: text,
        html: this.sanitizer.bypassSecurityTrustHtml(htmlContent),
        sender: 'bot',
      });
    } catch (error) {
      console.error('Error calling backend:', error);
      this.messages.push({
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      });
    } finally {
      this.isLoading = false;
    }
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }
}
