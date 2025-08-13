import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatStateService } from '../services/chat-state.service';

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

  it('should use chat state service for messages', () => {
    const chatStateService = TestBed.inject(ChatStateService);
    expect(chatStateService).toBeTruthy();
    expect(component.chatState).toBe(chatStateService);
  });
});