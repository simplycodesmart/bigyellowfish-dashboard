import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API } from '../constants';
import { User, UserCred } from '../models/User';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private readonly http: HttpClient, private readonly router: Router, private toastr: ToastrService) { }

  login(credentials: UserCred) {
    return this.http.post<User>(`${API}/User/authenticate`, credentials).pipe(catchError(err => {
      this.logout()
      return of(err)
    })).subscribe(response => {
      sessionStorage.setItem('token', response.token);
      this.router.navigate(['/dashboard']);
    });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.toastr.success('Logged Out Sucessfully')
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('token');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }
}
