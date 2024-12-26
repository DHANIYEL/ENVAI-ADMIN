// edit-projects.component.ts
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditProjectsComponent implements OnInit {
  @ViewChild('projectForm') projectForm!: NgForm;
  projects: any[] = [];  // Define the projects array
  fkProjectId: string = '';
  projectDetails: any = {}; // Store project details
  iconUrl: string = '';
  projectUrl: string = '';
  amount: number = 0; // Amount

  selectedProjectImages: { file: File; preview: string }[] = [];
  selectedIconImages: { file: File; preview: string }[] = [];

  loading: boolean = true;
  errorMessage: string = '';// Loading indicator

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.fkProjectId = params['id'];
        console.log('Project ID for editing:', this.fkProjectId);
      } else {
        console.error('No project ID provided in the route.');
      }
    });
  }


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

          console.log('All Projects:', this.projects); // Log all projects

          // Filter the project by ID
          const filteredProject = this.projects.find(
            (project) => project.id === this.fkProjectId
          );

          if (filteredProject) {
            console.log('Filtered Project:', filteredProject); // Log the filtered project

            // Populate the form with the filtered project details
            if (this.projectForm) {
              setTimeout(() => {
                this.projectForm.form.patchValue({
                  title: filteredProject.title,
                  smallDescription: filteredProject.smallDescription,
                  detailedDescription: filteredProject.detailedDescription,
                  amount: filteredProject.amount,
                });

                // Set other values
                this.iconUrl = filteredProject.iconUrls?.[0] || ''; // First icon URL
                this.projectUrl = filteredProject.projectUrls?.[0] || ''; // First project URL
              });
            }
          } else {
            console.error('Project with the given ID not found.');
          }
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

  onSubmit(): void {
    if (!this.fkProjectId) {
      console.error('Project ID is missing.');
      alert('No project ID found. Cannot update the project.');
      return;
    }

    const formData = new FormData();

    // Append the project ID (required for the backend)
    formData.append('projectId', this.fkProjectId);

    // Append form fields with the updated naming conventions
    formData.append('strTitle', this.projectForm.value.title);
    formData.append('short_Description', this.projectForm.value.smallDescription);
    formData.append('long_Description', this.projectForm.value.detailedDescription);
    formData.append('detail_Description', this.projectForm.value.detailedDescription);

    // Append selected project images if any are provided
    if (this.selectedProjectImages.length > 0) {
      this.selectedProjectImages.forEach(({ file }) => {
        formData.append('projectImages', file, file.name);
      });
    }

    // Append selected icon images if any are provided
    if (this.selectedIconImages.length > 0) {
      this.selectedIconImages.forEach(({ file }) => {
        formData.append('iconImages', file, file.name);
      });
    }

    // Append existing icon URLs
    const iconUrlArray: string[] = [this.iconUrl];
    formData.append('iconUrls', JSON.stringify(iconUrlArray));

    // Append existing project URLs
    const projectUrlArray: string[] = [this.projectUrl];
    formData.append('projectUrls', JSON.stringify(projectUrlArray));

    // Append the amount value
    formData.append('amount', this.projectForm.value.amount.toString());

    // Log the formData for debugging
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Call the updateProject method
    this.apiService.updateProject(this.fkProjectId, formData).subscribe(
      (response) => {
        // Check if the response indicates success
        if (response && response.success) {
          console.log('Project updated successfully:', response);
          alert('Project updated successfully!');

          // Update the local projects array with the new data
          this.projects = this.projects.map((project) =>
            project.id === this.fkProjectId ? { ...project, ...response.data } : project
          );

          // Reset the form and fields
          this.projectForm.reset();
          this.selectedProjectImages = [];
          this.selectedIconImages = [];
          this.iconUrl = '';
          this.projectUrl = '';
          this.amount = 0;

          // Navigate to the projects page
          this.router.navigate(['/projects']);
        } else {
          // Handle the case where the update was not successful
          console.error('Failed to update project:', response?.message || 'Unknown error');
          alert(response?.message || 'Failed to update project. Please try again.');
        }
      },
      (error) => {
        // Handle errors from the API call
        console.error('Error updating project:', error);
        alert('Failed to update project due to a network or server error. Please try again.');
      }
    );

  }

  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (type === 'project') {
            if (!this.selectedProjectImages) this.selectedProjectImages = [];
            this.selectedProjectImages.push({ file, preview: reader.result as string });
          } else if (type === 'icon') {
            if (!this.selectedIconImages) this.selectedIconImages = [];
            this.selectedIconImages.push({ file, preview: reader.result as string });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeProjectImage(index: number): void {
    this.selectedProjectImages.splice(index, 1);
  }

  removeIconImage(index: number): void {
    this.selectedIconImages.splice(index, 1);
  }
}
