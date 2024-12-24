// layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from "../pages/dashboard/header/header.component";
import { SidebarComponent } from "../pages/dashboard/sidebar/sidebar.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone:true,
  imports: [HeaderComponent, SidebarComponent, RouterModule, NgIf]
})
export class LayoutComponent implements OnInit {
  hideLayout: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      // Check if the user is on login, forgot-password, or verify-otp routes
      const hiddenRoutes = ['/login', '/forgot-password', '/verify-otp'];
      this.hideLayout = hiddenRoutes.includes(this.router.url);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
