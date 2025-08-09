import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userInput: string = '';
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  isLoading: boolean = false;
  public isInitialLoad: boolean = true;

  constructor() { }

  ngOnInit(): void { }

  sendMessage(): void {
    if (this.userInput.trim() === '') {
      return;
    }

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.isLoading = true;
    this.isInitialLoad = false;

    // Scroll to top when messages become visible
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = 0;
      }
    }, 100);

    // Simulate a delay for the bot's response.
    setTimeout(() => {
      this.messages.push({
        text: 'This is a sample response from the chatbot.',
        sender: 'bot'
      });
      this.isLoading = false;
    }, 2500);
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }
}