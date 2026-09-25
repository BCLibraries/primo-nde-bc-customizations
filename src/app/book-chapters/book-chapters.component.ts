// This component hides the "Other Chapters of This Book" section when the "View It" service is not available.

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'custom-book-chapters',
  standalone: true,
  imports: [],
  templateUrl: './book-chapters.component.html',
  styleUrl: './book-chapters.component.scss'
})
export class BookChaptersComponent implements AfterViewInit, OnDestroy {
  private readonly fallbackStyleId = 'book-chapters-no-viewit-styles';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    if (this.document.querySelector('div.service_viewit')) {
      return;
    }

    const style = this.document.createElement('style');
    style.id = this.fallbackStyleId;
    style.textContent = `
      .otherChaptersOfThisBook,
      a[data-qa="book-chapters-indication"],
      .book-chapters-or-reviews-divider {
        display: none !important;
      }
    `;
    this.document.head.appendChild(style);
  }

  ngOnDestroy(): void {
    this.document.getElementById(this.fallbackStyleId)?.remove();
  }
}
