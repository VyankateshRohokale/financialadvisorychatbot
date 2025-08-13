import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';

export const routes: Routes = [
  // Redirect empty path to '/chatbot'
  { path: '', redirectTo: '/chatbot', pathMatch: 'full' }, 
  
  // Define routes for your components
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chatbot', component: ChatComponent },
  { path: 'insights', component: InsightsComponent }
];