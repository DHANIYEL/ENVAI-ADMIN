import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  imports: [CommonModule],
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
    // Create a FormData object and populate it with the required data
    const formData = new FormData();
    formData.append('id_ID', 'name'); // Add your data to FormData

    this.loading = true; // Set loading state to true before making the request

    // Call the apiService method with the FormData
    this.apiService.getProjects(formData).subscribe(
      (data) => {
        // Check if the response is in the expected format
        if (data && Array.isArray(data)) {
          this.projects = data;
        } else {
          console.error('Unexpected response format:', data);
        }
        this.loading = false;
      },
      (error) => {
        // Enhanced error logging
        console.error('Failed to fetch projects:', error);
        if (error.status) {
          console.error('Error Status:', error.status); // Log the error status (e.g., 404, 500)
        }
        if (error.message) {
          console.error('Error Message:', error.message); // Log the error message
        }
        this.loading = false;
      }
    );
  }




  // Navigate to add project page
  addProject(): void {
    this.router.navigate(['/projects/add']);
  }

  // Delete a project by ID
  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.apiService.deleteProject(projectId).subscribe(
        () => {
          // Remove the project from the local array after successful deletion
          this.projects = this.projects.filter((project) => project.id !== projectId);
          console.log('Project deleted successfully');
        },
        (error) => {
          console.error('Failed to delete project:', error);
        }
      );
    }
  }
}
