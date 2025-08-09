import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const BOT_RESPONSE_DELAY = 1500; // Time in ms for the bot to "think"
const UI_TRANSITION_DURATION = 1000; // Matches the CSS transition duration of 1s

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

  ngOnInit(): void { }

  sendMessage(): void {
    if (this.userInput.trim() === '') {
      return;
    }

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.isLoading = true;

    // First, wait for the UI transition to complete
    setTimeout(() => {
      // Then, simulate the bot's response delay
      setTimeout(() => {
        this.messages.push({
          text: 'This is a sample response from the chatbot.',
          sender: 'bot'
        });
        this.isLoading = false;
      }, BOT_RESPONSE_DELAY);
    }, UI_TRANSITION_DURATION);
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }
}