import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyBorrowerComponent } from './proxy-borrower.component';

describe('ProxyBorrowerComponent', () => {
  let component: ProxyBorrowerComponent;
  let fixture: ComponentFixture<ProxyBorrowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProxyBorrowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProxyBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
