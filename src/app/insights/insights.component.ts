import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChatStateService } from '../services/chat-state.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  isLoading: boolean = false;
  insightsHtml: SafeHtml | null = null;
  hasConversation: boolean = false;
  backend_url = environment.BACKEND_URL || 'http://localhost:8000';

  constructor(
    private chatState: ChatStateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.hasConversation = this.chatState.getMessages().length > 0;
  }

  async generateInsights(): Promise<void> {
    if (!this.hasConversation || this.isLoading) return;

    this.isLoading = true;
    this.insightsHtml = null;

    // Construct the conversation history as a single text block
    const conversationText = this.chatState.getMessages()
      .map(m => `${m.sender === 'user' ? 'User' : 'Clau AI'}: ${m.text}`)
      .join('\n');

    // Create a new "contents" payload with a specific prompt for summarization
    const contents = [{
      role: 'user',
      parts: [{
        text: `Based on the following financial conversation, please provide a high-level summary of insights. Analyze the user's goals, potential areas for improvement, and key topics discussed. Format your response clearly using Markdown with headings like "Key Goals", "Topics Discussed", and "Actionable Insights".\n\n---CONVERSATION---\n${conversationText}`
      }]
    }];

    try {
      const response = await fetch(`${this.backend_url}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contents }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const insightsText = data.answer || 'Could not generate insights.';
      const htmlContent = await Promise.resolve(marked.parse(insightsText));
      this.insightsHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);

    } catch (error) {
      console.error('Error generating insights:', error);
      this.insightsHtml = this.sanitizer.bypassSecurityTrustHtml(
        '<h3>Error</h3><p>Sorry, we could not generate insights at this time. Please try again later.</p>'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
