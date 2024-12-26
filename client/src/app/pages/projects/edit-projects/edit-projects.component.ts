import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';  // For accessing the form in template
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class EditProjectsComponent implements OnInit {
  @ViewChild('projectForm') projectForm!: NgForm;
  projectImages: File[] = [];
  iconImages: File[] = [];
  selectedProjectImage: string | null = null;
  selectedIconImage: string | null = null;
  fkProjectId: string = '';
  details: any[] = [];
  // Properties for icon and project URLs
  iconUrl: string = '';
  projectUrl: string = '';

  projectDetails: any = null; // Declare projectDetails to store project data

  // Form group to handle form fields
  projectFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectFormGroup = this.fb.group({
      title: ['', Validators.required],
      smallDescription: ['', Validators.required],
      detailedDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the project ID from the URL
    this.fkProjectId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Project ID:', this.fkProjectId); // Log project ID to console

    if (this.fkProjectId) {
      // Load project details
      this.loadProjectDetails();
    }
  }

  loadProjectDetails(): void {
    // Call your API to get the project details
    this.apiService.getProjectById(this.fkProjectId).subscribe(
      (response: any) => {
        if (response && response.success === true) {
          // Log the response to check if data is coming through
          console.log('Project data:', response.data);
          const project = response.data.find((p: any) => p.fkProjectId === this.fkProjectId);

          if (project) {
            // Populate the form fields with the data
            this.projectFormGroup.patchValue({
              title: project.strTitle,
              smallDescription: project.short_Description,
              detailedDescription: project.long_Description,
            });

            // Store project details
            this.projectDetails = project;

            // Log to confirm
            console.log('Loaded project details:', this.projectDetails);
          } else {
            console.warn('Project with the given ID not found.');
          }
        } else {
          console.error('Failed to load project data:', response.message);
        }
      },
      (error) => {
        console.error('Error loading project details:', error);
      }
    );
  }

  updateProject(): void {
    const formData = new FormData();

    // Ensure the arrays are initialized
    const projectImages = this.projectImages || [];
    const iconImages = this.iconImages || [];

    // Append text data from the form
    formData.append('strTitle', this.projectForm.value.title);
    formData.append('short_Description', this.projectForm.value.smallDescription);

    // Set long_Description and detail_Description to be the same
    const longDescription = this.projectForm.value.detailedDescription || '';
    formData.append('long_Description', longDescription);
    formData.append('detail_Description', longDescription);

    // Append project images (if any)
    if (projectImages && projectImages[0]) {
      projectImages.forEach((file) => {
        formData.append('projectImages', file, file.name);
      });
    }

    // Append icon images (if any)
    if (iconImages && iconImages[0]) {
      iconImages.forEach((file) => {
        formData.append('iconImages', file, file.name);
      });
    }

    // Get Icon URL and Project URL from the input fields
    const iconUrl = this.iconUrl; // Assuming iconUrl is a string from the input
    const projectUrl = this.projectUrl; // Assuming projectUrl is a string from the input

    // Append the URLs as arrays
    if (iconUrl) {
      formData.append('iconUrls', JSON.stringify([iconUrl])); // Wrap iconUrl in an array and convert it to JSON string
    }
    if (projectUrl) {
      formData.append('projectUrls', JSON.stringify([projectUrl])); // Wrap projectUrl in an array and convert it to JSON string
    }

    // Add the project ID for updating (this is the fkProjectId)
    formData.append('fkProjectId', this.fkProjectId);

    // Log formData to console for debugging
    this.logFormData(formData);

    // Get the token from localStorage for authorization
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Pass token in headers
    });

    // Send the formData containing text data, images, and URLs to the backend
    this.apiService.updateProject(formData, { headers }).subscribe(
      (response) => {
        if (response && response.success === true) {
          console.log('Project updated successfully:', response);
          alert('Project updated successfully!');
          this.router.navigate(['/projects']);
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

  logFormData(formData: FormData): void {
    // Use forEach to iterate over FormData and log key-value pairs
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  }



  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Only process image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        // Set up the onload event for the FileReader
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string; // The base64 string
          if (type === 'project') {
            this.selectedProjectImage = result;
          } else if (type === 'icon') {
            this.selectedIconImage = result;
          }
        };

        // Read the file as a DataURL (base64 string)
        reader.readAsDataURL(file);
      }
    }
  }

  onDrop(event: DragEvent, type: string): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      if (type === 'project') {
        reader.onload = (e) => {
          this.selectedProjectImage = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        this.projectImages = [file];
      } else if (type === 'icon') {
        reader.onload = (e) => {
          this.selectedIconImage = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        this.iconImages = [file];
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent, type: string): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add(type === 'icon' ? 'border-green-500' : 'border-blue-500');
  }

  onDragLeave(event: DragEvent, type: string): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove(type === 'icon' ? 'border-green-500' : 'border-blue-500');
  }


  removeProjectImage(): void {
    this.selectedProjectImage = null;
    this.projectImages = [];
  }

  removeIconImage(): void {
    this.selectedIconImage = null;
    this.iconImages = [];
  }

  addDetail(): void {
    this.details.push({ icon: '', description: '' });
  }

  removeDetail(index: number): void {
    this.details.splice(index, 1);
  }

}
