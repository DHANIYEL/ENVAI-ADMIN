import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  // User Profile Variables
  firstName: string = 'ADMIN';  // default value for first name
  lastName: string = 'Account'; // default value for last name
  phoneNumber: string = '';     // default value for phone number
  email: string = 'isap@yopmail.com'; // default value for email
  profileImage: string = '';    // to store the URL of the profile image

  // Password Variables
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Method to update the user profile
  updateProfile() {
    // Logic for updating the profile
    console.log('Profile updated:', {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      profileImage: this.profileImage
    });
  }

  // Method to update the password
  updatePassword() {
    if (this.newPassword === this.confirmPassword) {
      console.log('Password updated:', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      });
    } else {
      console.log('Passwords do not match');
    }
  }

  // Trigger the file input for profile image upload
  triggerFileInput() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Handle file selection for profile image
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result; // Save the image as a data URL
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle drag over event for the file drop area
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Handle drop event for the file drop area
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result; // Save the image as a data URL
      };
      reader.readAsDataURL(file);
    }
  }
}
