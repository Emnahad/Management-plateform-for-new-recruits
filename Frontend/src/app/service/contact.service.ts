import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl: string = 'https://localhost:7290/api/Proj/contact';

  constructor(private http: HttpClient) { }

  sendContactForm(contactData: any): Observable<any> {
    // Specify responseType as 'text' to indicate plain text response
    return this.http.post(this.baseUrl, contactData, { responseType: 'text' });
  }
}
