import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './bookmark';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bookmarks',
  imports: [
    MatGridListModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent implements OnInit, OnDestroy {
  private destroySubject = new Subject();
  bookmarks: Bookmark[] = [];

  constructor(
    private service: BookmarksService) {
  }

  ngOnInit(): void {
    this.service.getBookmarks(null)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: result => this.bookmarks = result,
        error: error => console.error(error)
      }
    );
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
