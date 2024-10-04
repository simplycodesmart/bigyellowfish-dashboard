import { ResolveFn } from '@angular/router';
import { DataService } from '../services/data.service';
import { inject } from '@angular/core';
import { catchError, of, take } from 'rxjs';

export const dashboardDataResolver: ResolveFn<string> = (route, state) => {
  const dataService = inject(DataService);
  return dataService.getAnalyticsData().pipe(take(1))
};
