import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatStateService } from '../services/chat-state.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // These properties need to be declared here
  totalIncome$: Observable<number>;
  netWorth$: Observable<number>;
  userMessageCount$: Observable<number>;
  botMessageCount$: Observable<number>;
  topicCounts$: Observable<{ [key: string]: number }>;
  totalMessages$: Observable<number>;
  topicList: string[];

  constructor(private chatState: ChatStateService) {
    // Initialize the properties from the service
    this.totalIncome$ = this.chatState.totalIncome$;
    this.netWorth$ = this.chatState.netWorth$;
    this.userMessageCount$ = this.chatState.userMessageCount$;
    this.botMessageCount$ = this.chatState.botMessageCount$;
    this.topicCounts$ = this.chatState.topicCounts$;
    this.topicList = this.chatState.topicList;

    // Combine user and bot counts for a total
    this.totalMessages$ = new Observable(subscriber => {
      let userCount = 0;
      let botCount = 0;
      const userSub = this.userMessageCount$.subscribe(count => {
        userCount = count;
        subscriber.next(userCount + botCount);
      });
      const botSub = this.botMessageCount$.subscribe(count => {
        botCount = count;
        subscriber.next(userCount + botCount);
      });
      // Unsubscribe when the observable is torn down
      return () => {
        userSub.unsubscribe();
        botSub.unsubscribe();
      };
    });
  }
}
