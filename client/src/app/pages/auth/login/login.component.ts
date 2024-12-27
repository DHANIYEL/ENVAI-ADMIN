import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'; // Ensure FormsModule is imported here
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  logoImg = 'assets/logo/LOGO-BLUE.png';
  email: string = '';
  password: string = '';
  loginError: boolean = false;
  loginErrorMessage: string = ''; // Error message for the frontend
  passwordVisible: boolean = false;

  bottomRightImg = 'assets/images/login-img1.jpg'
  topLeftImg = 'assets/images/login-img2.jpg'
  constructor(private router: Router, private authService: ApiService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          // Check if the response is successful
          if (response && response.success === true) {
            console.log('Login successful', response);

            // Check if token and userId are present in the response
            if (response.data && response.data.token) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('userId', response.data.fkAdminId);

              // Navigate to the projects page
              this.router.navigate(['/projects']);
            } else {
              console.log('No token found in the response data');
              this.loginError = true;
              this.loginErrorMessage = 'Invalid response data. Please try again.';
            }
          } else {
            // Handle unsuccessful response
            this.loginError = true;
            this.loginErrorMessage =
              response && response.message ? response.message : 'Login failed. Please try again.';
            console.error('Login unsuccessful:', response);
          }
        },
        (error) => {
          this.loginError = true;

          // Handle backend error response
          if (error.error && error.error.message) {
            this.loginErrorMessage = error.error.message; // e.g., "Invalid credentials"
          } else {
            this.loginErrorMessage = 'An unexpected error occurred. Please try again.';
          }

          console.error('Login failed:', error);
        }
      );

    } else {
      console.log('Form is invalid');
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
