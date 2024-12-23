import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  hideLayout = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen for route changes
    this.router.events.subscribe(() => {
      // Check if the current route is login or forgot-password
      const hiddenRoutes = ['/login', '/forgot-password'];
      this.hideLayout = hiddenRoutes.includes(this.router.url);
    });
  }
}
