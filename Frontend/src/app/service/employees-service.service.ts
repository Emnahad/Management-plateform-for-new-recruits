import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs'; // N'oubli!ez pas d'importer Observable



import { Router } from '@angular/router';
import { Employee } from '../Model/Employee.Model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeesServiceService {

 
  baseApiUrl: string = environment.baseApiUrl;


  constructor(private http: HttpClient, private router: Router) { }
  getAllEmployees(): Observable<Employee[]> { // La fonction renvoie un tableau d'employés, donc il faut utiliser Observable<Employee[]>
    return this.http.get<Employee[]>(this.baseApiUrl + 'api/Proj/employees');
  }

  searchEmployeesByName(name: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseApiUrl}api/Proj/Searchh?name=${name}`);
  }
}
