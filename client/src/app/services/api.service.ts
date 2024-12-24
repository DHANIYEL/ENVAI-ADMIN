import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface Project {
  id: string;
  title: string;
  smallDescription: string;
  detailedDescription: string;
  image?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://localhost:5000/api'; // API base URL

  constructor(private http: HttpClient) {}


  login(loginData: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, loginData);
  }

  // API call to send OTP
  sendOtp(payload: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/forgot-password`, payload);
  }

  // API call to verify OTP
  verifyOtp(payload: { email: string, otp: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/verify-otp`, payload);
  }

  addProject(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, formData);
  }
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  // Method to get user details by ID
  // Method to get user details by _id (MongoDB ObjectId)
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

    updateUserProfile(userId: string, userData: any): Observable<any> {
      return this.http.patch<any>(`${this.baseUrl}/users/${userId}`, userData);
    }

}
