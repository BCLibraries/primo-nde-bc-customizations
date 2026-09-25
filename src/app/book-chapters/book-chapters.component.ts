import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'custom-book-chapters',
  standalone: true,
  imports: [],
  templateUrl: './book-chapters.component.html',
  styleUrl: './book-chapters.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BookChaptersComponent implements OnInit, OnDestroy {
  private observer?: MutationObserver;
  private readonly FALLBACK_CLASS = 'no-service-viewit';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.checkServiceViewIt();
    this.setupObserver();
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
    this.removeFallbackClass();
  }

  private checkServiceViewIt(): void {
    try {
      const hasViewIt = !!this.document.querySelector('div.service_viewit');
      if (!hasViewIt) {
        this.renderer.addClass(this.document.body, this.FALLBACK_CLASS);
      } else {
        this.removeFallbackClass();
      }
    } catch (e) {
      console.error(
        'BookChaptersComponent: Error checking div.service_viewit selector',
        e,
      );
    }
  }

  private setupObserver(): void {
    if (typeof MutationObserver === 'undefined') return;

    try {
      this.observer = new MutationObserver(() => {
        this.checkServiceViewIt();
      });

      this.observer.observe(this.document.body, {
        childList: true,
        subtree: true,
      });
    } catch (e) {
      console.error(
        'BookChaptersComponent: Error initializing MutationObserver',
        e,
      );
    }
  }

  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  private removeFallbackClass(): void {
    if (this.document?.body?.classList.contains(this.FALLBACK_CLASS)) {
      this.renderer.removeClass(this.document.body, this.FALLBACK_CLASS);
    }
  }
}
