import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  imports: [
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  // FIXME: prevents DesktopsComponent initialization
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit, OnDestroy {
  private destroyedSubject = new Subject();
  @Output() selectedFiltersChanged =
    new EventEmitter<{memory: number[]; storage: number[]}>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly changeDetectorRef =  inject(ChangeDetectorRef);

  checkedMemory: number[] = [];
  category: string = '';

  // https://material.angular.io/components/checkbox/examples#checkbox-reactive-forms
  filterForm: FormGroup = this.formBuilder.group({
    memory: this.formBuilder.group({
      8: this.formBuilder.control(false), // define default, for .reset()
      16: this.formBuilder.control(false),
      32: this.formBuilder.control(false)
    }),
    storage: this.formBuilder.group({
      256: this.formBuilder.control(false),
      512: this.formBuilder.control(false),
      1000: this.formBuilder.control(false)
    })
  });

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroyedSubject))
      .subscribe(() => {
        this.selectedFiltersChanged.emit({
          memory: this.selectedMemory,
          storage: this.selectedStorage
        });
      }
    );
    // queryParams instead of params to clear filter
    // when clicking "Desktops" when already on desktop route
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyedSubject))
      .subscribe(params => {
        // Clear selections; e.g., when navigating to
        // "offers/laptops" away from "offers/desktops".
        this.category = params['category'];
        this.filterForm.reset(undefined, { emitEvent: false });
        // undefined: defaults set
    });
  }

  ngAfterViewInit() { 
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyedSubject))
      .subscribe(params => {
        let memoryParams: string[] = (
          Array.isArray(params['memory']) // edge case: single (non-array) param
            ? params['memory']   
            : [params['memory']]
        );
        let storageParams: string[] = (
          Array.isArray(params['storage'])
            ? params['storage']   
            : [params['storage']]
        ); 
        // restore selections (e.g., when returning from selected offer page)
        // optional chaining with ? prevents TypeError when form control null/undefined
        if (memoryParams.length != 0) {
          memoryParams.forEach(selected => this.memory.get((selected))?.setValue(true,
            { emitEvent: false })); // prevents call that reset page to 0
        }
        if (storageParams.length != 0) { // ERROR TypeError: Cannot read properties of null
          storageParams.forEach(selected => this.storage.get(selected)?.setValue(true,
            { emitEvent: false })); 
        }
      }
    );
    // Run another detection cycle to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyedSubject.next(true);
    this.destroyedSubject.complete();
  }

  get memory() {
    return this.filterForm.get('memory') as FormGroup;
  }

  get storage() {
    return this.filterForm.get('storage') as FormGroup;
  }

  get selectedMemory(): number[] {
    return Object.entries(this.memory.value)
      .filter(([option, isChecked]) => isChecked) // is true
      .map(([checked]) => Number.parseInt(checked));
  }

  get selectedStorage(): number[] {
    return Object.entries(this.storage.value)
      .filter(([option, isChecked]) => isChecked)
      .map(([checked]) => Number.parseInt(checked));
  }
}
