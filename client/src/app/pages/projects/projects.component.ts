import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

interface Project {
  id: string;
  title: string;
  smallDescription: string;
  detailedDescription: string;
  images: string[]; // Array of image URLs
}


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProjectsComponent implements OnInit {
  projects: any[] = []; // Holds the list of projects
  loading: boolean = true;
  errorMessage: string = '';// Loading indicator

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getAllProjects(); // Fetch projects on component initialization
  }

  // Fetch projects from the API
  getAllProjects(): void {
    this.apiService.getAllProjects().subscribe(
      (response) => {
        if (response && response.data) {
          // Map the response data to match the required fields
          this.projects = response.data.map((project: any) => ({
            title: project.strTitle,
            smallDescription: project.short_Description,
            detailedDescription: project.long_Description,
            images: project.details.map((detail: any) => detail.iconUrl), // Collect all image URLs
            id: project.fkProjectId, // Assuming this is the unique identifier
          }));
        } else {
          this.projects = [];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Failed to fetch projects:', error);
        this.errorMessage = 'Could not load projects. Please try again later.'; // Set the error message
        this.loading = false;
      }
    );
  }


  // Navigate to add project page
  addProject(): void {
    this.router.navigate(['/projects/add']);
  }

  // Delete a project by ID
  deleteProject(id: string): void {
    console.log('Attempting to delete project with ID:', id);

    if (!id) {
      alert('Project ID is missing. Unable to delete.');
      return;
    }

    if (confirm('Are you sure you want to delete this project?')) {
      this.apiService.deleteProject(id).subscribe(
        (response) => {
          console.log('Delete response:', response);
          if (response?.success) {
            // Remove the deleted project from the local projects array
            this.projects = this.projects.filter((project) => project.id !== id);
            alert('Project deleted successfully.');
          } else {
            alert(response?.message || 'Failed to delete the project. Please try again.');
          }
        },
        (error) => {
          console.error('Failed to delete project:', error);
          alert('Failed to delete project. Please try again later.');
        }
      );
    }
  }

}
