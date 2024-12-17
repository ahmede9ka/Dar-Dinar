import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';  // Import Router for navigation
import { User } from '../../model/class/User'; // Assuming you have a User class for typing
import { APILoginResponseModel } from '../../model/interface/API_Login'; // For API response typing

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userObj: User = { email: '', password: '' }; // Initialize with empty user object
  private authService = inject(AuthService); // Inject AuthService
  private router = inject(Router); // Inject Router

  constructor() {}

  onSubmit() {
    this.authService.Login(this.userObj).subscribe({
      next: (response: any) => {
        console.log(response);
        // Store the API token in local storage
        localStorage.setItem('apiToken', response.api_token);
        // Optionally fetch user data and redirect
        this.authService.current().subscribe((data: any) => {
          console.log(data);
          this.router.navigate(['/dashboard']); // Redirect to dashboard after successful login
        });
      },
      error: (httpError) => {
        // Handle HTTP errors
        alert('Login failed: ' + httpError.message || httpError); // Show user-friendly error message
      },
    });
  }
}
