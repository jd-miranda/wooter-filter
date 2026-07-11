import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
 
 @Component({
   selector: 'app-nav-bar',
   imports: [
     RouterLink,
     MatToolbarModule,
     MatIconModule
   ],
   templateUrl: './nav-bar.component.html',
   styleUrl: './nav-bar.component.scss'
 })
 export class NavBarComponent implements OnInit, OnDestroy {
  private destroySubject = new Subject();
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    authService.authStatus
    .pipe(takeUntil(this.destroySubject))
    .subscribe(result => this.isLoggedIn = result)
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
 }