// This component monitors the nde-record-availability element for the presence of a hidden Find Online button. When none is found, it hides the LibKey Find Online button. It uses a MutationObserver to watch for changes in the DOM.

// This is necessary because the LibKey add-on hides the online availability section in the brief display and instead incorporates the Find Online button into its stack of services. This becomes a problem when a physical-only title triggers LibKey by ISSN.

import { AfterViewInit, Component, OnDestroy, ElementRef } from '@angular/core';

@Component({
  selector: 'custom-libkey-availability',
  standalone: true,
  imports: [],
  templateUrl: './libkey-availability.component.html',
  styleUrl: './libkey-availability.component.scss',
})
export class LibkeyAvailabilityComponent implements AfterViewInit, OnDestroy {
  private observer: MutationObserver | undefined;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const hostElement = this.elementRef.nativeElement;
    const parentRecordAvailability = hostElement.closest(
      'nde-record-availability',
    );

    if (!parentRecordAvailability) {
      return;
    }

    const checkForElement = () => {
      const onlineAvailability = parentRecordAvailability.querySelector(
        'nde-online-availability[data-ti-online-availability-hidden-by-third-iron="1"]',
      );

      if (onlineAvailability) {
        const hasButton = onlineAvailability.querySelector('button');

        if (!hasButton) {
          const stackedButton = parentRecordAvailability.querySelector(
            'stacked-button > button',
          ) as HTMLElement;
          if (stackedButton) {
            stackedButton.style.display = 'none';
          }
        }

        // Once we've found the element and acted on it, we can stop observing.
        if (this.observer) {
          this.observer.disconnect();
        }
        return true;
      }
      return false;
    };

    // Check if the element is already there
    if (checkForElement()) {
      return;
    }

    this.observer = new MutationObserver(() => checkForElement());

    this.observer.observe(parentRecordAvailability, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
