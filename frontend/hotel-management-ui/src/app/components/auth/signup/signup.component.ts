import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: ['']
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.signup(this.signupForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = 'Registration successful!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        } else {
          this.error = response.message || 'Registration failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'An error occurred during registration';
      }
    });
  }
}
