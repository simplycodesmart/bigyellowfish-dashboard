import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  isLoggedIn() {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
