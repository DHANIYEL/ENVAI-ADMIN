import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpVerifiedGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Check if OTP is verified (You can store this in localStorage, sessionStorage, or a service)
    const otpVerified = localStorage.getItem('otpVerified') === 'true';

    if (otpVerified) {
      return true;
    } else {
      // Redirect to the OTP verification page if OTP is not verified
      this.router.navigate(['/verify-otp']);
      return false;
    }
  }
}
