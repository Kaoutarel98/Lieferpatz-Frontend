import {
  provideHttpClient,
  withFetch,
  withInterceptors
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '../app/services/AuthInterceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),  
    provideRouter(routes), provideAnimationsAsync(),provideClientHydration(),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor]))]

};
