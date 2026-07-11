import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear(); // Tokens saved to localStorage.

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request and store the token', () => {
    const credentials = <LoginRequest>{ userName: 'user', password: 'pw' };
    const mockResponse = <LoginResponse>{ success: true, token: 'mock-token' };

    service.login(credentials).subscribe(() => {
      const stored = localStorage.getItem('computer_comparator_jwt');
      expect(stored).toBe('mock-token');
    });

    const req = httpTesting.expectOne((req) => req.url.includes('api/Admin/Login'), 'Request login.');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    httpTesting.verify();
  });

  it('should no longer store the token and change auth status to false', () => {
    localStorage.setItem('computer_comparator_jwt', 'mock-token');
    const removeSpy = spyOn(localStorage, 'removeItem');

    service.logout(); // clear token

    expect(removeSpy).toHaveBeenCalledWith('computer_comparator_jwt');
    expect(service.isAuthenticated).toBeFalse;
    const stored = localStorage.getItem('computer_comparator_jwt');
    expect(stored).toBeNull;
  });
});
