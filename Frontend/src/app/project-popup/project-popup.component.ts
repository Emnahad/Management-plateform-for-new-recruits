import { Component, Input } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Project } from '../Model/Project.Model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-popup',
  templateUrl: './project-popup.component.html',
  styleUrls: ['./project-popup.component.css']
})
export class ProjectPopupComponent {
  @Input() selectedProject: Project | null = null;

  constructor(public modalRef: MdbModalRef<ProjectPopupComponent>, private sanitizer: DomSanitizer, private http: HttpClient) { }


  getYouTubeEmbedUrl(): SafeResourceUrl | null {
    //console.log('Selected Project:', this.selectedProject);

    if (!this.selectedProject?.videoUrl) {
      console.log('No videoUrl available for the selected project.');
      return null;
    }


    const videoUrl = `https://www.youtube.com/embed/${this.extractVideoId(this.selectedProject.videoUrl)}`;
    //console.log('YouTube Video URL:', videoUrl);

    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  private extractVideoId(videoUrl: string): string | null {
    const videoIdMatch = videoUrl.match(/(?:\?v=|\/embed\/|\.be\/)([\w\d_-]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }
  
  downloadDocument() {
    console.log('Selected Project:', this.selectedProject);

    if (!this.selectedProject?.documentFileName) {
      console.log('No documentUrl available for the selected project.');
      return;
    }

    const documentUrl = `https://localhost:7290/api/Proj/download/${this.selectedProject.id}`;

    // Trigger the download using an anchor element
    const link = document.createElement('a');
    link.href = documentUrl;
    link.target = '_blank';
    link.download = this.selectedProject.documentFileName; // Set the suggested filename for the download
    link.click();
  }
}
  










