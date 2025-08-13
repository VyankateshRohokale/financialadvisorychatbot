import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';

// Define a type for our chat messages
export interface ChatMessage {
  text: string;
  html?: SafeHtml;
  sender: 'user' | 'bot';
}

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {
  // Use BehaviorSubject to store messages and allow components to subscribe to changes
  private readonly _messages = new BehaviorSubject<ChatMessage[]>([]);
  readonly messages$ = this._messages.asObservable();

  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading.asObservable();

  // NEW: BehaviorSubjects for financial data
  private readonly _totalIncome = new BehaviorSubject<number>(0);
  readonly totalIncome$ = this._totalIncome.asObservable();

  private readonly _netWorth = new BehaviorSubject<number>(0);
  readonly netWorth$ = this._netWorth.asObservable();

  // Store dashboard stats
  private readonly _userMessageCount = new BehaviorSubject<number>(0);
  readonly userMessageCount$ = this._userMessageCount.asObservable();

  private readonly _botMessageCount = new BehaviorSubject<number>(0);
  readonly botMessageCount$ = this._botMessageCount.asObservable();
  
  private readonly _topicCounts = new BehaviorSubject<{ [key: string]: number }>({});
  readonly topicCounts$ = this._topicCounts.asObservable();

  public readonly topicList: string[] = ['Personal Finance', 'Investments', 'Financial Planning', 'Financial Literacy', 'Market Trends'];

  constructor() { }

  // Method to get the current messages array
  getMessages(): ChatMessage[] {
    return this._messages.getValue();
  }

  // Method to add a new message and update stats
  addMessage(message: ChatMessage) {
    const currentMessages = this.getMessages();
    this._messages.next([...currentMessages, message]);
    
    // If the message is from the user, try to extract financial data
    if (message.sender === 'user') {
      this.extractFinancials(message.text);
    }

    this.updateInsights();
  }

  // Method to set the loading state
  setLoading(isLoading: boolean) {
    this._isLoading.next(isLoading);
  }

  // Method to clear all messages and stats
  clearChat() {
    this._messages.next([]);
    this._totalIncome.next(0); // Also clear financial data
    this._netWorth.next(0);
    this.updateInsights();
  }

  // NEW: Method to parse user messages for financial numbers
  private extractFinancials(userText: string): void {
    const text = userText.toLowerCase();
    // Regex to find numbers after income-related keywords
    const incomeRegex = /(?:i earn|my income is|i make)\s*\$?([\d,]+(\.\d{1,2})?)/;
    const netWorthRegex = /(?:net worth is|my net worth is)\s*\$?([\d,]+(\.\d{1,2})?)/;

    const incomeMatch = text.match(incomeRegex);
    if (incomeMatch && incomeMatch[1]) {
      const income = parseFloat(incomeMatch[1].replace(/,/g, ''));
      this._totalIncome.next(income);
    }

    const netWorthMatch = text.match(netWorthRegex);
    if (netWorthMatch && netWorthMatch[1]) {
      const netWorth = parseFloat(netWorthMatch[1].replace(/,/g, ''));
      this._netWorth.next(netWorth);
    }
  }

  // Centralized method to calculate all stats
  private updateInsights(): void {
    const messages = this.getMessages();
    
    // Update message counts
    this._userMessageCount.next(messages.filter(m => m.sender === 'user').length);
    this._botMessageCount.next(messages.filter(m => m.sender === 'bot').length);

    // Update topic counts
    const newTopicCounts: { [key: string]: number } = {};
    this.topicList.forEach(topic => newTopicCounts[topic] = 0); // Initialize with 0

    messages.forEach(msg => {
      if (msg.sender === 'bot') {
        const detectedTopic = this.detectTopic(msg.text);
        if (detectedTopic) {
          newTopicCounts[detectedTopic]++;
        }
      }
    });
    this._topicCounts.next(newTopicCounts);
  }

  // Helper function to detect topic from a bot's response
  private detectTopic(botText: string): string | null {
    const lowerCaseText = botText.toLowerCase();
    if (lowerCaseText.includes('budget') || lowerCaseText.includes('saving') || lowerCaseText.includes('debt')) {
      return 'Personal Finance';
    } else if (lowerCaseText.includes('stock') || lowerCaseText.includes('bond') || lowerCaseText.includes('ira') || lowerCaseText.includes('401k')) {
      return 'Investments';
    } else if (lowerCaseText.includes('retirement') || lowerCaseText.includes('college')) {
      return 'Financial Planning';
    } else if (lowerCaseText.includes('interest') || lowerCaseText.includes('apr') || lowerCaseText.includes('loan')) {
      return 'Financial Literacy';
    } else if (lowerCaseText.includes('market') || lowerCaseText.includes('trend') || lowerCaseText.includes('economic')) {
      return 'Market Trends';
    }
    return null;
  }
}
