import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalLoginComponent } from './institutional-login.component';

describe('InstitutionalLoginComponent', () => {
  let component: InstitutionalLoginComponent;
  let fixture: ComponentFixture<InstitutionalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionalLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
