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
  passwordVisible: boolean = false;

  bottomRightImg = 'assets/images/login-img1.jpg'
  topLeftImg = 'assets/images/login-img2.jpg'
  constructor(private router: Router, private authService: ApiService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form is valid, attempting login...');
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('Login successful', response);

          // Check if response has data and token
          if (response && response.data && response.data.token) {
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.fkAdminId); // assuming fkAdminId is userId

            // Log to check if the token and userId are saved correctly
            console.log('Token:', localStorage.getItem('token'));
            console.log('UserId:', localStorage.getItem('userId'));

            // Navigate to the projects page
            this.router.navigate(['/projects']);
          } else {
            console.log('No token found in the response data');
          }
        },
        (error) => {
          this.loginError = true;
          console.log('Login failed:', error);
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
