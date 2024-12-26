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

selectedImageUrl: string | null = null;


  @ViewChild('projectForm') projectForm!: NgForm; // ViewChild for form reference

  details: { icon: string; description: string }[] = [];  // Initialize the details array
  projectImages: File[] = [];  // This property will hold the files selected for project images

  constructor(private apiService: ApiService, private router: Router) {}

  // Submit the form with all data
  onSubmit(): void {
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

    // Append details as a JSON string (the format you showed earlier)
    if (this.details.length > 0) {
      const detailsJson = JSON.stringify(this.details);
      formData.append('details', detailsJson);
    }

    // // Log the FormData to check its contents using forEach
    // formData.forEach((value, key) => {
    //   console.log(key + ': ' + value);
    // });

    // Send the formData containing text data, images, and details as JSON
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

onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files && input.files[0]) {
    this.projectImages = Array.from(input.files);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    this.projectImages = Array.from(files);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(files[0]);
  }
}

onDragOver(event: DragEvent): void {
  event.preventDefault();
}

onDragEnter(event: DragEvent): void {
  event.preventDefault();
  // Cast event.target to HTMLElement to access classList
  const target = event.currentTarget as HTMLElement;
  target.classList.add('border-blue-500'); // Optional: add visual feedback
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  // Cast event.target to HTMLElement to access classList
  const target = event.currentTarget as HTMLElement;
  target.classList.remove('border-blue-500'); // Optional: remove visual feedback
}

  // Add a new detail object to the details array
  addDetail() {
    this.details.push({ icon: '', description: '' });
  }

  // Remove a detail object by index
  removeDetail(index: number) {
    this.details.splice(index, 1);
  }
}
