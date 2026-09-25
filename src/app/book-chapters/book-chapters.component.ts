// This component hides the "Other Chapters of This Book" section when the "View It" service is not available.

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'custom-book-chapters',
  standalone: true,
  imports: [],
  templateUrl: './book-chapters.component.html',
  styleUrl: './book-chapters.component.scss',
})
export class BookChaptersComponent implements AfterViewInit, OnDestroy {
  private readonly elementsToRestore = new Map<
    HTMLElement,
    { display: string; priority: string }
  >();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    if (this.document.querySelector('div.service_viewit')) {
      return;
    }

    this.document
      .querySelectorAll<HTMLElement>(
        '.otherChaptersOfThisBook, a[data-qa="book-chapters-indication"], .book-chapters-or-reviews-divider',
      )
      .forEach((element) => {
        this.elementsToRestore.set(element, {
          display: element.style.getPropertyValue('display'),
          priority: element.style.getPropertyPriority('display'),
        });
        element.style.setProperty('display', 'none', 'important');
      });
  }

  ngOnDestroy(): void {
    this.elementsToRestore.forEach(({ display, priority }, element) => {
      if (display) {
        element.style.setProperty('display', display, priority);
      } else {
        element.style.removeProperty('display');
      }
    });
    this.elementsToRestore.clear();
  }
}
