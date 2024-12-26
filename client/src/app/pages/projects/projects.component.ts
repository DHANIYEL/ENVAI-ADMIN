import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationModalComponent } from "../../components/confirmation-modal/confirmation-modal.component";

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
  imports: [CommonModule, ConfirmationModalComponent, RouterModule],
})
export class ProjectsComponent implements OnInit {
  projects: any[] = []; // Holds the list of projects
  loading: boolean = true;
  errorMessage: string = '';// Loading indicator
  showDeleteModal: boolean = false;
  projectToDeleteId: string | null = null;


  constructor(private apiService: ApiService, private router: Router) {}


  openDeleteModal(projectId: string): void {
    this.projectToDeleteId = projectId;
    this.showDeleteModal = true;
  }

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
            projectUrls: project.strProjectUrls, // Use strProjectUrls for project URLs
            iconUrls: project.strIconUrls, // Use strIconUrls for icon URLs
            id: project.fkProjectId, // Assuming this is the unique identifier
            amount: project.amount // Assuming 'amount' is present in the backend response
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

  editProjectNavigate(): void {
    this.router.navigate(['/projects/edit']);
  }


  // Delete a project by ID
  confirmDelete(): void {
    if (this.projectToDeleteId) {
      this.apiService.deleteProject(this.projectToDeleteId).subscribe(
        () => {
          this.projects = this.projects.filter(
            (project) => project.id !== this.projectToDeleteId
          );
          console.log('Project deleted successfully');
          this.showDeleteModal = false;
          this.projectToDeleteId = null;
        },
        (error) => {
          console.error('Failed to delete project:', error);
          alert('Failed to delete project. Please try again.');
          this.showDeleteModal = false;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.projectToDeleteId = null;
  }
}
