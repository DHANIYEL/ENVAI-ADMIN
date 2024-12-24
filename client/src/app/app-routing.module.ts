import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LayoutComponent } from './layout/layout.component'; // Import LayoutComponent
import { VerifyOtpComponent } from './pages/auth/verify-otp/verify-otp.component';
import { OtpVerifiedGuard } from './services/otp-veryfied.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent,
    //  canActivate: [OtpVerifiedGuard]
  },

  { path: 'verify-otp', component: VerifyOtpComponent },  // Add your verify otp component
  {
    path: '', // Wrap dashboard and other protected routes inside LayoutComponent
    // component: ,
    children: [
      { path: 'dashboard', component: ProjectsComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'profile', component: ProfileComponent },
      // Add other routes that need sidebar and header here
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
