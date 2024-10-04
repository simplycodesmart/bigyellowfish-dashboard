import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly apiUrl = 'https://interview.bigyellowfish.io/api/Content/GetCSVData';

  constructor(private readonly http: HttpClient, private router: Router) { }

  getAnalyticsData() {
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(catchError(err => {
      this.router.navigate(['/login']);
      return of(err)
    }))
  }
}
