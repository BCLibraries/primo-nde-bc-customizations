import { DOCUMENT } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  Inject,
  ElementRef,
} from '@angular/core';
import { LINKS_TO_KEEP } from './links-to-keep';

@Component({
  selector: 'custom-links-filter',
  standalone: true,
  imports: [],
  templateUrl: './links-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .nde-hidden-link {
        display: none !important;
      }
    `,
  ],
})
export class LinksFilterComponent implements AfterViewInit, OnDestroy {
  private observer?: MutationObserver;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    try {
      this.startFiltering();
    } catch (e) {
      console.error('LinksFilterComponent: Error initializing filter', e);
    }
  }

  ngOnDestroy() {
    this.stopFiltering();
  }

  private startFiltering(): void {
    const hostElement = this.elementRef.nativeElement;
    // Target the closest expansion panel, or default to the parent element if not found
    const targetNode =
      hostElement.closest('.mat-expansion-panel-body') ||
      hostElement.parentElement;

    if (!targetNode) {
      return;
    }

    // 1. Run immediately in case the links are already rendered
    this.filterLinks(targetNode);

    // 2. Set up the observer to watch for DOM updates in this section
    this.observer = new MutationObserver(() => {
      this.filterLinks(targetNode);
    });

    this.observer.observe(targetNode, { childList: true, subtree: true });
  }

  private filterLinks(targetNode: Element): void {
    const linkContainers = targetNode.querySelectorAll('.links-container');
    if (linkContainers.length === 0) {
      return;
    }

    linkContainers.forEach((linkContainer: any) => {
      const children = Array.from(linkContainer.children) as HTMLElement[];

      children.forEach((child) => {
        if (child.classList.contains('nde-hidden-link')) {
          return;
        }

        const anchor =
          child.tagName.toLowerCase() === 'a'
            ? child
            : child.querySelector('a');
        if (!anchor) return;

        const textContent = (anchor.textContent || '')
          .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
          .replace(/[\s\u00A0]+/g, ' ')
          .trim();
        const ariaLabel = (anchor.getAttribute('aria-label') || '')
          .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
          .replace(/[\s\u00A0]+/g, ' ')
          .trim();

        const isMatch = LINKS_TO_KEEP.some(
          (keep) =>
            textContent.toLowerCase().includes(keep.toLowerCase()) ||
            ariaLabel.toLowerCase().includes(keep.toLowerCase()),
        );

        if (!isMatch) {
          child.classList.add('nde-hidden-link');
        }
      });
    });
  }

  private stopFiltering(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
