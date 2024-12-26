// sidebar.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from "../../../components/confirmation-modal/confirmation-modal.component"; // Import the modal component
import { NgIf } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ConfirmationModalComponent, RouterModule, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  showLogoutModal: boolean = false; // To control the visibility of the confirmation modal

  constructor(private apiService: ApiService, private router: Router) {}

  // Open the logout confirmation modal
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  // Handle the confirmation (user wants to log out)
  logout(): void {
    this.apiService.logout().subscribe(
      (response) => {
        console.log('Logout successful');
        this.router.navigate(['/login']); // Redirect to login page after logout
      },
      (error) => {
        console.error('Logout failed:', error);
      }
    );
  }
  // Handle the cancellation (user doesn't want to log out)
  cancelLogout() {
    this.showLogoutModal = false; // Close the modal without doing anything
  }
}
