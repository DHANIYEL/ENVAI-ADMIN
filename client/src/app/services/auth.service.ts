import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'https://admin.envaiprojects.com/api/auth/login'; // Replace with your actual backend URL
  private apiUrl = 'http://localhost:5000/api/auth/login'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    // Define headers (if necessary)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Send login request to backend
    return this.http.post(this.apiUrl, loginData, { headers });
  }

  // Check if the user is logged in (i.e., if the token is in localStorage)
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken'); // Check for the token
    return token !== null;
  }

  // Save the token to localStorage (this is done after successful login)
  saveToken(token: string): void {
    localStorage.setItem('authToken', token); // Save token in localStorage
  }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Retrieve the token
  }

  // Logout method to clear authentication data
  logout(): void {
    localStorage.removeItem('authToken'); // Remove the token from local storage
    console.log('User logged out successfully');
  }
}
