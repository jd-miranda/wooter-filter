import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { AuthService } from '../auth/auth.service';
import { provideRouter, Router, RouterLinkWithHref } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { OffersComponent } from '../offers/offers.component';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';
import { LoginComponent } from '../auth/login.component';
import { AboutComponent } from '../about/about.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let authService: any;
  let router: Router;
  let location: Location;

  const routes = [
    { 
      path: 'offers', children: [
        { path: 'desktops', component: OffersComponent },
        { path: 'laptops', component: OffersComponent }
      ]
    },
    { path: 'bookmarks', component: BookmarksComponent },
    { path: 'login', component: LoginComponent },
    { path: '', component: AboutComponent }
  ];

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated'], { authStatus: of(true) });
    authService.isAuthenticated.and.returnValue(true);
    authService.logout.and.returnValue({});
    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authService },
        MatToolbarModule,
        MatButtonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    router.initialNavigation()
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create all anchor tags', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    // Expect all anchors to have directive.
    expect(links.length).toEqual(5);
  })

  it('should create the logout anchor when authenticated', () => {
    const logout = fixture.debugElement.query(By.css('#logout'));
    expect(logout.nativeElement.textContent).toBe('Logout');

    spyOn(component, 'onLogout');
    logout.triggerEventHandler('click', null);
    expect(component.onLogout).toHaveBeenCalled();
  });

  it('should create the login anchor when not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);
    component.isLoggedIn = false;
    fixture.detectChanges();

    const login = fixture.debugElement.query(By.css('#login')).nativeElement;
    expect(login.textContent).toBe('Login');

    login.click();
    await fixture.whenStable(); // Wait for navigation to complete.
    expect(location.path()).toBe('/login');
  });

  it('should create the desktops anchor', async () => {
    const anchor = fixture.debugElement.query(By.css('#desktops')).nativeElement;
    expect(anchor.textContent).toBe('Desktops');

    anchor.click();
    await fixture.whenStable();
    expect(location.path()).toContain('/desktops');
  });

  it('should create the laptops anchor', async () => {
    const anchor = fixture.debugElement.query(By.css('#laptops')).nativeElement;
    expect(anchor.textContent).toBe('Laptops');

    anchor.click();
    await fixture.whenStable();
    expect(location.path()).toContain('/laptops');
  });

  it('should create the bookmark anchor', async () => {
    const anchor = fixture.debugElement.query(By.css('#bookmarks')).nativeElement;
    expect(anchor.textContent).toBe('Bookmarks');

    anchor.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/bookmarks');
  });
});
