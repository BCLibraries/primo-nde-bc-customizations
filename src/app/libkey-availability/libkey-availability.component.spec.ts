import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibkeyAvailabilityComponent } from './libkey-availability.component';

describe('LibkeyAvailabilityComponent', () => {
  let component: LibkeyAvailabilityComponent;
  let fixture: ComponentFixture<LibkeyAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibkeyAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibkeyAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
