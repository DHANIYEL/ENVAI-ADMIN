import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router

export interface Project {
  id: number;
  name: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true
})
export class ProjectsComponent {

  constructor(private router: Router) {}  // Inject Router into the constructor


  projects: Project[] = [
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
    { id: 3, name: 'Project C' },
  ];

  addProject() {
    console.log('Add Project clicked');
    this.router.navigate(['/projects/add']);

  }

  // Explicitly type the project parameter as Project
  editProject(project: Project) {
    console.log('Edit Project clicked for', project);
    // Handle edit project functionality
  }

  // Explicitly type the project parameter as Project
  deleteProject(project: Project) {
    console.log('Delete Project clicked for', project);
    // Handle delete project functionality
  }
}
