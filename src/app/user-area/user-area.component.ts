import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'custom-user-area',
  standalone: true,
  imports: [],
  templateUrl: './user-area.component.html',
  styleUrl: './user-area.component.scss',
})
export class UserAreaComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private attempts = 0;
  private readonly MAX_ATTEMPTS = 40; // Max 10 seconds of polling (40 * 250ms)

  constructor(@Inject(DOCUMENT) private document: Document) {}

// Swaps the order of the initials on the user menu

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.checkForSpan();
    }, 250);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private checkForSpan(): void {
    this.attempts++;

    if (this.attempts > this.MAX_ATTEMPTS) {
      clearInterval(this.intervalId);
      return;
    }

    // Get all spans inside the user area
    const spans = this.document.querySelectorAll('nde-user-area span');

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i] as HTMLElement;
      // Trim the text to ignore any accidental surrounding whitespace
      const text = span.textContent?.trim();

      if (text && text.length === 2) {
        // Swap the order of the two characters
        span.textContent = text[1] + text[0];

        // We successfully modified the text, so we can stop polling
        clearInterval(this.intervalId);
        return;
      }
    }
  }
}
