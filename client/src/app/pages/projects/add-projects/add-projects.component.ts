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
  imageFile: File | null = null;
  iconFile: File | null = null;
  imagePreview: string | null = null; // Variable to store image preview URL
  details: { icon: string; description: string }[] = []; // Details array initialized empty

  @ViewChild('projectForm') projectForm!: NgForm; // Access the form directly using ViewChild

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    const formData = new FormData();

    // Append form values
    formData.append('title', this.projectForm.value.title);
    formData.append(
      'smallDescription',
      this.projectForm.value.smallDescription
    );
    formData.append(
      'detailedDescription',
      this.projectForm.value.detailedDescription
    );

    // Append files if available
    if (this.projectForm.value.image) {
      formData.append('image', this.projectForm.value.image);
    }
    if (this.projectForm.value.icon) {
      formData.append('icon', this.projectForm.value.icon);
    }

    // Append details array
    this.details.forEach((detail, i) => {
      formData.append(`detail[${i}][icon]`, detail.icon);
      formData.append(`detail[${i}][description]`, detail.description);
    });

    // Call the addProject API
    this.apiService.addProject(formData).subscribe(
      (response) => {
        console.log('Project added successfully:', response);
        alert('Project added successfully!');

        // Reset the form
        this.projectForm.reset();

        // Navigate to projects page after 500ms
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 500);
      },
      (error) => {
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
      }
    );
  }

  // Add New Detail (empty by default)
  addDetail() {
    this.details.push({ icon: '', description: '' });
  }

  // Remove Detail by Index
  removeDetail(index: number) {
    this.details.splice(index, 1);
  }

  // File List for Project Images
  projectImages: File[] = [];

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.projectImages = Array.from(input.files);
    }
  }

  onFileSelect(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      if (type === 'image') {
        this.imageFile = file;
        console.log('Image file selected:', file);
      } else if (type === 'icon') {
        this.iconFile = file;
        console.log('Icon file selected:', file);
      }
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // Set image preview URL
    };
    reader.readAsDataURL(file);
  }

  // Method to trigger file input for image or icon
  triggerFileInput(type: string): void {
    const fileInput = type === 'image' ? document.querySelector('#imageInput') : document.querySelector('#iconInput');
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  }

  // Drag-over event to prevent default behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Drop event for handling file drag and drop
  onDrop(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      if (type === 'image') {
        this.imageFile = file;
        this.previewImage(file); // Display image preview
        console.log('Image file dropped:', file);
      } else if (type === 'icon') {
        this.iconFile = file;
        console.log('Icon file dropped:', file);
      }
    }
  }
}
