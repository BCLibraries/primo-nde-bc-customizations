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

  it('hides matching elements when ViewIt is absent and restores display on destroy', () => {
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
      expect(getComputedStyle(element).display).toBe('none');
    });

    fixture.destroy();

    expect(getComputedStyle(hiddenElements[0]).display).toBe('flex');
    expect(hiddenElements[1].style.getPropertyValue('display')).toBe('');
    expect(hiddenElements[2].style.getPropertyValue('display')).toBe('');
    elements.remove();
  });

  it('does not hide matching elements when ViewIt is already present', () => {
    const elements = document.createElement('div');
    elements.innerHTML = `
      <div class="service_viewit"></div>
      <div class="otherChaptersOfThisBook"></div>
    `;
    document.body.appendChild(elements);

    fixture.detectChanges();

    expect(
      getComputedStyle(elements.querySelector('.otherChaptersOfThisBook')!)
        .display,
    ).not.toBe('none');
    expect(
      document.querySelector('style[data-book-chapters-visibility]'),
    ).toBeNull();

    elements.remove();
  });

  it('unhides matching elements when ViewIt is added later', async () => {
    const elements = document.createElement('div');
    elements.innerHTML = '<div class="otherChaptersOfThisBook"></div>';
    document.body.appendChild(elements);

    fixture.detectChanges();

    const chapters = elements.querySelector<HTMLElement>(
      '.otherChaptersOfThisBook',
    )!;
    expect(getComputedStyle(chapters).display).toBe('none');

    const viewIt = document.createElement('div');
    viewIt.className = 'service_viewit';
    elements.appendChild(viewIt);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    expect(getComputedStyle(chapters).display).not.toBe('none');
    expect(
      document.querySelector('style[data-book-chapters-visibility]'),
    ).toBeNull();

    elements.remove();
  });
});
