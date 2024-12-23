import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf, FormsModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: string = ''; // For storing the input email
  otp: string = ''; // For storing the OTP
  newPassword: string = ''; // For storing the new password
  confirmPassword: string = ''; // For confirming the new password
  emailSent: boolean = false; // Tracks whether the email was sent successfully
  otpSent: boolean = false; // Tracks whether the OTP input should be shown
  passwordReset: boolean = false; // Tracks whether password reset fields should be shown
  passwordResetSuccess: boolean = false; // Tracks whether the password was reset successfully

  showNewPassword = false; // Controls visibility of new password field
  showConfirmPassword = false; // Controls visibility of confirm password field

  togglePasswordVisibility(field: 'new' | 'confirm') {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.email && !this.otpSent && !this.passwordReset) {
      console.log('Email submitted:', this.email);
      this.emailSent = true;
      this.otpSent = true; // Simulate sending an OTP after submitting the email
    } else if (this.otp && this.otpSent && !this.passwordReset) {
      console.log('OTP submitted:', this.otp);
      this.passwordReset = true; // Show password reset fields
    } else if (this.newPassword && this.confirmPassword && this.passwordReset) {
      if (this.newPassword === this.confirmPassword) {
        console.log('Password reset:', this.newPassword);
        this.passwordResetSuccess = true;
      } else {
        alert('Passwords do not match!');
      }
    }
  }
}
