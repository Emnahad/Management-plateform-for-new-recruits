import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Model/User.Model';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7290/api/Proj/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<User>(url);
  }

  updateUserProfile(id: number, updatedUser: User): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<any>(url, updatedUser);
  }
 
}