import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'; // Ensure FormsModule is imported here
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service'; // Adjust the path as necessary

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
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          // Handle successful login
          if (response && response.token) {
            // Store the token (or any other user info) in localStorage or state
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          // Handle error (wrong credentials, server issues, etc.)
          this.loginError = true;
          console.log(error)
        }
      );
    }
  }
}
