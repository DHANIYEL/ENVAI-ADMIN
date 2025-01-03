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
    this.apiService.getUserById().subscribe(
      (response) => {
        if (response.success && response.data && response.data.length > 0) {
          const userData = response.data[0]; // Assuming only one user exists
          this.firstName = userData.strFirstName;
          this.lastName = userData.strLastName;
          this.email = userData.strEmail;
          this.profileImage = ''; // Set this to the profile image URL if available
        } else {
          console.error('No user data found');
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
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

  // Update the user profile
// Update the user profile
updateProfile(): void {
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  if (userId) {
    const userData = {
      fkAdminId: userId,  // Assuming the userId is the fkAdminId in your request
      strFirstName: this.firstName,
      strLastName: this.lastName,
      strEmail: this.email,  // Email should not be changed since it's disabled
      strProfileImage: this.profileImage  // Make sure profile image data is handled correctly
    };

    // Call the service to update the profile
    this.apiService.updateUserProfile(userId, userData).subscribe(
      (response) => {
        alert('Profile updated successfully!');
      },
      (error) => {
        alert('Failed to update profile. Please try again.');
        console.error('Error updating profile:', error); // Log the full error details
      }
    );
  } else {
    console.error('User ID is not available.');
  }
}


  // Validate and update the password
// Update the password
updatePassword(): void {
  this.oldPasswordError = '';
  this.newPasswordError = '';

  // Check if new password and confirm password match
  if (this.newPassword !== this.confirmPassword) {
    this.newPasswordError = 'New password and confirm password do not match.';
    return;
  }

  // First, check if the old password is correct (we will pass oldPassword only)
  this.apiService.updatePassword(this.oldPassword).subscribe(
    (response: any) => {
      console.log(response);
      if (response) {
        // If old password is correct, proceed to reset password
        this.apiService.updatePassword(this.oldPassword, this.newPassword).subscribe(
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
      } else {
        this.oldPasswordError = 'The old password you entered is incorrect.';
      }
    },
    (error) => {
      console.error('Error checking old password:', error);
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
