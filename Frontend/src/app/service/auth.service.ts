import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7290/api/Proj/';
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) { 
   
  }
  
  
  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }
  getToken() {
    return localStorage.getItem('token')
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }
  signOut() {
    localStorage.clear();
    this.router.navigate(['/signin'])
  }
  
  getUserInfoFromToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        // Decode the JWT to get the user information
        const jwtData = token.split('.')[1];
        const decodedJwt = JSON.parse(atob(jwtData));
        console.log(decodedJwt );
        return decodedJwt; // This should contain user information
        
      } catch (e) {
        console.error('Error decoding JWT:', e);
        return null; // Return null if decoding fails
      }
    } else {
      return null; // Return null if token is not present
    }
  }
  
}

