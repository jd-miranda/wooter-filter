import { TestBed } from '@angular/core/testing';

import { OfferService } from './offer.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Offer } from '../offer';
import { GetOffersRequest } from './get-offers-request';

describe('OfferService', () => {
  let service: OfferService;
  let httpTesting: HttpTestingController;

  const mockOffer1 = <Offer>{
    id: 1,
    category: "Desktops",
    title: "Dell Optiplex 7080",
    photo: "https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg",
    memoryCapacity: 16,
    storageSize: 512,
    price: "259.99",
    url: "https://computers.woot.com/offers/dell-optiplex-7080-micro-4?ref=w_cnt_lnd_cat_pc_5_72"
  }

  const mockOffer2 = <Offer>{
    id: 2,
    category: "Desktops",
    title: "Dell Optiplex 7080",
    photo: "https://d3gqasl9vmjfd8.cloudfront.net/87ecd638-d90c-4006-ba40-87d01d6dd963.jpg",
    memoryCapacity: 16,
    storageSize: 256,
    price: "229.99",
    url: "https://computers.woot.com/offers/dell-optiplex-7080-micro-4?ref=w_cnt_lnd_cat_pc_5_72"
  }

  const mockOffers: Offer[] = [
    mockOffer1,
    mockOffer2
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OfferService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(OfferService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch Offers from the API', () => {
    const mockRequest = <GetOffersRequest>{
      category: 'Desktops',
      memory: [16],
      storage: <Number[]>[],
      sortOrder: 'asc',
    };

    service.getOffers(mockRequest).subscribe((offers) => {
      expect(offers).toEqual(mockOffers);
    });

    const req = httpTesting.expectOne((req) => req.url.includes('api/offers'));
    expect(req.request.method).toBe('GET');

    // Check query parameters.
    expect(req.request.params.has('category')).toBeTrue();
    expect(req.request.params.get('category')).toBe('Desktops');

    expect(req.request.params.has('memory')).toBeTrue();
    expect(req.request.params.get('memory')).toBe('16');

    req.flush(mockOffers);
  });

  it('should fetch an offer from the API', () => {
    service.getOffer('1').subscribe((offer) =>{
      expect(offer).toEqual(mockOffer1);
    });

    const req = httpTesting.expectOne((req) => req.url.includes('api/offers'));
    expect(req.request.method).toBe('GET');
    req.flush(mockOffer1);
  })

    it('should fetch no offer from the API (not found)', () => {
    service.getOffer('0').subscribe({
      next: () => fail('expected an error'),
      error: error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpTesting.expectOne((req) => req.url.includes('api/offers'));
    expect(req.request.method).toBe('GET');
    req.flush('Offer not found', {
      status: 404,
      statusText: 'Not Found'
    });
  })
});
