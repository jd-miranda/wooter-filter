import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferItemComponent } from './offer-item.component';
import { AuthService } from '../auth/auth.service';
import { of, Subject } from 'rxjs';
import { OfferService } from '../offers/offer.service';
import { Offer } from '../offer';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { Bookmark } from '../bookmarks/bookmark';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('OfferItemComponent', () => {
  let component: OfferItemComponent;
  let fixture: ComponentFixture<OfferItemComponent>;
  let paramMapSubject: Subject<any>;
  let authService: any;
  let offerService: any;
  let offer: Offer;
  let bookmarkService: any;

  beforeEach(async () => {
    authService = {
      authStatus: of([true]) // mock property
    }

    offer = <Offer>{
      id: 1,
      category: "Desktops",
      title: "Dell Optiplex 7080",
      photo: "https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg",
      memoryCapacity: 16,
      storageSize: 512,
      price: "259.99",
      url: "https://computers.woot.com/offers/dell-optiplex-7080-micro-4?ref=w_cnt_lnd_cat_pc_5_72"
   }

    offerService = jasmine.createSpyObj<OfferService>('OfferService', ['getOffer']);
    offerService.getOffer.and.returnValue(
      of(offer)
    )

    bookmarkService = jasmine.createSpyObj<BookmarksService>('BookmarksService', ['getBookmarks'])
    bookmarkService.getBookmarks.and.returnValue(
      of([
        <Bookmark>{
          id: 1,
          configurationId: 1
        }
      ])
    )

    paramMapSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [OfferItemComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: OfferService, useValue: offerService },
        { provide: BookmarksService, useValue: bookmarkService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch offer data on init', () => {
    expect(offerService.getOffer).toHaveBeenCalledWith('1');
    expect(component.offer).toEqual(offer);
  });

  it('should display the title of the offer', () => {
    let title = fixture.nativeElement
      .querySelector('h1');
    expect(title.textContent).toEqual(component.offer?.title);
  });

  it('should display the product image of the offer', () => {
    let photo = fixture.nativeElement
      .querySelector('img');
    expect(photo.src).toEqual(component.offer?.photo);
  });

  it('should display the specifications of the offer', () => {
    let memory = fixture.nativeElement.querySelector('p.memory');
    let storage = fixture.nativeElement.querySelector('p.storage');
    let price = fixture.nativeElement.querySelector('p.price');
    expect(memory.textContent).toContain(component.offer?.memoryCapacity);
    expect(storage.textContent).toContain(component.offer?.storageSize);
    expect(price.textContent).toContain(component.offer?.price);
  });

  it ('should render a button to "View On Woot!"', () => {
    spyOn(component, 'viewOnWoot');
    const button = fixture.nativeElement.querySelector('button.view-on-woot');
    button.click();
    expect(component.viewOnWoot).toHaveBeenCalled();
  });

  it ('should render a button to "Bookmark"', () => {
    // Conditional rendering: no bookmark exists for the offer-item.
    bookmarkService.getBookmarks.and.returnValue(of([]));
    component.isBookmarked = false;
    fixture.detectChanges();

    spyOn(component, 'bookmark');
    const button = fixture.nativeElement.querySelector('button.add-bookmark');
    button.click();
    expect(component.bookmark).toHaveBeenCalled();
  });

  it ('should render a button to "Remove Bookmark"', () => {
    spyOn(component, 'removeBookmark');
    const button = fixture.nativeElement.querySelector('button.remove-bookmark');
    button.click();
    expect(component.removeBookmark).toHaveBeenCalled();
  });
});
