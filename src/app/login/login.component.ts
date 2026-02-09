import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitting = false;
  showPassword = false;

  // For premium UX feedback
  registrationSuccess = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], // Removed minLength for a standard login form
      remember: [false]
    });
  }

  ngOnInit(): void {
    // Check for the 'registered' query parameter from the registration page
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params['registered'] === 'true') {
        this.registrationSuccess = true;
      }
    });
  }

  // --- Convenience Getters ---
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = null; // Reset error on new submission

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.submitting = false;
        // Successful login, navigate to home or dashboard
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.submitting = false;
        // Provide clear feedback to the user on failure
        this.errorMessage = 'Invalid email or password. Please try again.';
        console.error('Login failed:', err);
      }
    });
  }
}
