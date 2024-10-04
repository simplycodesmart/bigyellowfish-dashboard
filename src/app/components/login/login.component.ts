import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserCred } from '../../models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard'])
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
    }
  }
}
