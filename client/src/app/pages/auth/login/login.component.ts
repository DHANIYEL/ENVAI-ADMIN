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
  email: string = '';
  password: string = '';
  loginError: boolean = false;
  passwordVisible: boolean = false; // Track visibility of the password

  constructor(private router: Router, private authService: ApiService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form is valid, attempting login...');
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('Login successful', response);

          if (response) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);

            console.log('Token:', localStorage.getItem('token'));
            console.log('UserId:', localStorage.getItem('userId'));

            this.router.navigate(['/projects']);
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
