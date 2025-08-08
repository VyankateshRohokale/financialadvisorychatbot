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

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage(): void {
    if (this.userInput.trim() === '') {
      return;
    }

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.isLoading = true;

    // Simulate an API call with a delay
    setTimeout(() => {
      this.messages.push({
        text: 'This is a sample response from the chatbot.',
        sender: 'bot'
      });
      this.isLoading = false;
    }, 1500);
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }
}