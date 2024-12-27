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

  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalItems: number = 0;
  displayedProjects: any[] = [];
  Math = Math;


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
    this.apiService.getAllProjects().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.projects = response.data.map((project: any) => ({
            title: project.strTitle,
            smallDescription: project.short_Description,
            detailedDescription: project.long_Description,
            projectUrls: project.strProjectUrls,
            iconUrls: project.strIconUrls,
            id: project.fkProjectId,
            amount: project.amount
          }));
          this.totalItems = this.projects.length;
          this.updateDisplayedProjects();
        } else {
          this.projects = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch projects:', error);
        this.errorMessage = 'Could not load projects. Please try again later.';
        this.loading = false;
      }
    });
  }
  updateDisplayedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProjects = this.projects.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.updateDisplayedProjects();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProjects();
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
      this.updateDisplayedProjects();
    }
  }
  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  // Navigate to add project page
  addProject(): void {
    this.router.navigate(['/projects/add']);
  }

  editProjectNavigate(projectId: string): void {
    this.router.navigate(['/projects/edit', projectId]);
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
