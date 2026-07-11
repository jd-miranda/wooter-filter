import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OffersComponent } from './offers.component';
import { Offer } from '../offer';
import { OfferService } from './offer.service';
import { CommonModule } from '@angular/common';

describe('OffersComponent', () => {
  let component: OffersComponent;
  let fixture: ComponentFixture<OffersComponent>;

  beforeEach(async () => {
    // Mock offerService and mock its `getData` method.
    let service = jasmine.createSpyObj<OfferService>('OfferService', ['getOffers']);

    // Spy method.
    service.getOffers.and.returnValue(
      of([
        <Offer>{
          id: 1,
          category: "Desktops",
          title: "Dell Optiplex 7080",
          photo: "https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg",
          memoryCapacity: 16,
          storageSize: 512,
          price: "259.99",
          url: "https://computers.woot.com/offers/dell-optiplex-7080-micro-4?ref=w_cnt_lnd_cat_pc_5_72" }
      ])
    )

    await TestBed.configureTestingModule({
      imports: [
        OffersComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSidenavModule,
        SideBarComponent,
        MatGridListModule,
        MatCardModule,
        MatIconModule,
        MatPaginatorModule,
        CommonModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: OfferService,
          useValue: service
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersComponent);
    component = fixture.componentInstance;
    component.paginator = jasmine.createSpyObj(
      "MatPaginator", ["length", "pageIndex", "pageSize"]
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a "Offers" title', () => {
    let title = fixture.nativeElement
      .querySelector('h2.flex-item');
    expect(title.textContent).toEqual('Offers');
  });
 
  it('should contain a grid of one or more offers', () => {
    let grid = fixture.nativeElement
      .querySelector('mat-grid-list');
    let gridTiles = grid
      .querySelectorAll('mat-grid-tile');
    expect(gridTiles.length).toBeGreaterThan(0);
  });
});
