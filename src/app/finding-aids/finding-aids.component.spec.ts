import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { FindingAidsComponent } from './finding-aids.component';

describe('FindingAidsComponent', () => {
  let component: FindingAidsComponent;
  let fixture: ComponentFixture<FindingAidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindingAidsComponent],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(FindingAidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
