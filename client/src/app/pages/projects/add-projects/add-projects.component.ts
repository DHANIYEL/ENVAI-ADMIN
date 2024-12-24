import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class AddProjectsComponent {
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

  onFileSelect(event: any, fieldName: string): void {
    const file = event.target.files[0];
    if (file) {
      this.projectForm.form.patchValue({
        [fieldName]: file,
      });
      this.projectForm.form.get(fieldName)?.updateValueAndValidity();
    }
  }
}
