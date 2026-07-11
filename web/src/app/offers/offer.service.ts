import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../offer';
import { environment } from '../../environments/environment';
import { GetOffersRequest } from './get-offers-request';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  getOffers(request: GetOffersRequest): Observable<Offer[]> {
    let url = `${environment.baseUrl}api/offers`
    let params = new HttpParams()
      .set('category', request.category)
      .set('sortOrder', request.sortOrder);

    if (Array.isArray(request.memory)) {
      request.memory.forEach(m => {
        params = params.append('memory', m);
      });
    } else {
      params = params.set('memory', request.memory)
    }

    if (Array.isArray(request.storage)) {
      request.storage.forEach(s => {
        params = params.append('storage', s);
      });
    } else {
      params = params.set('storage', request.storage)
    }

    return this.http.get<Offer[]>(url, { params })
  }

  getOffer(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${environment.baseUrl}api/offers/${id}`);
  }
}
