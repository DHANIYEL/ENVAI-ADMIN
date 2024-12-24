import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth/login'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    // Define headers (if necessary)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl, loginData, { headers });
  }
}
