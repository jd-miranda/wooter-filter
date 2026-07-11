import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideRouter, Router } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { AuthService } from './auth.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: Partial<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = {
      login: jasmine.createSpy('login')
    };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([{ path: '', component: AboutComponent }])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke onSubmit on form submission via button', () => {
    spyOn(component, 'onSubmit');

    const submit = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    submit.click();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should navigate to the home route on login', () => {
    spyOn(router, 'navigate');
    (authService.login as jasmine.Spy).and.returnValue(of({ success: true }));
    fixture.detectChanges();

    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  })

  it('should have a cancel button', () => {
    const cancel = fixture.debugElement.query(By.css('#cancel'));
    expect(cancel).toBeDefined();
    expect(cancel.attributes['ng-reflect-router-link']).toBe('/');
  })
});
