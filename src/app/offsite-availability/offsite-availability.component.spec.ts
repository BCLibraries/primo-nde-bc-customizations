import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffsiteAvailabilityComponent } from './offsite-availability.component';

describe('OffsiteAvailabilityComponent', () => {
  let component: OffsiteAvailabilityComponent;
  let fixture: ComponentFixture<OffsiteAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffsiteAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffsiteAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
