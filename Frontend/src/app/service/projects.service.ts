import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Import the Observable type
import { Project } from '../Model/Project.Model';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> { 
    return this.http.get<Project[]>('https://localhost:7290/api/Proj/project');
  }
  searchProjects(searchTerm: string): Observable<Project[]> {
    return this.http.get<Project[]>(`https://localhost:7290/api/Proj/search?searchTerm=${searchTerm}`);
  }
}
