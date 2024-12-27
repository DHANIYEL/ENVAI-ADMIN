import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { SuccessModalComponent } from 'src/app/components/success-modal/success-modal.component';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SuccessModalComponent],
})
export class AddProjectsComponent {
  projectImages: File[] = []; // Array to hold the project images
  iconImages: File[] = [];
  selectedImageUrl: string | null = null;

  isProjectImageAdded: boolean = false;
  isIconImageAdded: boolean = false;

  isSubmitting: boolean = false;
  showSuccessModal = false; // Flag to control modal visibility



  errorMessages = {
    title: '',
    smallDescription: '',
    detailedDescription: '',
    projectImages: '',
    iconImages: '',
    amount: ''
  };

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

    // Reset error messages
    this.resetErrorMessages();

    // Validation logic for required fields
    let isValid = true;

    if (!this.projectForm.value.title?.trim()) {
      this.errorMessages.title = 'Title is required';
      isValid = false;
    }

    if (!this.projectForm.value.smallDescription?.trim()) {
      this.errorMessages.smallDescription = 'Homepage Small Description is required';
      isValid = false;
    }

    if (!this.projectForm.value.detailedDescription?.trim()) {
      this.errorMessages.detailedDescription = 'Detailed Description is required';
      isValid = false;
    }
// Check for project images or project URL
if (this.selectedProjectImages.length === 0 && (!this.projectUrl || this.projectUrl.length === 0)) {
  this.errorMessages.projectImages = 'Project Images are required';
  isValid = false;
} else {
  this.errorMessages.projectImages = ''; // Clear error if condition is met
}

// Check for icon images or icon URL
if (this.selectedIconImages.length === 0 && (!this.iconUrl || this.iconUrl.length === 0)) {
  this.errorMessages.iconImages = 'Icon Images are required';
  isValid = false;
} else {
  this.errorMessages.iconImages = ''; // Clear error if condition is met
}



    if (!this.amount || this.amount <= 0) {
      this.errorMessages.amount = 'Amount is required and should be greater than 0';
      isValid = false;
    }

    if (!isValid) {
      return; // Prevent form submission if validation fails
    }

    // Proceed with form submission
    this.isSubmitting = true;

    const formData = new FormData();
    // Append form fields (text data) with new names
    formData.append('strTitle', this.projectForm.value.title);
    formData.append('short_Description', this.projectForm.value.smallDescription);
    formData.append('long_Description', this.projectForm.value.detailedDescription);
    formData.append('detail_Description', this.projectForm.value.detailedDescription);

    // Append selected project images
    if (this.selectedProjectImages.length > 0) {
      this.selectedProjectImages.forEach(({ file }) => {
        formData.append('projectImages', file, file.name);
      });
      formData.append('projectUrls', JSON.stringify([]));
    } else {
      formData.append('projectUrls', JSON.stringify([this.projectUrl]));
    }

    // Append selected icon images
    if (this.selectedIconImages.length > 0) {
      this.selectedIconImages.forEach(({ file }) => {
        formData.append('iconImages', file, file.name);
      });
      formData.append('iconUrls', JSON.stringify([]));
    } else {
      formData.append('iconUrls', JSON.stringify([this.iconUrl]));
    }

    // Append amount field
    formData.append('amount', this.amount.toString());

    this.apiService.addProject(formData).subscribe(
      (response) => {
        this.showSuccessModal = true;
        this.projectForm.reset();
        this.selectedProjectImages = [];
        this.selectedIconImages = [];
        this.amount = 0;
      },
      (error) => {
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
        this.isSubmitting = false;
      }
    );
  }

  // Method to reset error messages
  resetErrorMessages(): void {
    this.errorMessages = {
      title: '',
      smallDescription: '',
      detailedDescription: '',
      projectImages: '',
      iconImages: '',
      amount: ''
    };
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false; // Hide the modal
    this.router.navigate(['/projects']); // Navigate to the projects page
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
