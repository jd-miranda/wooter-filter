import { Injectable } from '@angular/core';
import { LoginRequest } from './login-request';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse } from './login-response';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authStatus = new BehaviorSubject<boolean>(false);
  authStatus = this._authStatus.asObservable();

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    // NOTE: not fully reliable, as token expires.
    return localStorage.getItem('computer_comparator_jwt') != null;
  }

  private setAuthStatus(value: boolean): void {
    this._authStatus.next(value);
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    let url = `${environment.baseUrl}api/Admin/Login`;
    return this.http.post<LoginResponse>(url, loginRequest)
      .pipe(tap(loginResult => {
        if (loginResult.success) {
          localStorage.setItem('computer_comparator_jwt', loginResult.token);
          this.setAuthStatus(true);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('computer_comparator_jwt');
    this.setAuthStatus(false);
  }
}
