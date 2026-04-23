import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryLogoComponent } from './library-logo.component';

describe('LibraryLogoComponent', () => {
  let component: LibraryLogoComponent;
  let fixture: ComponentFixture<LibraryLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
