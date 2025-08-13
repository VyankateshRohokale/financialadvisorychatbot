// src/app/app.component.ts

import { Component, HostListener } from '@angular/core'; // Add HostListener
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CLAU';
  isDropdownOpen = false; // Add this back

  // Add this method back to toggle the dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Add this HostListener back to close the dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    // Check if the click is outside the .logo-container
    if (!target.closest('.logo-container')) {
      this.isDropdownOpen = false;
    }
  }
}