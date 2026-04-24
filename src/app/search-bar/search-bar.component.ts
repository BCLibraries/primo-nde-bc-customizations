import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'custom-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private observer: MutationObserver | undefined;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Delay setup slightly to allow the parent DOM elements to render
    setTimeout(() => this.setupObserver(), 0);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupObserver(): void {
    // Find the closest search-bar presenter element to narrow our observer scope
    const hostNode =
      this.elementRef.nativeElement.closest('nde-search-bar-presenter') ||
      document.body;

    this.observer = new MutationObserver(() => {
      this.updatePlaceholderText(hostNode);
    });

    // Observe changes to the DOM within the host node so we update dynamically on tab changes
    this.observer.observe(hostNode, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    this.updatePlaceholderText(hostNode);
  }

  private updatePlaceholderText(hostNode: HTMLElement): void {
    const dropdownTextEl =
      hostNode.querySelector(
        '.search-tab-dropdown .search-dropdown-container-button-text',
      ) || hostNode.querySelector('.search-dropdown-container-button-text');
    const searchInputEl = hostNode.querySelector(
      '#main-search-bar',
    ) as HTMLInputElement;

    if (dropdownTextEl && searchInputEl) {
      const selectedTab = dropdownTextEl.textContent?.trim() || '';

      const placeholders: Record<string, string> = {
        Everything: 'Search the entire catalog',
        'Books and more': 'Search for books, journals, media, and more',
        Articles: 'Search for articles and other database content',
      };

      // Fallback to "Search" if no specific placeholder is defined for the choice
      const placeholderText = placeholders[selectedTab] || 'Search';

      // Update the placeholder only if it's different, to prevent unnecessary DOM updates
      if (searchInputEl.placeholder !== placeholderText) {
        searchInputEl.placeholder = placeholderText;
      }
    }
  }
}
