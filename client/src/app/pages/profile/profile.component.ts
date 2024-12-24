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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Get the logged-in user's ID (stored in localStorage)
    const userId = localStorage.getItem('userId');

    if (userId) {
      // If the userId exists in localStorage, use it to fetch user data
      this.apiService.getUserById(userId).subscribe(
        (response) => {
          this.firstName = response.firstName;
          this.lastName = response.lastName;
          this.phoneNumber = response.phoneNumber;
          this.email = response.email;
          this.profileImage = response.profileImage || '';  // If profile image exists
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('No user ID found in localStorage');
    }
  }


  // Method to update the user profile
  updateProfile(): void {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      profileImage: this.profileImage
    };

    this.apiService.updateUserProfile(userData).subscribe(
      (response) => {
        alert('Profile updated successfully!');
      },
      (error) => {
        alert('Failed to update profile. Please try again.');
        console.error('Error updating profile:', error);
      }
    );
  }


  triggerFileInput(): void {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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

  // Handle drag over event for the file drop area
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Handle drop event for the file drop area
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
