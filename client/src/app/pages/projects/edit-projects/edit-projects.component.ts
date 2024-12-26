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

  selectedProjectImages: { file: File; preview: string }[] = [];
  selectedIconImages: { file: File; preview: string }[] = [];

  fkProjectId: string = '';
  iconUrl: string = '';
  projectUrl: string = '';
  counter: number = 0;

  projectDetails: any = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fkProjectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.fkProjectId) {
      this.loadProjectDetails();
    }
  }

  loadProjectDetails(): void {
    this.apiService.getProjectById(this.fkProjectId).subscribe(
      (response: any) => {
        if (response && response.success === true) {
          const project = response.data.find((p: any) => p.fkProjectId === this.fkProjectId);
          if (project) {
            // Set form values after view is initialized
            setTimeout(() => {
              if (this.projectForm) {
                this.projectForm.form.patchValue({
                  title: project.strTitle,
                  smallDescription: project.short_Description,
                  detailedDescription: project.long_Description,
                });

                // Set other values
                this.iconUrl = project.iconUrls?.[0] || '';
                this.projectUrl = project.projectUrls?.[0] || '';
                this.counter = project.amount || 0;
              }
            });

            this.projectDetails = project;
          }
        }
      },
      (error) => {
        console.error('Error loading project details:', error);
      }
    );
  }

  onSubmit(): void {
    const formData = new FormData();

    // Append form fields with correct names
    formData.append('strTitle', this.projectForm.value.title);
    formData.append('short_Description', this.projectForm.value.smallDescription);
    formData.append('long_Description', this.projectForm.value.detailedDescription);
    formData.append('detail_Description', this.projectForm.value.detailedDescription);
    formData.append('fkProjectId', this.fkProjectId);

    // Append project images
    this.selectedProjectImages.forEach(({ file }) => {
      formData.append('projectImages', file, file.name);
    });

    // Append icon images
    this.selectedIconImages.forEach(({ file }) => {
      formData.append('iconImages', file, file.name);
    });

    // Append URLs as arrays
    formData.append('iconUrls', JSON.stringify([this.iconUrl]));
    formData.append('projectUrls', JSON.stringify([this.projectUrl]));

    // Add amount if needed
    formData.append('amount', this.counter.toString());

    // Get token and set headers
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.apiService.updateProject(formData, { headers }).subscribe(
      (response: any) => {
        if (response && response.success === true) {
          alert('Project updated successfully!');
          this.router.navigate(['/projects']);
        } else {
          alert('Failed to update project. Please try again.');
        }
      },
      (error) => {
        console.error('Error updating project:', error);
        alert('Failed to update project. Please try again.');
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
