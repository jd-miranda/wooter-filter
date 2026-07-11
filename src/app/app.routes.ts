import { Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { OffersComponent } from './offers/offers.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { LoginComponent } from './auth/login.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    { path: "about", component: AboutComponent},
    { path: "login", component: LoginComponent },
    { path: "navbar", component: NavBarComponent },
    { path: "offers/:category", component: OffersComponent },
    { path: "offers/:category/:id", component: OfferItemComponent},
    { path: "bookmarks", component: BookmarksComponent},
    { path: "", redirectTo: "about", pathMatch: "full" }
];
