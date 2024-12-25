import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // Add this import at the top of your service file


export interface Project {
  id: string;
  title: string;
  smallDescription: string;
  detailedDescription: string;
  image?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://admin.envaiprojects.com/v1/api';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { strEmail: email, strPassword: password };
    return this.http.post<any>(`${this.baseUrl}/admin/admin_login`, loginData).pipe(
      tap(response => {
        console.log('Response:', response);
        if (response && response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          console.log('Token stored:', response.data.token);
        } else {
          console.log('Login failed or no token in response');
        }
      })

    );
  }




  // API call to send OTP
  sendOtp(payload: { strEmail: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/send_otp_for_reset`, payload);
  }

  verifyOtp(payload: { strEmail: string; strOTP: string; strNewPaswd: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/verify_otp_and_passwd_reset`, payload);
  }



  addProject(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, formData);
  }
  getAllProjects(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    // Log the token to ensure it's being retrieved correctly
    console.log('Retrieved token:', token);

    // Ensure token exists
    if (!token) {
      throw new Error('Token not found in localStorage. Please log in.');
    }

    // Payload to send with the request
    const payload = {
      token: token,
      // You can add any other data you need to pass in the payload, like filters, sorting, etc.
    };

    // Create headers with the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the Bearer token
    });

    // Make the HTTP request to get all projects with payload
    return this.http.post<any>(`${this.baseUrl}/projects/get_all_projects`, payload, { headers });
  }



  // Method to get user details by ID
  // Method to get user details by _id (MongoDB ObjectId)
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/users/${userId}`, userData);
  }

  // Check old password
  // Check old password
  checkOldPassword(email: string, oldPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/check-old-password`, {
      email,
      oldPassword,
    });
  }

  // Reset password
  resetPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, {
      email,
      newPassword,
      confirmPassword,
    });
  }
  // Delete a project by ID
  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projects/${projectId}`);
  }
}
