import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { DomSanitizer } from '@angular/platform-browser';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty messages and initial load state', () => {
    expect(component.messages).toEqual([]);
    expect(component.isInitialLoad).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('should not send empty messages', async () => {
    component.userInput = '   ';
    await component.sendMessage();
    expect(component.messages.length).toBe(0);
  });

  it('should handle quick messages', () => {
    spyOn(component, 'sendMessage');
    const testMessage = 'What is APR?';
    
    component.sendQuickMessage(testMessage);
    
    expect(component.userInput).toBe(testMessage);
    expect(component.sendMessage).toHaveBeenCalled();
  });

  it('should clear chat properly', () => {
    component.messages = [{ text: 'test', sender: 'user' }];
    component.isInitialLoad = false;
    
    component.clearChat();
    
    expect(component.messages).toEqual([]);
    expect(component.isInitialLoad).toBeTrue();
    expect(component.userInput).toBe('');
  });

  it('should handle successful API response', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(
        JSON.stringify({ answer: 'Budget advice\n\n**Final Recommendation: Save 20%**' }),
        { status: 200 }
      ))
    );

    component.userInput = 'How to budget?';
    await component.sendMessage();
    
    expect(component.messages.length).toBe(2); // user + bot message
    expect(component.messages[1].sender).toBe('bot');
    expect(component.messages[1].text).toContain('Final Recommendation');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle API errors gracefully', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.reject(new Error('Network error'))
    );

    component.userInput = 'test question';
    await component.sendMessage();
    
    expect(component.messages.length).toBe(2);
    expect(component.messages[1].text).toContain('error');
    expect(component.isLoading).toBeFalse();
  });
});
