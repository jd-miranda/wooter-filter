import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarComponent } from './side-bar.component';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let queryParamsSubject = new Subject();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SideBarComponent,
        MatSidenavModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsSubject.asObservable() }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * // Check count of "unchecked" checkboxes; null/undefined as default values.
   * @param filter The specification filtered (e.g., "memory" or "storage").
   * @param numChecked The number of checkboxes expected to be checked.
   */
  function checkFalsyCheckboxCount(filter: string, numChecked: number) {
    expect(Object.values(component.filterForm.get(filter)?.value).filter(value => !value).length)
      .toBe(Object.keys(component.filterForm.get(filter)?.value).length - numChecked);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the updated collection when a mat-checkbox is toggled', () => {
    spyOn(component.selectedFiltersChanged, 'emit');
    component.filterForm.get('memory.16')?.setValue(true); // simulate user click
    fixture.detectChanges();
    expect(component.selectedFiltersChanged.emit).toHaveBeenCalledWith({ memory: [16], storage: []});

    component.filterForm.get('memory.8')?.setValue(true);
    component.filterForm.get('storage.512')?.setValue(true);
    fixture.detectChanges();
    expect(component.selectedFiltersChanged.emit).toHaveBeenCalledWith({ memory: [8, 16], storage: [512]});
  });

  it('should initialize the selections based on single query parameter', () => {
    queryParamsSubject.next({ memory: '16' });
    fixture.detectChanges();

    expect(component.filterForm.get('memory.16')?.value).toBe(true);
    checkFalsyCheckboxCount('memory', 1);
    checkFalsyCheckboxCount('storage', 0);
  });

  it('should initialize the selections based on separate query parameters', () => {
    queryParamsSubject.next({ memory: '16', storage: '256' });
    fixture.detectChanges();

    expect(component.filterForm.get('memory.16')?.value).toBe(true);
    expect(component.filterForm.get('storage.256')?.value).toBe(true);
    checkFalsyCheckboxCount('memory', 1);
    checkFalsyCheckboxCount('storage', 1);
  });

  it('should initialize the selections based on multiple values of a query parameter', () => {
    queryParamsSubject.next({ memory: ['8', '16'], storage: ['256'] });
    fixture.detectChanges();

    expect(component.filterForm.get('memory.8')?.value).toBe(true);
    expect(component.filterForm.get('memory.16')?.value).toBe(true);
    expect(component.filterForm.get('storage.256')?.value).toBe(true);

    checkFalsyCheckboxCount('memory', 2);
    checkFalsyCheckboxCount('storage', 1);
  });

  it('should check no boxes as none correspond to the query params', () => {
    queryParamsSubject.next({ memory: ['2'], storage: ['32'] });
    fixture.detectChanges();

    checkFalsyCheckboxCount('memory', 0);
    checkFalsyCheckboxCount('storage', 0);
  });
})
