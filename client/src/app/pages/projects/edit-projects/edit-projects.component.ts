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
      detailedDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fkProjectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.fkProjectId) {
      this.loadProjectDetails();
    }
  }

  loadProjectDetails(): void {
    this.apiService.getAllProjects().subscribe(
      (response: any) => {
        if (response && response.success === true) {
          const project = response.data.find((p: any) => p.id === this.fkProjectId);
          if (project) {
            this.projectFormGroup.patchValue({
              title: project.strTitle,
              smallDescription: project.short_Description,
              detailedDescription: project.long_Description,
            });
            this.projectImages = project.projectImages || [];
            this.details = project.details || [];
            this.selectedProjectImage = project.projectImages[0]?.url || null;
            this.selectedIconImage = project.iconImages[0]?.url || null;
          }
        }
      },
      (error) => {
        alert('Error loading project details.');
      }
    );
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

  updateProject(): void {
    const formData = new FormData();
    formData.append('strTitle', this.projectFormGroup.value.title);
    formData.append('short_Description', this.projectFormGroup.value.smallDescription);
    formData.append('long_Description', this.projectFormGroup.value.detailedDescription);

    // Add project images
    if (this.projectImages.length > 0) {
      this.projectImages.forEach((file) => {
        formData.append('projectImages', file, file.name);
      });
    }

    // Add icon images
    if (this.iconImages.length > 0) {
      this.iconImages.forEach((file) => {
        formData.append('iconImages', file, file.name);
      });
    }

    // Add details as a JSON string
    if (this.details.length > 0) {
      const detailsJson = JSON.stringify(this.details);
      formData.append('details', detailsJson);
    }

    // Add the project ID for updating
    formData.append('fkProjectId', this.fkProjectId);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.apiService.updateProject(formData, { headers }).subscribe(
      (response) => {
        if (response.success) {
          alert('Project updated successfully!');
          this.router.navigate(['/projects']);
        } else {
          alert('Failed to update project.');
        }
      },
      (error) => {
        alert('Error updating project.');
      }
    );
  }

  logFormData(formData: FormData) {
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log('Form Data:', data);
  }
}
