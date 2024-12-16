import { Component, inject } from '@angular/core';

import { User } from '../../model/class/User';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { APILoginResponseModel } from '../../model/interface/API_Login';
import { Router } from '@angular/router';  // If you want to navigate after successful login



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userObj: User = new User();
  loginService = inject(AuthService);
  router = inject(Router);  
onSubmit() {
  this.loginService.Login(this.userObj).subscribe({
    next: (response: any) => {
      if (response.user) {
        if(response.role==="client"){
          alert("Success! You are logged in.");
          localStorage.setItem('client_id',response.id_role)
          localStorage.setItem('user_id',response.user );
          localStorage.setItem('token',response.token||"" );
          localStorage.setItem('role',"client");
          this.router.navigateByUrl('/');
        }else{
          alert("Access only for clients");
        }
        
      } else if (response.errors) {
        // More specific error handling for errors in response
        const errorMessage = 
          response.errors.password || 
          response.errors.email || 
          'Login failed';
        alert(errorMessage);
      }
    },
    error: (httpError) => {
       
      // Handle HTTP errors returned from the server
      if (httpError.error && typeof httpError.error === 'object') {
        // Access the JSON error response
        const errorResponse = httpError.error;
        // General error message
        const generalMessage = errorResponse.message || 'An unknown error occurred.';
        // Access specific fields from the JSON, if available
        const emailError = errorResponse.errors?.email;
        const passwordError = errorResponse.errors?.password;
        // Display error messages
        let errorMessage = ``;
        if (emailError) {
          errorMessage += `Email Error: ${emailError}\n`;
        }
        if (passwordError) {
          errorMessage += `Password Error: ${passwordError}\n`;
        }
        alert(errorMessage);
      } else {
        // Handle non-JSON errors (e.g., connection failures)
        alert('Connection error. Please try again.');
      }

    },
  });
}

signin(): void {
  this.router.navigate(['/signupclient']);
}


}
