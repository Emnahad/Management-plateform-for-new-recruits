// project.component.ts
import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ProjectsService } from '../service/projects.service';
import { Project } from '../Model/Project.Model';
import { ProjectPopupComponent } from '../project-popup/project-popup.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  modalRef: MdbModalRef<ProjectPopupComponent> | null = null;
  selectedProject: Project | null = null;

  currentPage = 1;
  itemsPerPage = 6;
  isLoading = true; // Loading flag
  searchTerm = '';
  constructor(private projectsService: ProjectsService, private modalService: MdbModalService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.isLoading = true;

    this.projectsService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (response) => {
        console.log(response);
        this.isLoading = false;
      }
    });
  }

  searchProjects() {
    if (this.searchTerm.trim() ===' ') {
      this.getAllProjects();
      return;
    }

    this.projectsService.searchProjects(this.searchTerm).subscribe({
      next: (projects: Project[]) => {
        // Filter projects based on the beginning of the title
        this.projects = projects.filter(project =>
          project.title.toLowerCase().startsWith(this.searchTerm.toLowerCase())
        );

        this.cdRef.detectChanges(); // Trigger change detection
      },
      error: (response) => {
        console.log(response);
      }
    });
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if the pressed key is "Enter"
    if (event.key === 'Enter') {
      this.searchProjects();
    }
  }
  openModal(project: Project) {
    console.log('Selected Project:', project);
    this.selectedProject = project; // Set the selected project before opening the modal

    // Pass the selected project data to the modal component using the 'data' property
    this.modalRef = this.modalService.open(ProjectPopupComponent, { data: { selectedProject: this.selectedProject } });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  getVisibleProjects(): Project[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.projects.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getPaginationArray(): number[] {
    const pageCount = Math.ceil(this.projects.length / this.itemsPerPage);
    return new Array(pageCount).fill(0).map((_, index) => index + 1);
  }
}
