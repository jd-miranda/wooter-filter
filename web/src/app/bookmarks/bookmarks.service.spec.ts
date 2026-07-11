import { TestBed } from '@angular/core/testing';

import { BookmarksService } from './bookmarks.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Bookmark } from './bookmark';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let httpTesting: HttpTestingController;

  const mockBookmark1 = <Bookmark>{
    id: 1,
    configurationId: 1,
    category: 'Desktops',
    title: 'Dell Optiplex 7080',
    photo: 'https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg',
    memoryCapacity: 16,
    storageSize: 512,
    price: 259.99,
    isSoldOut: false
  }

  const mockBookmark2 = <Bookmark>{
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

  const mockBookmarks: Bookmark[] = [
    mockBookmark1,
    mockBookmark2
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookmarksService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(BookmarksService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all bookmarks of the user', () => {
    service.getBookmarks(null).subscribe((bookmarks) => {
      expect(bookmarks).toEqual(mockBookmarks);
    })

    const req = httpTesting.expectOne((req) => req.url.includes('api/bookmarks'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('offerItemId')).toBeFalse();
    req.flush(mockBookmarks);
  })

  it('should get a single bookmark', () => {
    service.getBookmarks(1).subscribe((bookmarks) => {
      expect(bookmarks).toEqual([mockBookmark1]);
    })

    const req = httpTesting.expectOne((req) => req.url.includes('api/bookmarks'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('offerItemId')).toBeTrue();
    expect(req.request.params.get('offerItemId')).toEqual('1');
  });

  it('should get no bookmark', () => {
    service.getBookmarks(0).subscribe({
      next: () => fail('expected an error'),
      error: error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpTesting.expectOne((req) => req.url.includes('api/bookmarks'));
    expect(req.request.method).toBe('GET');
    req.flush('Bookmark not found', {
      status: 404,
      statusText: 'Not Found'
    });
  })
});
