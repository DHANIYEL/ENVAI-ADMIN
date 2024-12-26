import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators'; // Add this import at the top of your service file

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
  private baseUrl2: string = 'https://admin.envaiprojects.com/v2/api';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { strEmail: email, strPassword: password };
    return this.http
      .post<any>(`${this.baseUrl}/admin/admin_login`, loginData)
      .pipe(
        tap((response) => {
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

  verifyOtp(payload: {
    strEmail: string;
    strOTP: string;
    strNewPaswd: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/otp/verify_otp_and_passwd_reset`,
      payload
    );
  }

  // api.service.ts
  addProject(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // Or use a token service to get the token

    // Check if the token is available and valid
    if (!token) {
      console.error('No token found!');
      return new Observable(); // Handle error if token is not found
    }
    console.log("the Token is :",token)

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Send the POST request with the form data and headers
    return this.http.post(`${this.baseUrl2}/project/add_project`, formData, {
      headers,
    });
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
    return this.http.post<any>(
      `${this.baseUrl}/projects/get_all_projects`,
      payload,
      { headers }
    );
  }

  // Method to get user details by ID
  getUserById(): Observable<any> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // Handle case where token is missing (e.g., redirect to login)
      console.error('No token found');
      return of(null); // Return an empty observable with 'null' or any fallback data
    }

    // Set the token in the request headers
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Call the API with the token in the header
    return this.http
      .get(`${this.baseUrl}/admin/get_all_admins`, { headers })
      .pipe(
        tap(
          (response) => {
            console.log('User data fetched successfully:', response);
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        )
      );
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      console.error('No token found');
      return of(null); // Return an empty observable with 'null' or any fallback data
    }

    // Set up the headers with the authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `${this.baseUrl}/admin/update_admins`,
      userData,
      { headers }
    );
  }

  // Check old password and reset password
  updatePassword(oldPassword: string, newPassword?: string): Observable<any> {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      console.error('No token found');
      return of(null); // Return an empty observable with 'null' or any fallback data
    }

    // Set up the headers with the authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Prepare the body based on the presence of new password (for resetting password)
    const body = newPassword
      ? { strOldPassword: oldPassword, strNewPassword: newPassword }
      : { strOldPassword: oldPassword };

    // Send request to the same endpoint for both checking and updating password
    return this.http.post<any>(
      `${this.baseUrl}/admin/update_admin_passwd`,
      body,
      { headers }
    );
  }

  // Delete a project by ID
  deleteProject(fkProjectId: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found!');
      return new Observable(); // Handle error if token is not found
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Include fkProjectId in the body
    const body = { fkProjectId };

    return this.http.post(`${this.baseUrl}/project/delete_project`, body, { headers });
  }

  updateProject(projectId: string, projectData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      console.error('No token found');
      return of(null); // Handle the missing token gracefully
    }

    // Set the authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Send the POST request to update the project
    return this.http.post<any>(
      `${this.baseUrl2}/project/update_project`,
      projectData,
      { headers }
    );
  }



  // getProjectById(projectId: string): Observable<any> {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     console.error('No token found!');
  //     return new Observable();  // Return empty observable or handle error accordingly
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   return this.http.post(`${this.baseUrl}/projects/get_all_projects`, { headers });
  // }

}
