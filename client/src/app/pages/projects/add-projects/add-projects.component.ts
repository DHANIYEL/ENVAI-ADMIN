import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AddProjectsComponent {
  projectImages: File[] = []; // Array to hold the project images
  iconImages: File[] = [];
  selectedImageUrl: string | null = null;

  iconUrl: string = '';
  projectUrl: string = '';

  selectedProjectImage: string | null = null;
  selectedIconImage: string | null = null;

  @ViewChild('projectForm') projectForm!: NgForm; // ViewChild for form reference

  constructor(private apiService: ApiService, private router: Router) {}

  // Submit the form with all data
  onSubmit(): void {
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

    // Log formData to console for debugging
    this.logFormData(formData);

    // Send the formData containing text data, images, and URLs to the backend
    this.apiService.addProject(formData).subscribe(
      (response) => {
        if (response && response.success === true) {
          console.log('Project added successfully:', response);
          alert('Project added successfully!');
          this.projectForm.reset();
          this.router.navigate(['/projects']);
        } else {
          console.error('Failed to add project:', response);
          alert('Failed to add project. Please try again.');
        }
      },
      (error) => {
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
      }
    );
  }

  uploadFileToCloud(file: File) {
    // This is a placeholder function, implement actual cloud upload here
    // Example: Uploading file to AWS S3 and returning the file URL

    const uploadedFileUrl = `https://your-cloud-storage-url/${file.name}`;

    // Simulate an upload and return the file URL
    return of(uploadedFileUrl); // 'of' is from RxJS, simulating a successful upload
  }

  logFormData(formData: FormData) {
    // Convert FormData to a plain object for logging
    const data: any = {};
    formData.forEach((value, key) => {
      // If the key already exists, make it an array to hold multiple values
      if (data[key]) {
        data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      } else {
        data[key] = value;
      }
    });
    console.log('Form Data:', data);
  }

  // In your component class, add:
  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Only process images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        if (type === 'project') {
          reader.onload = (e) => {
            this.selectedProjectImage = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        } else if (type === 'icon') {
          reader.onload = (e) => {
            this.selectedIconImage = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  // Remove project image
  removeProjectImage(): void {
    this.selectedProjectImage = null;
    this.projectImages = [];
  }

  // Remove icon image
  removeIconImage(): void {
    this.selectedIconImage = null;
    this.iconImages = [];
  }

  // Drag and Drop Methods
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
      } else if (type === 'icon') {
        reader.onload = (e) => {
          this.selectedIconImage = e.target?.result as string;
        };
        reader.readAsDataURL(file);
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
}
