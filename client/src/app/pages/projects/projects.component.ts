import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { ApiService } from 'src/app/services/api.service';

export interface Project {
  id: string;
  title: string;
  smallDescription: string;
  detailedDescription: string;
  image?: string;
  icon?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = []; // Array to store projects
  loading: boolean = true; // Loading indicator

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getProjects(); // Fetch projects on component initialization
  }

  // Fetch projects from the API
  getProjects(): void {
    this.apiService.getProjects().subscribe(
      (data) => {
        this.projects = data;
        this.loading = false;
      },
      (error) => {
        console.error('Failed to fetch projects:', error);
        this.loading = false;
      }
    );
  }

  // Navigate to add project page
  addProject(): void {
    this.router.navigate(['/projects/add']);
  }
}
