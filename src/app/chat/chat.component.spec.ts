/**
 * Test suite for ChatComponent
 * 
 * This test suite covers the core functionality of the financial advisory
 * chat interface, including message handling, API integration, and user
 * interaction patterns.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { DomSanitizer } from '@angular/platform-browser';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  // Set up test environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent]  // Using standalone component
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Trigger initial data binding
  });

  // Basic component lifecycle tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test initial state - important for UX consistency
  it('should initialize with empty messages and initial load state', () => {
    expect(component.messages).toEqual([]);
    expect(component.isInitialLoad).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  // Input validation - prevent sending empty or whitespace-only messages
  it('should not send empty messages', async () => {
    component.userInput = '   ';  // Whitespace only
    await component.sendMessage();
    expect(component.messages.length).toBe(0);
  });

  // Quick message functionality - pre-defined financial questions
  it('should handle quick messages', () => {
    spyOn(component, 'sendMessage');
    const testMessage = 'What is APR?';  // Common financial question
    
    component.sendQuickMessage(testMessage);
    
    expect(component.userInput).toBe(testMessage);
    expect(component.sendMessage).toHaveBeenCalled();
  });

  // Chat reset functionality - important for user experience
  it('should clear chat properly', () => {
    // Set up a chat session with existing messages
    component.messages = [{ text: 'test', sender: 'user' }];
    component.isInitialLoad = false;
    
    component.clearChat();
    
    // Verify complete reset to initial state
    expect(component.messages).toEqual([]);
    expect(component.isInitialLoad).toBeTrue();
    expect(component.userInput).toBe('');
  });

  // API integration test - successful response handling
  it('should handle successful API response', async () => {
    // Mock successful API response with typical financial advice format
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(
        JSON.stringify({ 
          answer: 'Budget advice\n\n**Final Recommendation: Save 20%**' 
        }),
        { status: 200 }
      ))
    );

    component.userInput = 'How to budget?';
    await component.sendMessage();
    
    // Verify message flow: user question + bot response
    expect(component.messages.length).toBe(2);
    expect(component.messages[1].sender).toBe('bot');
    expect(component.messages[1].text).toContain('Final Recommendation');
    expect(component.isLoading).toBeFalse();
  });

  // Error handling test - network failures should be handled gracefully
  it('should handle API errors gracefully', async () => {
    // Mock network failure
    spyOn(window, 'fetch').and.returnValue(
      Promise.reject(new Error('Network error'))
    );

    component.userInput = 'test question';
    await component.sendMessage();
    
    // Verify error message is displayed to user
    expect(component.messages.length).toBe(2);
    expect(component.messages[1].text).toContain('error');
    expect(component.isLoading).toBeFalse();
  });
});
