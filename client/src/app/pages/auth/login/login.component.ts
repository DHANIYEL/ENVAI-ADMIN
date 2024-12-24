import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'; // Ensure FormsModule is imported here
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form is valid, attempting login...');

      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('Login successful', response);

          if (response && response.token) {
            // Store the token (or any other user info) in localStorage or state
            localStorage.setItem('token', response.token);

            // Log the token to check if it's saved correctly
            console.log('Token stored in localStorage:', localStorage.getItem('token'));

            // Navigate to the dashboard
            this.router.navigate(['/projects']);
          }
        },
        (error) => {
          // Handle error (wrong credentials, server issues, etc.)
          this.loginError = true;
          console.log('Login failed:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
