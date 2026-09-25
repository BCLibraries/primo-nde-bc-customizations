/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookChaptersComponent } from './book-chapters.component';

describe('BookChaptersComponent', () => {
  let component: BookChaptersComponent;
  let fixture: ComponentFixture<BookChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookChaptersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookChaptersComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('hides only current matching elements and restores their display on destroy', () => {
    const elements = document.createElement('div');
    elements.innerHTML = `
      <div class="otherChaptersOfThisBook" style="display: flex"></div>
      <a data-qa="book-chapters-indication"></a>
      <div class="book-chapters-or-reviews-divider"></div>
    `;
    document.body.appendChild(elements);

    fixture.detectChanges();

    const hiddenElements = elements.querySelectorAll<HTMLElement>(
      '.otherChaptersOfThisBook, a[data-qa="book-chapters-indication"], .book-chapters-or-reviews-divider',
    );
    hiddenElements.forEach((element) => {
      expect(element.style.getPropertyValue('display')).toBe('none');
    });

    fixture.destroy();

    expect(hiddenElements[0].style.getPropertyValue('display')).toBe('flex');
    expect(hiddenElements[1].style.getPropertyValue('display')).toBe('');
    expect(hiddenElements[2].style.getPropertyValue('display')).toBe('');
    elements.remove();
  });
});
