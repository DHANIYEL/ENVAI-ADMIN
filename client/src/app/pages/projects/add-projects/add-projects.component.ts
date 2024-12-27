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

  isProjectImageAdded: boolean = false;
  isIconImageAdded: boolean = false;

  isSubmitting: boolean = false;

  iconUrl: string[] = []; // Explicitly typed as string array
  projectUrl: string[] = []; // Explicitly typed as string array
  selectedIconImages: { file: File; preview: string }[] = [];
  selectedProjectImages: { file: File; preview: string }[] = [];
  amount: number = 0; // Initialize with a default value (0 in this case)

  selectedProjectImage: string | null = null;

  @ViewChild('projectForm') projectForm!: NgForm; // ViewChild for form reference

  constructor(private apiService: ApiService, private router: Router) {}

  // Submit the form with all data
  onSubmit(): void {
    if (this.isSubmitting) {
      return; // Prevent multiple submissions
    }

    this.isSubmitting = true; // Set the flag to true to disable the button

    const formData = new FormData();

    // Append form fields (text data) with new names
    formData.append('strTitle', this.projectForm.value.title); // title renamed to strTitle
    formData.append(
      'short_Description',
      this.projectForm.value.smallDescription
    ); // smallDescription renamed to short_Description
    formData.append(
      'long_Description',
      this.projectForm.value.detailedDescription
    ); // detailedDescription renamed to long_Description
    formData.append(
      'detail_Description',
      this.projectForm.value.detailedDescription
    ); // detailedDescription renamed to detail_Description

    // Append selected project images or project URL
    if (this.selectedProjectImages.length > 0) {
      this.selectedProjectImages.forEach(({ file }) => {
        formData.append('projectImages', file, file.name); // Attach image files if present
        console.log('Project Image:', file, 'Name:', file.name); // Log project image file and name
      });
      formData.append('projectUrls', JSON.stringify([])); // Pass empty array if project images are added
    } else {
      formData.append('projectUrls', JSON.stringify([this.projectUrl])); // Pass URL if no project images are selected
    }

    // Append selected icon images or icon URL
    if (this.selectedIconImages.length > 0) {
      this.selectedIconImages.forEach(({ file }) => {
        formData.append('iconImages', file, file.name); // Attach icon files if present
        console.log('Icon Image:', file, 'Name:', file.name); // Log icon image file and name
      });
      formData.append('iconUrls', JSON.stringify([])); // Pass empty array if icon images are added
    } else {
      formData.append('iconUrls', JSON.stringify([this.iconUrl])); // Pass URL if no icon images are selected
    }

    // Append amount field
    formData.append('amount', this.amount.toString()); // Convert amount to string for backend

    // Log the entire formData for debugging
    console.log('FormData Content:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value); // Log each key-value pair in formData
    });

    // Send the formData to the backend
    this.apiService.addProject(formData).subscribe(
      (response) => {
        console.log('Project added successfully:', response);
        alert('Project added successfully!');
        this.projectForm.reset(); // Reset the form
        this.selectedProjectImages = []; // Clear the selected project images
        this.selectedIconImages = []; // Clear the selected icon images
        this.amount = 0; // Reset the amount field (optional)

        // Navigate to the projects route
        this.router.navigate(['/projects']);
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
      }
    );
  }

  logFormData(formData: FormData) {
    // Convert FormData to a plain object for logging
    const data: any = {};
    formData.forEach((value, key) => {
      // If the key already exists, make it an array to hold multiple values
      if (data[key]) {
        data[key] = Array.isArray(data[key])
          ? [...data[key], value]
          : [data[key], value];
      } else {
        data[key] = value;
      }
    });
    console.log('Form Data:', data);
  }

  // In your component class, add:
  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      console.log(`File change detected for type: ${type}`);
      const files = Array.from(input.files);
      console.log('Selected files:', files);

      files.forEach((file) => {
        console.log('Processing file:', file);

        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          if (type === 'project') {
            this.selectedProjectImages = this.selectedProjectImages || [];
            this.selectedProjectImages.push({ file, preview });
            this.isProjectImageAdded = true; // Set flag when a project image is added
            console.log('Updated selectedProjectImages:', this.selectedProjectImages);
          } else if (type === 'icon') {
            this.selectedIconImages = this.selectedIconImages || [];
            this.selectedIconImages.push({ file, preview });
            this.isIconImageAdded = true; // Set flag when an icon image is added
            console.log('Updated selectedIconImages:', this.selectedIconImages);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      console.log('No files selected.');
    }
  }

  // Remove selected image
  removeImage(type: string, index: number): void {
    this.selectedProjectImages.splice(index, 1);
  }
  // Remove project image
  removeProjectImage(): void {
    this.selectedProjectImage = null;
    this.projectImages = [];
  }

  // Remove icon image
}
