import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AddProjectsComponent {
  details: { iconUrl: string; projectUrl: string }[] = []; // Initialize the details array with icon and project URLs
  projectImages: File[] = []; // Array to hold the project images
  iconImages: File[] = [];
  selectedImageUrl: string | null = null;

  selectedProjectImage: string | null = null;
  selectedIconImage: string | null = null;

  @ViewChild('projectForm') projectForm!: NgForm; // ViewChild for form reference

  constructor(private apiService: ApiService, private router: Router) {}

  // Submit the form with all data
  onSubmit(): void {
    const formData = new FormData();

    // Append text data from the form
    formData.append('strTitle', this.projectForm.value.title);
    formData.append(
      'short_Description',
      this.projectForm.value.smallDescription
    );
    formData.append(
      'long_Description',
      this.projectForm.value.detailedDescription
    );

    // Append project images (if any)
    if (this.projectImages.length > 0) {
      this.projectImages.forEach((file) => {
        formData.append('projectImages', file, file.name);
      });
    }

    // Append icon images (if any)
    if (this.iconImages.length > 0) {
      this.iconImages.forEach((file) => {
        formData.append('iconImages', file, file.name);
      });
    }

    // Append details data
    if (this.details.length > 0) {
      this.details.forEach((detail, index) => {
        formData.append(`details[${index}].iconUrl`, detail.iconUrl);
        formData.append(`details[${index}].projectUrl`, detail.projectUrl);
      });
    }

    // Send the formData containing text data, images, and details
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


  addDetail() {
    this.details.push({ iconUrl: '', projectUrl: '' });
  }

  // Remove a detail object by index
  removeDetail(index: number) {
    this.details.splice(index, 1);
  }
}
