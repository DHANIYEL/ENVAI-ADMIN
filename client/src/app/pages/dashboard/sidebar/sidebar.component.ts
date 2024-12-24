// sidebar.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from "../../../components/confirmation-modal/confirmation-modal.component"; // Import the modal component
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ConfirmationModalComponent, RouterModule, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  showLogoutModal: boolean = false; // To control the visibility of the confirmation modal

  constructor(private router: Router) {}

  // Open the logout confirmation modal
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  // Handle the confirmation (user wants to log out)
  logout() {
    // Perform logout logic here
    localStorage.removeItem('authToken'); // Remove the token or perform your logout logic
    console.log('User logged out');
    this.router.navigate(['/login']); // Redirect to login page after logout
    this.showLogoutModal = false; // Close the modal
  }

  // Handle the cancellation (user doesn't want to log out)
  cancelLogout() {
    this.showLogoutModal = false; // Close the modal without doing anything
  }
}
