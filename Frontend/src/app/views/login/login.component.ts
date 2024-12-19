import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router for navigation
import { User } from '../../model/class/User'; // Assuming you have a User class for typing
import { APILoginResponseModel } from '../../model/interface/API_Login'; // For API response typing

@Component({
  selector: 'app-login',
  standalone: true, // Ensure `standalone` is declared for standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userObj: User = { email: '', password: '' }; // Initialize with empty user object
  private authService = inject(AuthService); // Inject AuthService
  private router = inject(Router); // Inject Router

  constructor() {}

  onSubmit(): void {
    if (!this.userObj.email || !this.userObj.password) {
      alert('Please fill in both email and password.');
      return;
    }

    this.authService.Login(this.userObj).subscribe({
      next: (response: APILoginResponseModel) => {
        console.log(response);

        // Store the API token in localStorage
        

        // Fetch user data and redirect
        this.authService.current().subscribe({
          next: (data: any) => {
            console.log(data);

            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(data));
            
            // Redirect to dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (userError) => {
            console.error('Failed to fetch user data:', userError);
            alert('Failed to retrieve user information.');
          }
        });
      },
      error: (httpError) => {
        console.error('Login failed:', httpError);
        alert(`Login failed: ${httpError?.error?.message || 'Unknown error'}`);
      }
    });
  }
}
