import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component(
  {
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userInput: string = '';
  messages: { text: string, html?: SafeHtml, sender: 'user' | 'bot' }[] = [];
  isLoading: boolean = false;
  public isInitialLoad: boolean = true;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void { }

  async sendMessage(): Promise<void> {
    if (this.userInput.trim() === '') {
      return;
    }

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.isLoading = true;
    this.isInitialLoad = false;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${environment.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
      You are an expert financial advisor chatbot named "FinWise". Your goal is to provide clear, accurate, and concise financial guidance.
      
      Your responsibilities include:
      1.  **Financial Advice:** Respond to user questions about personal finance (budgeting, saving, debt), investments (stocks, bonds, mutual funds, retirement), financial planning (college, retirement), and financial literacy (explaining concepts like compound interest, APR).
      2.  **Clarity:** Explain complex financial concepts in simple, easy-to-understand language. Use analogies when helpful.
      3.  **Accuracy and Formatting:** Ensure all information is factually correct. When providing numerical data (e.g., percentages, dollar amounts, timeframes), format it clearly.
      4.  **Disclaimers:** For any investment-related advice, you must include a short disclaimer stating that this is for informational purposes only and not to be taken as professional financial advice.
      5.  **Conciseness:** Keep your responses to the point, comprehensive, and focused on directly answering the user's question without unnecessary conversational fluff.
      6.  **Proactive Guidance:** If a user's question requires specific financial data you don't have (e.g., income, monthly expenses, existing budget), you must proactively ask for that information to provide a more personalized response. Do not tell the user to calculate things themselves. Instead, guide them by asking for the missing pieces of information.
      7.  **Direct Recommendations:** If you have sufficient information to make a reasonable suggestion, provide a direct spending recommendation or range. For example, if a user's only significant expense is rent and all other expenses are covered, you can suggest a specific spending amount for a night out while also recommending a portion to be saved. The final recommendation should be a concrete amount or range.
      8.  **Don't Forget the conclusion, the reason why this conversation is startend , always give conclusion at the end related main topic**
      User question: ${userMessage}
    `
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const htmlContent = await marked(text);

      this.messages.push({
        text: text,
        html: this.sanitizer.bypassSecurityTrustHtml(htmlContent),
        sender: 'bot'
      });
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      this.messages.push({
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
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