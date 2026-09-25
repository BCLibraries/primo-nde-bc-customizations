import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookChaptersComponent } from './book-chapters.component';

describe('BookChaptersComponent', () => {
  let component: BookChaptersComponent;
  let fixture: ComponentFixture<BookChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookChaptersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
