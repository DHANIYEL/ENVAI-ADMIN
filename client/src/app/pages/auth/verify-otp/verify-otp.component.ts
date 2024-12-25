import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, NgIf]
})
export class VerifyOtpComponent {
  strEmail: string = ''; // User's email (from input)
  otp: string = ''; // OTP from user
  newPassword: string = ''; // New password
  confirmPassword: string = ''; // Confirm password
  otpSent: boolean = false; // To track if OTP was sent
  otpVerified: boolean = false; // To track OTP verification
  showNewPassword: boolean = false; // For password visibility toggle
  showConfirmPassword: boolean = false; // For confirm password visibility toggle


  constructor(private apiService: ApiService, private router: Router) {}

  // Method to send OTP to email
  sendOtp(): void {
    const payload = { strEmail: this.strEmail }; // Send email to API

    this.apiService.sendOtp(payload).subscribe(
      (response: any) => {
        if (response.success) {
          this.otpSent = true; // OTP sent successfully
          console.log('OTP sent successfully!');
        } else {
          console.log('Error sending OTP');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }



  // Method to handle OTP verification

  // Function to verify OTP and reset password
  onSubmit(): void {
    const payload = {
      strEmail: this.strEmail, // Email remains same
      strOTP: this.otp,         // OTP from user input
      strNewPaswd: this.newPassword, // New password
    };

    this.apiService.verifyOtp(payload).subscribe(
      (response: any) => {
        console.log(response);
        if (response.success) {
          this.otpVerified = true; // OTP verified successfully
          console.log('OTP verified successfully!');

          // Navigate to the login page after successful verification
          this.router.navigate(['/login']);
        } else {
          console.log('Invalid OTP');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }



togglePasswordVisibility(type: string): void {
  if (type === 'new') {
    this.showNewPassword = !this.showNewPassword;
  } else if (type === 'confirm') {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}


}
