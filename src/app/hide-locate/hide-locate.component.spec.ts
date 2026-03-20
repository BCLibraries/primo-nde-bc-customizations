import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideLocateComponent } from './hide-locate.component';

describe('HideLocateComponent', () => {
  let component: HideLocateComponent;
  let fixture: ComponentFixture<HideLocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HideLocateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HideLocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
