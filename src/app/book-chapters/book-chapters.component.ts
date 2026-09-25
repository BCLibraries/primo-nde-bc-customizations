// This component hides the "Other Chapters of This Book" section when the "View It" service is not available.

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'custom-book-chapters',
  standalone: true,
  imports: [],
  templateUrl: './book-chapters.component.html',
  styleUrl: './book-chapters.component.scss',
})
export class BookChaptersComponent implements OnInit, OnDestroy {
  private hidingStyle?: HTMLStyleElement;
  private viewItObserver?: MutationObserver;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    if (this.document.querySelector('div.service_viewit')) {
      return;
    }

    this.hidingStyle = this.document.createElement('style');
    this.hidingStyle.dataset['bookChaptersVisibility'] = '';
    this.hidingStyle.textContent =
      '.otherChaptersOfThisBook, a[data-qa="book-chapters-indication"], .book-chapters-or-reviews-divider { display: none !important; }';
    (this.document.head ?? this.document.documentElement).appendChild(
      this.hidingStyle,
    );

    const MutationObserverConstructor =
      this.document.defaultView?.MutationObserver;
    if (MutationObserverConstructor) {
      this.viewItObserver = new MutationObserverConstructor(() => {
        if (this.document.querySelector('div.service_viewit')) {
          this.removeHidingStyle();
        }
      });
      this.viewItObserver.observe(this.document.documentElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.removeHidingStyle();
  }

  private removeHidingStyle(): void {
    this.viewItObserver?.disconnect();
    this.viewItObserver = undefined;
    this.hidingStyle?.remove();
    this.hidingStyle = undefined;
  }
}
