import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LayoutComponent } from "./layout/layout.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  hideLayout: boolean = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      // If user is not logged in, hide layout for login/forgot-password/verify-otp
      if (this.router.url === '/login' || this.router.url === '/forgot-password' || this.router.url === '/verify-otp') {
        this.hideLayout = true;  // Hide layout components
      } else {
        this.hideLayout = !this.authService.isLoggedIn(); // Show layout if logged in
      }
    });
  }
}
