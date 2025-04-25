import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

//Interceptor
import {injectSessionInterceptor} from "./core/interceptors/inject-session.interceptor"

export const appConfig: ApplicationConfig = {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(withInterceptors([ injectSessionInterceptor ]), withFetch()),
      provideAnimationsAsync(),
      providePrimeNG({
        theme: {
            preset: Aura,
            options: {
              cssLayer: {
                  name: 'primeng',
                  order: 'tailwind-base, primeng, tailwind-utilities'
              }
          }
        }
    }), provideAnimationsAsync()
  ]
};
