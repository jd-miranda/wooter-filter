import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  let token = localStorage.getItem('computer_comparator_jwt');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  return next(req).pipe(catchError(error => {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      router.navigate(['/login']);
    }
    return throwError(() => error);
  }));
};
