import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
//import { HttpClientModule } from '@angular/common/http';

import { Router } from '@angular/router';
import { of, delay, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  
    ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup!: FormGroup; // Ensure proper typing
  secondFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  isLinear = true;
  photo: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}
  

  ngOnInit() {
    this.initializeFormGroups();
   
     
  }

  // Initialize form groups
  private initializeFormGroups(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.asyncEmailValidator()],
      ],
    });

    this.secondFormGroup = this._formBuilder.group({
      Date_of_birth: ['', Validators.required],
      num_tel: [
        '',
        [Validators.required, Validators.pattern(/^\d{8,15}$/)],
      ],
    });

    this.passwordFormGroup = this._formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  
  // Password match validator
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Handle photo upload
  onPhotoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photo = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Handle form submission
  async onSubmit() {
    if (
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.passwordFormGroup.valid
    ) {
      // Perform any async operations before preparing the form data
      await this.mockApiRequest();
  
      // Destructure and prepare the form data
      const { confirmPassword, ...passwordGroupValues } = this.passwordFormGroup.value;
  
      const formData = {
        "username": this.firstFormGroup.value.firstname, // Assuming username is the firstname
        "password": passwordGroupValues.password,
        "email": this.firstFormGroup.value.email,
        "date": this.secondFormGroup.value.Date_of_birth,
        "sex": this.firstFormGroup.value.lastname, // Assuming sex is the lastname
        "img": this.photo || 'Default photo URL or message', // Fallback for photo
      };
  
      // Send the form data to the server via the AuthService
      this.authService.register(formData).subscribe({
        next: (data: any) => {
          console.log('Server Response:', data);
          console.log('Form Submitted Successfully!');
          // Navigate to login after successful registration
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Error during registration:', error);
          // Handle errors appropriately (e.g., show a message to the user)
        },
      });
  
      // Log the form data for debugging
      console.log('Form Data:', formData);
    } else {
      console.error('Form is invalid! Please check the fields.');
      // Optionally, highlight the invalid fields or show an error message
    }
  }
  
  

  // Simulated async validator for email
  asyncEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return of(control.value).pipe(
        delay(1000),
        map((email) => {
          return email.includes('invalid') ? { emailTaken: true } : null;
        })
      );
    };
  }

  // Simulated API request for form submission
  private mockApiRequest(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Simulating API request...');
      setTimeout(() => {
        console.log('API request completed');
        resolve();
      }, 1500);
    });
  }

}
