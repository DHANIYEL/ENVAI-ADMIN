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
  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  // Method to send OTP to email
  sendOtp(): void {
    const payload = { email: this.email };

    this.apiService.sendOtp(payload).subscribe(
      (response: any) => {
        if (response.message === 'OTP sent successfully') {
          console.log('OTP sent successfully!');
          this.otpSent = true;
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
  onSubmit(): void {
    const payload = { email: this.email, otp: this.otp };

    this.apiService.verifyOtp(payload).subscribe(
      (response: any) => {
        if (response.message === 'OTP verified successfully') {
          this.otpVerified = true;
          console.log('OTP verified successfully!');

          // Navigate to the next step (e.g., password reset)
          this.router.navigate(['/forgot-password']);
        } else {
          console.log('Invalid OTP');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
