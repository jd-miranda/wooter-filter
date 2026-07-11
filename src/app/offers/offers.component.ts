import { Component, effect, inject, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { Offer } from '../offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { OfferService } from './offer.service';
import { combineLatestWith, map, Subject, switchMap, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GetOffersRequest } from './get-offers-request';

@Component({
  selector: 'app-offers',
  imports: [
    RouterLink,
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
    CommonModule
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit, OnDestroy {
  private destroySubject = new Subject();
  public offers: Offer[] = [];
  pagedOffers: Offer[] = [];
  length: number = 0;
  pageSize: number = 12;
  sortOptions = [
    {value: 'asc', viewValue: 'Lowest Price'},
    {value: 'desc', viewValue: 'Highest Price'}
  ];
  sortControl = new FormControl(this.sortOptions[0].value);
  category: string = '';
  memory: number[] = [];
  storage: number[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: OfferService) {}

  ngOnInit() {
    // Subscribe to changes in sort selection.
    this.sortControl.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(order => {
        this.router.navigate([], {
        relativeTo: this.activatedRoute,
            queryParams: { order },
            queryParamsHandling: 'merge',
        })
      }
    );

    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroySubject),
        // Combine to prevent multiple calls on category switch.
        // Initially emitted by [queryParam] in the navigation bar component.html,
        // allowing changes in either param or queryparam to trigger the service call.
        combineLatestWith(this.activatedRoute.queryParamMap),
        map(([params, queryParams]) => ({
          category: params.get('category'),
          memory: queryParams.getAll('memory'),
          storage: queryParams.getAll('storage'),
          page: queryParams.get('page'),
          order: queryParams.get('order')
        })),
        switchMap(({category, memory, storage, page, order}) => {
          // Set sort selection to query param.
          if (order && this.sortOptions.find(opt => opt.value === order)) {
            this.sortControl.setValue(order, { emitEvent: false });
          } else {
            this.sortControl.setValue('asc', { emitEvent: false });
          }

          let getOffersRequest = <GetOffersRequest>{
            category: category || '',
            memory: memory.map(Number) || [],
            storage: storage.map(Number) || [],
            sortOrder: order || ''
          };

          return this.service.getOffers(getOffersRequest)
            .pipe(map(result => ({category, memory, storage, page, result})))
        }
        )
      )
      .subscribe(({category, memory, storage, page, result}) => {
        this.paginator.pageIndex = Number(page) || 0;
        this.offers = result;
        this.paginateOffers(this.paginator.pageIndex);
        this.category = category || '';
        this.memory = memory.map(Number) || [];
        this.storage = storage.map(Number) || [];

        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { page: page, memory: this.memory, storage: this.storage },
          queryParamsHandling: 'merge',
        });
      });
  }

  // Called when navigated to with, e.g., offer-item-component "Back" button.
  /*
  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let page = params['page'] || 0;
      this.paginator.pageIndex = page;
    });
  }
  */

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  onPageChange(event: PageEvent) {
    this.paginateOffers(event.pageIndex);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,        // keep route
      queryParams: { page: event.pageIndex }, // update query param
      queryParamsHandling: 'merge',
    });
  }

  // Append parameters for memory in the request, then paginate the response.
  onFiltersChange(filters: {memory: number[]; storage: number[]}) {
    let params = new HttpParams();
  
    filters.memory.forEach(selected => params = params.append('memory', selected));
    filters.storage.forEach(selected => params = params.append('storage', selected));

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { 
        page: 0,
        memory: params.getAll('memory'),
        storage: params.getAll('storage'),
      },
      queryParamsHandling: 'merge',
    });
  }

  // Adapted from answer to "How to use angular-material pagination with mat-card?"
  // at https://stackoverflow.com/a/54308594
  private paginateOffers(pageIndex: number) {
    let startIndex = pageIndex * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    this.length = this.offers.length;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.pagedOffers = this.offers.slice(startIndex, endIndex);
  }
}
