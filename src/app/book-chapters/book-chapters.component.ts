// This component hides the "Other Chapters of This Book" section when the "View It" service is not available.

// AfterViewInit = called once component is initialized
// ElementRef = wrapped that lets us access DOM element
// DOCUMENT = lets us access DOM
import { DOCUMENT } from '@angular/common';

import { Component, Inject, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'custom-book-chapters',
  standalone: true,
  template: '',
})
export class BookChaptersComponent implements AfterViewInit, OnInit, OnDestroy {
  private hidingStyle?: HTMLStyleElement;
  private viewItObserver?: MutationObserver;
  private observer?: MutationObserver;
  

  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef) {}

  // called after component is initialized
  ngAfterViewInit(): void {
    
    // if there's a ViewIt, leave it alone
    if (this.document.querySelector('div.service_viewit')) {
      return;
    }
    // get parent elem
    // The closest() method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.
    const sectionContainer = this.el.nativeElement.closest('nde-record-book-chapters-or-reviews') || document.body;

    // get viewIt section for observation
    const viewIt = this.document.querySelector('div.service_viewit');

    this.convertLinksToSpans(sectionContainer);

    this.observer = new MutationObserver(() => {
      this.convertLinksToSpans(sectionContainer);
    });

    this.observer.observe(sectionContainer, { childList: true, subtree: true });
  }

  ngOnInit(): void {

    //     if (this.document.querySelector('div.service_viewit')) {
    //   return;
    // }

    // const MutationObserverConstructor = this.document.defaultView?.MutationObserver;
    // if (MutationObserverConstructor) {
    //   this.viewItObserver = new MutationObserverConstructor(() => {
    //     if (this.document.querySelector('div.service_viewit')) {
    //       this.removeCustomization();
    //     }
    //   });
    //   this.viewItObserver.observe(this.document.documentElement, {
    //     childList: true,
    //     subtree: true,
    //   });
    // }
  }

  ngOnDestroy(): void {
    this.removeCustomization();
  }

  private convertLinksToSpans(target: HTMLElement): void {
    const links = target.querySelectorAll<HTMLAnchorElement>('nde-book-chapters-or-reviews-item a');

    links.forEach((anchor) => {
      const span = document.createElement('span');
      span.innerHTML = anchor.innerHTML;
      span.className = 'book-chapter-nolink';
      anchor.parentNode?.replaceChild(span, anchor);
    });
  }

  private removeCustomization(): void {
    this.viewItObserver?.disconnect();
    this.viewItObserver = undefined;
    this.observer?.disconnect();
    this.observer = undefined;
    this.hidingStyle?.remove();
    this.hidingStyle = undefined;
  }
}
