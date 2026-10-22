/*
 * This component hides the "Other Chapters of This Book" section when the "View It" service is not available.
 * Applies base CSS in the Decorator, and then goes in after and replaces the anchor elements with spans
 * because dead anchor elements are bad for accessibility.
 * The base CSS removes the flickering of styles when the page fully loads because Angular
 * - EL
*/

import { DOCUMENT } from '@angular/common';

import { Component, Inject, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nde-book-chapters-or-reviews-item-after',
  standalone: true,
  template: '',
  styles: [`
  /* we love a lookahead */
    body:has(div.service_viewit) { 
      [id*="otherChaptersOfThisBook"], [id*="chaptersOfThisBook"] {
        nde-book-chapters-or-reviews-item a.link {
          pointer-events: none;
          cursor: text;
          color: inherit;
          text-decoration: none;

          mat-icon { display: none !important; }
        }
      }
    }
  `],
  encapsulation: ViewEncapsulation.None // forces Angular to keep the css raw instead of scoping it to the component. needed for the Decorator styles
})
export class BookChaptersComponent implements OnInit, OnDestroy {
  private observer?: MutationObserver;
  private isQueued = false;

  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef) {}

  ngOnInit(): void {
    this.process();
    
    this.observer = new MutationObserver(() => {
      // requestAnimationFrame makes it not fire so much
      if (!this.isQueued) {
        this.isQueued = true;
        requestAnimationFrame(() => {
          this.process();
          this.isQueued = false;
        });
      }
    });

    this.observer.observe(this.document.body || this.document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy(): void {
    this.tossObserver();
  }

  private process(): void {
    if (this.hasViewIt()) {
        this.tossObserver();
        return;
    }

    // The closest() method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.
    // *= checks if contains substring because the actual IDs are whack??
    const container = this.el.nativeElement.closest('[id*="otherChaptersOfThisBook"], [id*="chaptersOfThisBook"]');
    if (!container) return;

    const links = container.querySelectorAll('nde-book-chapters-or-reviews-item a') as NodeListOf<HTMLAnchorElement>;
    if (!links.length) return;

    this.convertLinkstoSpans(links);
    this.tossObserver();
  }

  // double bang operator converts into a true/false boolean
  private hasViewIt(): boolean {
    return !!this.document.querySelector('div.service_viewit');
  }

  private convertLinkstoSpans(links: NodeListOf<HTMLAnchorElement>): void {
    links.forEach((anchor) => {
      const span = document.createElement('span');
      span.textContent = anchor.textContent;
      span.className = 'book-chapter-nolink';
      anchor.replaceWith(span);
    });
  }
  private tossObserver(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
