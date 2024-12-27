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
    formData.append('short_Description', this.projectForm.value.smallDescription); // smallDescription renamed to short_Description
    formData.append('long_Description', this.projectForm.value.detailedDescription); // detailedDescription renamed to long_Description
    formData.append('detail_Description', this.projectForm.value.detailedDescription); // detailedDescription renamed to detail_Description

    // Append selected project images to formData
    this.selectedProjectImages.forEach(({ file }) => {
      formData.append('projectImages', file, file.name); // projectImages remains the same
      console.log('Project Image:', file, 'Name:', file.name); // Log project image file and name
    });

    // Append selected icon images to formData
    this.selectedIconImages.forEach(({ file }) => {
      formData.append('iconImages', file, file.name); // iconImages remains the same
      console.log('Icon Image:', file, 'Name:', file.name); // Log icon image file and name
    });

    // Explicitly define the type of iconUrl and projectUrl
    const iconUrl: string[] = []; // Empty array for iconUrl
    formData.append('iconUrls', JSON.stringify(iconUrl)); // Renamed to iconUrls

    const projectUrl: string[] = []; // Empty array for projectUrl
    formData.append('projectUrls', JSON.stringify(projectUrl)); // Renamed to projectUrls

    // Commented out the amount field for later addition
    formData.append('amount', this.amount.toString()); // Add the amount value (converted to string) to the formData

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

        // Navigate to the .projects route
        this.router.navigate(['/projects']);
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
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (type === 'project') {
            if (!this.selectedProjectImages) this.selectedProjectImages = []; // Ensure it's initialized
            this.selectedProjectImages.push({ file, preview: reader.result as string });
          } else if (type === 'icon') {
            if (!this.selectedIconImages) this.selectedIconImages = []; // Ensure it's initialized
            this.selectedIconImages.push({ file, preview: reader.result as string });
          }
        };
        reader.readAsDataURL(file);
      });
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
