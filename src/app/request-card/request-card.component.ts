import {
  Component,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  Inject,
  ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'custom-request-card',
  standalone: true,
  imports: [],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.scss',
})
export class RequestCardComponent implements AfterViewInit, OnDestroy {
  private intervalId: any;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit(): void {
    // Run once immediately just in case they are already there
    this.modifyButtons();

    // Check the DOM every 250ms for dynamically loaded buttons
    this.intervalId = setInterval(() => {
      this.modifyButtons();
    }, 250);
  }

  ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private modifyButtons(): void {
    // Get the root node where THIS custom component lives.
    // If Primo wrapped us in a Shadow DOM, this returns that ShadowRoot.
    // If not, it returns the standard Document.
    const rootNode = this.elementRef.nativeElement.getRootNode() as
      | Document
      | ShadowRoot;

    // Strategy 1: Since we are mapped to `nde-request-card-top`, we might be inside
    // the card's Shadow DOM already! Let's look for the buttons right next to us.
    let buttons: Element[] = Array.from(
      rootNode.querySelectorAll('a.request-button'),
    );

    // Strategy 2: If we are not inside the card's Shadow DOM, fall back to searching
    // for the card, and piercing its Shadow DOM from the outside.
    if (buttons.length === 0) {
      const requestCards = rootNode.querySelectorAll('nde-request-card');
      requestCards.forEach((card: any) => {
        const root = card.shadowRoot || card;
        const cardButtons = Array.from(
          root.querySelectorAll('a.basic-button'),
        ) as Element[];
        buttons = [...buttons, ...cardButtons];
      });
    }

    buttons.forEach((button: any) => {
      if (!button.classList.contains('mat-mdc-unelevated-button')) {
        this.renderer.addClass(button, 'mat-mdc-unelevated-button');
        this.renderer.addClass(button, 'request-button');
        this.renderer.removeClass(button, 'margin-right-small');
        this.renderer.removeClass(button, 'go-to-link-button');
      }
    });
  }
}
