import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksFilterComponent } from './links-filter.component';

describe('LinksFilterComponent', () => {
  let component: LinksFilterComponent;
  let fixture: ComponentFixture<LinksFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinksFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
