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
  userObj: User = { username: '', password: '' }; // Initialize with empty user object
  private authService = inject(AuthService); // Inject AuthService
  private router = inject(Router); // Inject Router

  constructor() {}

  onSubmit() {
    
    this.authService.Login(this.userObj).subscribe({
      next: (response: APILoginResponseModel) => {
        console.log(response);
        if (response.user) {
          if (response.role === 'client') {
            alert('Success! You are logged in.');
            this.router.navigateByUrl('/'); // Navigate to the home page or dashboard
          } else {
            alert('Access only for clients');
          }
        } else if (response.errors) {
          // Handle errors from response
          const errorMessage = response.errors.password || response.errors.email || 'Login failed';
          alert(errorMessage);
        }
      },
      error: (httpError) => {
        // Handle HTTP errors
        if (httpError.error && typeof httpError.error === 'object') {
          const errorResponse = httpError.error;
          const generalMessage = errorResponse.message || 'An unknown error occurred.';
          const emailError = errorResponse.errors?.email;
          const passwordError = errorResponse.errors?.password;
          let errorMessage = '';
          if (emailError) {
            errorMessage += `Email Error: ${emailError}\n`;
          }
          if (passwordError) {
            errorMessage += `Password Error: ${passwordError}\n`;
          }
          alert(errorMessage);
        } else {
          alert('Connection error. Please try again.');
        }
      },
    });
  }
}
