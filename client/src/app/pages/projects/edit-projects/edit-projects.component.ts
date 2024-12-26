import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';  // Import your API service
import { HttpHeaders } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';  // Import CommonModule


interface Project {
  id: string;
  strTitle: string;
  short_Description: string;
  long_Description: string;
  projectImages: File[];
  details: { icon: string, description: string }[];
}

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]  // Include CommonModule here
})
export class EditProjectsComponent implements OnInit {
  projectForm: FormGroup;
  projectImages: File[] = [];
  details: any[] = [];
  fkProjectId: string = '';  // To hold the project ID from the URL

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,  // Make sure to inject your API service
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize form
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      smallDescription: ['', Validators.required],
      detailedDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the project ID from the route params
    this.fkProjectId = this.route.snapshot.paramMap.get('id') || '';  // Assuming project ID is passed in the route

    if (this.fkProjectId) {
      this.loadProjectDetails();
    }
  }

  loadProjectDetails(): void {
    this.apiService.getAllProjects().subscribe(
      (response: any) => {
        console.log('Backend response:', response);  // Check the full structure of the response
        if (response && response.success === true) {
          const project = response.data.find((p: any) => p.id === this.fkProjectId);
          if (project) {
            // Populate the form
            this.projectForm.patchValue({
              title: project.strTitle,
              smallDescription: project.short_Description,
              detailedDescription: project.long_Description
            });

            this.projectImages = project.projectImages || [];
            this.details = project.details || [];
          } else {
            console.error('Project not found:', this.fkProjectId);
            alert('Project not found. Please try again.');
          }
        } else {
          console.error('Failed to load projects:', response);
          alert('Failed to load projects. Please try again.');
        }
      },
      (error) => {
        console.error('Error loading projects:', error);
        alert('Error loading project details.');
      }
    );
  }





  updateProject(): void {
    const formData = new FormData();

    // Append text data from the form
    formData.append('strTitle', this.projectForm.value.title);
    formData.append('short_Description', this.projectForm.value.smallDescription);
    formData.append('long_Description', this.projectForm.value.detailedDescription);

    // Append project images (if any)
    if (this.projectImages.length > 0) {
      this.projectImages.forEach((file) => {
        formData.append('projectImages', file, file.name);
      });
    }

    // Append details as a JSON string
    if (this.details.length > 0) {
      const detailsJson = JSON.stringify(this.details);
      formData.append('details', detailsJson);
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Include fkProjectId in the body for update
    formData.append('fkProjectId', this.fkProjectId);

    // Make the API call to update the project
    this.apiService.updateProject(formData, { headers }).subscribe(
      (response) => {
        if (response && response.success === true) {
          console.log('Project updated successfully:', response);
          alert('Project updated successfully!');
          this.router.navigate(['/projects']);  // Navigate to the projects list
        } else {
          console.error('Failed to update project:', response);
          alert('Failed to update project. Please try again.');
        }
      },
      (error) => {
        console.error('Error updating project:', error);
        alert('Failed to update project. Please try again.');
      }
    );
  }

  // Handles file input for project images
  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.projectImages = Array.from(files);
    }
  }

  // Adds a new detail row
  addDetail(): void {
    this.details.push({ icon: '', description: '' });
  }

  // Removes a detail row by index
  removeDetail(index: number): void {
    this.details.splice(index, 1);
  }
}
