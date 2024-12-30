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
import { Router } from '@angular/router';
import { of, delay, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
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
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  isLinear = true;
  photo: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.initializeFormGroups();
  }

  private initializeFormGroups(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.asyncEmailValidator()]],
    });

    this.secondFormGroup = this._formBuilder.group({
      Date_of_birth: ['', Validators.required],
      num_tel: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
    });

    this.passwordFormGroup = this._formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

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

  async onSubmit() {
    if (
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.passwordFormGroup.valid
    ) {
      await this.mockApiRequest();

      const { confirmPassword, ...passwordGroupValues } = this.passwordFormGroup.value;

      const formData = {
        username: this.firstFormGroup.value.firstname,
        password: passwordGroupValues.password,
        email: this.firstFormGroup.value.email,
        date: this.secondFormGroup.value.Date_of_birth,
        sex: this.firstFormGroup.value.lastname,
        img: this.photo || 'Default photo URL or message',
      };

      this.authService.register(formData).subscribe({
        next: (data: any) => {
          console.log('Server Response:', data);
          console.log('Form Submitted Successfully!');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          if (error.status === 400) {
            console.error('Validation error on the server:', error.error);
            alert('Validation error: ' + (error.error?.message || 'Please check your input.'));
          } else if (error.status === 0) {
            console.error('Network error:', error.message);
            alert('Network error: Please check your internet connection.');
          } else {
            console.error('Unexpected error:', error.message);
            alert('Unexpected error occurred. Please try again later.');
          }
        },
      });
    } else {
      console.error('Form is invalid! Please check the fields.');
      this.highlightInvalidFields();
    }
  }

  private highlightInvalidFields(): void {
    const invalidFields: string[] = [];
    const controls = { ...this.firstFormGroup.controls, ...this.secondFormGroup.controls, ...this.passwordFormGroup.controls };
    Object.keys(controls).forEach((field) => {
      if (controls[field].invalid) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length) {
      alert(`The following fields are invalid: ${invalidFields.join(', ')}`);
    }
  }

  asyncEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return of(control.value).pipe(
        delay(1000),
        map((email) => (email.includes('invalid') ? { emailTaken: true } : null))
      );
    };
  }

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
