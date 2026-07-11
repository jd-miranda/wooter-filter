import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './bookmark';
import { of } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;
  let bookmarkService: jasmine.SpyObj<BookmarksService>;

  const mockBookmarks = <Bookmark[]>[
    <Bookmark>{
      id: 1,
      configurationId: 1,
      category: 'Desktops',
      title: 'Dell Optiplex 7080',
      photo: 'https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg',
      memoryCapacity: 16,
      storageSize: 512,
      price: 259.99,
      isSoldOut: false
    },
    <Bookmark>{
      id: 2,
      configurationId: 2,
      category: 'Desktops',
      title: 'Dell Optiplex 7080',
      photo: 'https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg',
      memoryCapacity: 16,
      storageSize: 256,
      price: 229.99,
      isSoldOut: false
    }
  ] 
    

  beforeEach(async () => {
    bookmarkService = jasmine.createSpyObj('BookmarksService', ['getBookmarks']);
    bookmarkService.getBookmarks.and.returnValue(of(mockBookmarks));

    await TestBed.configureTestingModule({
      imports: [
        BookmarksComponent,
        RouterLink,
        MatGridListModule,
        MatCardModule,
        RouterLink
      ],
      providers: [
        { provide: BookmarksService, useValue: bookmarkService },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate a grid of bookmarks', () => {
    expect(bookmarkService.getBookmarks).toHaveBeenCalledWith(null);
    expect(component.bookmarks).toEqual(mockBookmarks);

    // Test grid tiles.
    let grid = fixture.nativeElement
      .querySelector('mat-grid-list');
    let gridTiles = grid
      .querySelectorAll('mat-grid-tile');
    expect(gridTiles.length).toBeGreaterThan(0);

    // Test card tiles for content.
    let cards = fixture.nativeElement
      .querySelectorAll('mat-card');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((el: any, index: number) => {
      expect(el.textContent).toContain(component.bookmarks[index].title);
      expect(el.textContent).toContain(component.bookmarks[index].price);
    });
  });

  it('should not populate any bookmarks', fakeAsync(() => {
    bookmarkService.getBookmarks.and.returnValue(of([]));

    component.ngOnInit();
    tick(); // For observable.
    fixture.detectChanges();

    expect(component.bookmarks).toEqual([]);

    // Test grid tiles.
    let grid = fixture.nativeElement
      .querySelector('mat-grid-list');
    let gridTiles = grid
      .querySelectorAll('mat-grid-tile');
    expect(gridTiles.length).toEqual(0);
  }));
});
