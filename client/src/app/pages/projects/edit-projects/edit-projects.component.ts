// edit-projects.component.ts
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SuccessModalComponent } from '../../../components/success-modal/success-modal.component';

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessModalComponent],
})
export class EditProjectsComponent implements OnInit {
  @ViewChild('projectForm') projectForm!: NgForm;

  isProjectImageAdded: boolean = false;
  isIconImageAdded: boolean = false;

  isSubmitting: boolean = false;
  showSuccessModal = false; // Flag to control modal visibility

  projects: any[] = []; // Define the projects array
  fkProjectId: string = '';
  projectDetails: any = {}; // Store project details
  iconUrl: string = '';
  projectUrl: string = '';
  amount: number = 0; // Amount

  selectedProjectImages: { file: File; preview: string }[] = [];
  selectedIconImages: { file: File; preview: string }[] = [];
  selectedProject: any = {}; // Initialize as an empty object

  loading: boolean = true;
  errorMessage: string = ''; // Loading indicator

  errorMessages = {
    title: '',
    smallDescription: '',
    detailedDescription: '',
    projectImages: '',
    iconImages: '',
    amount: ''
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.fkProjectId = params['id'];
        console.log('Project ID for editing:', this.fkProjectId);
      } else {
        console.error('No project ID provided in the route.');
      }
    });
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.apiService.getAllProjects().subscribe(
      (response) => {
        if (response && response.data) {
          // Map response data
          this.projects = response.data.map((project: any) => ({
            id: project.fkProjectId,
            strTitle: project.strTitle,
            short_Description: project.short_Description,
            long_Description: project.long_Description,
            strIconUrls: project.strIconUrls,
            strProjectUrls: project.strProjectUrls,
            amount: project.amount,
          }));

          // Filter the project by ID
          const filteredProject = this.projects.find(
            (project) => project.id === this.fkProjectId
          );

          if (filteredProject) {
            console.log('Filtered Project:', filteredProject);
            this.selectedProject = { ...filteredProject }; // Populate selectedProject
            this.iconUrl = filteredProject.strIconUrls[0] || '';
            this.projectUrl = filteredProject.strProjectUrls[0] || '';
          } else {
            console.error(
              'No project found with the given ID:',
              this.fkProjectId
            );
          }
        } else {
          console.error('Response data is empty or invalid.');
          this.projects = [];
        }
      },
      (error) => {
        console.error('Failed to fetch projects:', error);
      }
    );
  }
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


    if (!this.projectForm.value.amount || this.projectForm.value.amount <= 0) {
      this.errorMessages.amount = 'Amount is required and should be greater than 0';
      isValid = false;
    }

    // If validation fails, prevent form submission
    if (!isValid) {
      return;
    }

    // Proceed with form submission
    this.isSubmitting = true;

    const formData = new FormData();

    // Append the project ID (required for the backend)
    formData.append('fkProjectId', this.fkProjectId);

    // Append form fields (text data) with updated names
    formData.append('strTitle', this.projectForm.value.title);
    formData.append('short_Description', this.projectForm.value.smallDescription);
    formData.append('long_Description', this.projectForm.value.detailedDescription);
    formData.append('detail_Description', this.projectForm.value.detailedDescription);

    // Append selected project images if any are provided
    if (this.selectedProjectImages.length > 0) {
      this.selectedProjectImages.forEach(({ file }) => {
        formData.append('projectImages', file, file.name);
      });
      formData.append('projectUrls', JSON.stringify([])); // Pass empty array if project image is added
    } else {
      formData.append('projectUrls', JSON.stringify([this.projectUrl])); // Pass the entered URL if no project image
    }

    // Append selected icon images if any are provided
    if (this.selectedIconImages.length > 0) {
      this.selectedIconImages.forEach(({ file }) => {
        formData.append('iconImages', file, file.name);
      });
      formData.append('iconUrls', JSON.stringify([])); // Pass empty array if icon image is added
    } else {
      formData.append('iconUrls', JSON.stringify([this.iconUrl])); // Pass the entered URL if no icon image
    }

    // Append the amount value
    formData.append('amount', this.projectForm.value.amount.toString());

    // Log the formData for debugging
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Call the updateProject method
    this.apiService.updateProject(this.fkProjectId, formData).subscribe(
      (response) => {
        if (response && response.success) {
          console.log('Project updated successfully:', response);

          // Update the local projects array with the new data
          this.projects = this.projects.map((project) =>
            project.id === this.fkProjectId ? { ...project, ...response.data } : project
          );

          // Reset the form and fields
          this.projectForm.reset();
          this.selectedProjectImages = [];
          this.selectedIconImages = [];
          this.iconUrl = '';
          this.projectUrl = '';
          this.amount = 0;

          // Navigate to the projects page
          this.showSuccessModal = true;
        } else {
          console.error('Failed to update project:', response || 'Unknown error');
          alert(response?.message || 'Failed to update project. Please try again.');
        }
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error updating project:', error);
        alert('Failed to update project due to a network or server error. Please try again.');
      }
    );
  }
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


  // Method to close the success modal and navigate to the projects page
  closeSuccessModal(): void {
    this.showSuccessModal = false; // Hide the modal
    this.router.navigate(['/projects']); // Navigate to the projects page
  }

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
            console.log(
              'Updated selectedProjectImages:',
              this.selectedProjectImages
            );
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

  removeProjectImage(index: number): void {
    this.selectedProjectImages.splice(index, 1);
  }

  removeIconImage(index: number): void {
    this.selectedIconImages.splice(index, 1);
  }
}
