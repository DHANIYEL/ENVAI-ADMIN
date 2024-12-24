import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  standalone: true,  // This component is standalone and does not depend on other modules
  imports:[NgIf, FormsModule]
})
export class ForgetPasswordComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  otpSent: boolean = false;
  passwordReset: boolean = false;

  togglePasswordVisibility(type: 'new' | 'confirm') {
    if (type === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.passwordReset) {
      // Implement the reset password functionality
      console.log('Password Reset Successful');
    } else if (this.otpSent) {
      // Validate OTP and move to password reset screen
      this.passwordReset = true;
    } else {
      // Send OTP to the entered email
      this.otpSent = true;
    }
  }
}
