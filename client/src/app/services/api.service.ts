import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Add this import at the top of your service file
import { Router } from '@angular/router';

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
  constructor(private http: HttpClient, private router: Router) {}


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found, logging out');
      this.logout().subscribe({
        next: () => {
          console.log('Logout successful');
          this.router.navigate(['/login']); // Redirect to the login page
        },
        error: (logoutError) => {
          console.error('Error during logout:', logoutError);
          this.router.navigate(['/login']); // Redirect even if logout fails
        },
      });

      // Throw an error to ensure no further execution in case of missing token
      throw new Error('Unauthorized access - token missing');
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      console.error('Unauthorized access, logging out:', error);
      this.logout().subscribe({
        next: () => {
          console.log('Logout successful');
          this.router.navigate(['/login']); // Redirect to the login page
        },
        error: (logoutError) => {
          console.error('Error during logout:', logoutError);
          this.router.navigate(['/login']); // Redirect even if logout fails
        },
      });
    }
    return throwError(() => new Error(error.message));
  }



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
  // Check if user is logged in based on token
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    console.log('Retrieved Token:', token); // Log the token for debugging
    return token !== null; // Return true if token exists, false otherwise
  }
  // Handle errors globally


  logout(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
      console.log('No token found, user is not logged in');
      return of(null); // Return an observable that emits null
    }

    // Create headers with the token for authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the Bearer token
    });

    // Send the logout request to the backend
    return this.http.post<any>(`${this.baseUrl}/admin/admin_logout`, {}, { headers }).pipe(
      tap((response) => {
        console.log('Logout Response:', response);
        // On successful logout, remove the token from localStorage
        localStorage.removeItem('token');
        console.log('Token removed, user logged out');
      }),
      catchError((error) => {
        console.error('Logout failed:', error);
        return throwError(() => new Error(error.message));
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
    }).pipe(
    catchError((error) => this.handleError(error))

    );
  }


  getAllProjects(): Observable<any> {
    const strLoginUserId = '6694bc261a50999f1740e118'; // Use the actual login user ID here

    // Request body with strLoginUserId
    const body = {
      strLoginUserId: strLoginUserId,
    };

    return this.http.post<any>(`${this.baseUrl}/projects/get_all_projects`, body).pipe(
      catchError((error) => this.handleError(error))

      );;
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
              catchError((error) => this.handleError(error))
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
    ).pipe(
      catchError((error) => this.handleError(error))

      );;
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
    ).pipe(
      catchError((error) => this.handleError(error))

      );;
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

    return this.http.post(`${this.baseUrl}/project/delete_project`, body, { headers }).pipe(
      catchError((error) => this.handleError(error))

      );;
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
    ).pipe(
      catchError((error) => this.handleError(error))

      );;
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
