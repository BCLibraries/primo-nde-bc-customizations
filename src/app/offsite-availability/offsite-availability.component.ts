import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'custom-offsite-availability',
  standalone: true,
  imports: [],
  templateUrl: './offsite-availability.component.html',
  styleUrl: './offsite-availability.component.scss',
})
export class OffsiteAvailabilityComponent implements OnInit, OnDestroy {
  private observer: MutationObserver | null = null;

  constructor(private el: ElementRef) {}

// Strip call number from availability line if "offsite" is present, and update aria-label accordingly

  ngOnInit(): void {
    this.stripCallNumber();

    // Set up a MutationObserver to catch when Primo dynamically updates or re-renders the availability line
    const parent = this.el.nativeElement.closest('nde-record-availability');
    if (parent) {
      this.observer = new MutationObserver(() => {
        this.stripCallNumber();
      });
      this.observer.observe(parent, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private stripCallNumber(): void {
    const parent = this.el.nativeElement.closest('nde-record-availability');
    if (!parent) return;

    const physLine = parent.querySelector('nde-physical-availability-line');
    if (!physLine) return;

    // Find all span elements within the physical availability line
    const spans = physLine.querySelectorAll('span');

    spans.forEach((span: Element) => {
      // Skip if we already processed this element to avoid infinite observer loops
      if (span.hasAttribute('data-stripped-call-number')) return;

      const text = span.textContent || '';
      if (text.toLowerCase().includes('offsite')) {
        // Match parentheses and their contents at the very end of the string, including leading whitespace
        const match = text.match(/(\s*\([^)]+\))\s*$/);

        if (match) {
          const callNumberPart = match[1];
          const strippedText = text.replace(callNumberPart, '');

          span.textContent = strippedText;
          span.setAttribute('data-stripped-call-number', 'true');

          // Update the aria-label on the parent button to ensure it matches the visible text
          const button = physLine.querySelector('button.available-at-button');
          if (button) {
            const ariaLabel = button.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.includes(callNumberPart)) {
              button.setAttribute(
                'aria-label',
                ariaLabel.replace(callNumberPart, ''),
              );
            }
          }
        }
      }
    });
  }
}
