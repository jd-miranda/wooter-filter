import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let httpTesting: HttpTestingController;
  let http: HttpClient;
  let router: any;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router }
      ]
    });
    httpTesting = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTesting.verify();
  })

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock_token');
    http.get('api/offers').subscribe();
    const req = httpTesting.expectOne('api/offers');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_token');
    req.flush({});
  })

  it('should navigate to login on 401 response', () => {
    http.get('api/bookmarks').subscribe({
      next: () => fail('should fail with 401'),
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      }
    });

    const req = httpTesting.expectOne('api/bookmarks');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  })
});
