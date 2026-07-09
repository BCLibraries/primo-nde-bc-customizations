// This component monitors the DOM for the presence of a ViewIt (Find Online) section and, when found, makes the LibKey Find Online button visible. It uses a MutationObserver to watch for changes in the DOM. (That button is hidden by default in custom.css, so it will only be shown when the ViewIt section is present.)

// This is necessary because the LibKey add-on hides the online availability section in the brief display and instead incorporates the Find Online button into its stack of services. This becomes a problem when a physical-only title triggers LibKey by ISSN.

import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'custom-libkey-availability',
  standalone: true,
  imports: [],
  templateUrl: './libkey-availability.component.html',
  styleUrl: './libkey-availability.component.scss',
})
export class LibkeyAvailabilityComponent implements AfterViewInit, OnDestroy {
  private observer: MutationObserver | undefined;

  ngAfterViewInit(): void {
    const checkForElement = () => {
      const viewItElement = document.querySelector('div.service_viewit');
      if (viewItElement) {
        const stackedDropdown = document.querySelector(
          'stacked-dropdown',
        ) as HTMLElement;
        if (stackedDropdown) {
          stackedDropdown.style.display = 'block';
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

    this.observer.observe(document.body, {
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
