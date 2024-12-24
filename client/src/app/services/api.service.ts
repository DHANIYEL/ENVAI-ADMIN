import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://localhost:5000/api'; // API base URL

  constructor(private http: HttpClient) {}

  // API call to send OTP
  sendOtp(payload: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/forgot-password`, payload);
  }

  // API call to verify OTP
  verifyOtp(payload: { email: string, otp: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/verify-otp`, payload);
  }
}
