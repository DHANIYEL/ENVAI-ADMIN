import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'; // Import ApiService
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // User Profile Variables
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  email: string = '';
  profileImage: string = '';

  // Password Variables
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Error Messages
  oldPasswordError: string = '';
  newPasswordError: string = '';

  // Password visibility flags
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.apiService.getUserById(userId).subscribe(
        (response) => {
          this.firstName = response.firstName;
          this.lastName = response.lastName;
          this.phoneNumber = response.phoneNumber;
          this.email = response.email;
          this.profileImage = response.profileImage || '';
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('No user ID found in localStorage');
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(type: 'old' | 'new' | 'confirm'): void {
    if (type === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (type === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Update profile details
  updateProfile(): void {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (userId) {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        profileImage: this.profileImage
      };

      this.apiService.updateUserProfile(userId, userData).subscribe(
        (response) => {
          alert('Profile updated successfully!');
        },
        (error) => {
          alert('Failed to update profile. Please try again.');
          console.error('Error updating profile:', error); // Log the full error details
        }
      );
    }
  }

  // Validate and update the password
  updatePassword(): void {
    this.oldPasswordError = '';
    this.newPasswordError = '';

    // Check if new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      this.newPasswordError = 'New password and confirm password do not match.';
      return;
    }

    // Validate old password with backend
    this.apiService.checkOldPassword(this.email, this.oldPassword).subscribe(
      (response: any) => {
        if (response.message === 'Old password is correct') {
          // Proceed to change the password
          this.apiService.resetPassword(this.email, this.newPassword, this.confirmPassword).subscribe(
            (resetResponse: any) => {
              alert('Password changed successfully!');
              this.oldPassword = '';
              this.newPassword = '';
              this.confirmPassword = '';
            },
            (resetError) => {
              console.error('Error resetting password:', resetError);
              alert('Failed to change password. Please try again.');
            }
          );
        }
      },
      (error) => {
        console.error('Old password is incorrect:', error);
        this.oldPasswordError = 'The old password you entered is incorrect.';
      }
    );
  }

  // Handle file selection for profile image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
