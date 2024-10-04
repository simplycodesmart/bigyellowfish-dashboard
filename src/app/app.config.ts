import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(), provideRouter(routes), provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync(), {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],

};
