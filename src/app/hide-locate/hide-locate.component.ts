import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'custom-hide-locate',
  standalone: true,
  imports: [],
  templateUrl: './hide-locate.component.html',
  styleUrl: './hide-locate.component.scss',
})
export class HideLocateComponent implements OnInit, OnDestroy {
  private observer: MutationObserver | null = null;

  constructor(private el: ElementRef) {}

// Hides Locate button for O'Neill holdings containing "newspaper" or that are in classes A-D (fifth floor).

  ngOnInit(): void {
    this.checkAndHideLocate();

    // Set up a MutationObserver to catch dynamic data rendering within the target location block
    const targetNode =
      this.getLocationNode() || this.el.nativeElement.parentElement;
    if (targetNode) {
      this.observer = new MutationObserver(() => {
        this.checkAndHideLocate();
      });
      this.observer.observe(targetNode, {
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

  private getLocationNode(): HTMLElement | null {
    const el = this.el.nativeElement as HTMLElement;

    // 1. Check if we happen to be nested inside nde-location
    let node = el.closest('nde-location');
    if (node) return node as HTMLElement;

    // 2. Check if we are a sibling to nde-location (standard for "-after" mappings)
    let current: HTMLElement | null = el;
    while (current && current.parentElement) {
      if (
        current.previousElementSibling?.tagName.toLowerCase() === 'nde-location'
      ) {
        return current.previousElementSibling as HTMLElement;
      }
      if (
        current.nextElementSibling?.tagName.toLowerCase() === 'nde-location'
      ) {
        return current.nextElementSibling as HTMLElement;
      }
      current = current.parentElement;
    }

    return null;
  }

  private checkAndHideLocate(): void {
    const locationNode = this.getLocationNode();
    if (!locationNode) return;

    const libraryNode = locationNode.querySelector('.getit-library-title');
    const callNumberNode = locationNode.querySelector(
      '[data-qa="location-call-number"]',
    );
    const locateButton = locationNode.querySelector('.getit-locate-button');

    if (libraryNode && callNumberNode && locateButton) {
      const libraryName = (libraryNode.textContent || '').trim();
      const callNumber = (callNumberNode.textContent || '').trim();

      if (libraryName === "O'Neill Library") {
        const hasNewspaper = callNumber.toLowerCase().includes('newspaper');
        const matchesRegex = /^(OVERSIZE\s)?[A-D].+/.test(callNumber);

        if (hasNewspaper || matchesRegex) {
          const buttonContainer = locateButton.parentElement;
          if (buttonContainer) {
            buttonContainer.style.display = 'none';
          }
        }
      }
    }
  }
}
