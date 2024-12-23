import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Ensure FormsModule is imported here
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule], // Include FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Simulating login logic (replace with actual API call)
      if (this.email === 'user@example.com' && this.password === 'password123') {
        // Successful login - redirect to the dashboard or home page
        this.router.navigate(['/dashboard']);
      } else {
        // Invalid login
        this.loginError = true;
      }
    }
  }
}
