import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'custom-request-services',
  standalone: true,
  imports: [],
  templateUrl: './request-services.component.html',
  styleUrl: './request-services.component.scss',
})
export class RequestServicesComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private attempts = 0;
  private readonly MAX_ATTEMPTS = 40; // Max 10 seconds of polling (40 * 250ms)

  constructor(@Inject(DOCUMENT) private document: Document) {}

  // If item-level requests are available, shows help text in the Request section of the full record display. Requires items to be visible (not collapsed under holdings) first.

  ngOnInit(): void {
    // Poll the DOM every 250ms to ensure we catch the elements regardless of how asynchronously Primo VE renders them.
    this.intervalId = setInterval(() => {
      this.checkForButton();
    }, 250);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private checkForButton(): void {
    this.attempts++;

    if (this.attempts > this.MAX_ATTEMPTS) {
      clearInterval(this.intervalId);
      return;
    }

    // Ensure all location accordions are expanded
    const accordionButtons = this.document.querySelectorAll(
      'nde-location > div > div > div > button',
    );
    accordionButtons.forEach((btn) => {
      if (btn.getAttribute('aria-expanded') === 'false') {
        (btn as HTMLElement).click();
      }
    });

    const serviceButtons = this.document.querySelectorAll(
      'nde-location-item-service-button',
    );

    // Cast as HTMLElement so TypeScript lets us access the style property
    const requestMsg = this.document.getElementById(
      'item-level-request-msg',
    ) as HTMLElement;

    // Ensure BOTH elements exist on the page before applying styles
    if (serviceButtons.length > 0 && requestMsg) {
      // Check if it's already set to avoid redundant DOM writes
      if (requestMsg.style.display !== 'flex') {
        requestMsg.style.setProperty('display', 'flex', 'important');
      }

      // We found the buttons and updated the message, so we can stop polling!
      clearInterval(this.intervalId);
    }
  }
}
