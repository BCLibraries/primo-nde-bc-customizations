import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LibMapsDialogComponent } from './lib-maps-dialog.component';

interface CustomRouterState {
  state: {
    root: {
      queryParams: {
        docid?: string;
        [key: string]: any;
      };
    };
  };
}

const selectRouterState = createFeatureSelector<CustomRouterState>('router');
const selectDocId = createSelector(
  selectRouterState,
  (router) => router?.state?.root?.queryParams?.docid,
);
const selectDeliveryState = createFeatureSelector<any>('Delivery');

@Component({
  selector: 'custom-lib-maps-integration',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './lib-maps-integration.component.html',
  styleUrl: './lib-maps-integration.component.scss',
})
export class LibMapsIntegrationComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private observer?: MutationObserver;

  docId = this.store.selectSignal(selectDocId);
  deliveryState = this.store.selectSignal(selectDeliveryState);

  ngOnInit() {
    this.observer = new MutationObserver(() => this.processButtons());

    // Observe the document body for dynamic additions of the locations container
    this.observer.observe(document.body, { childList: true, subtree: true });

    // Process initially in case it's already rendered
    this.processButtons();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private processButtons() {
    // Find all 'Map It' buttons that haven't been processed yet
    const mapButtons = document.querySelectorAll(
      'button.getit-locate-button:not(.lib-maps-processed)',
    );

    mapButtons.forEach((btn) => {
      btn.classList.add('lib-maps-processed');

      // Use event capture ('true') to intercept the click before Primo's handlers
      btn.addEventListener(
        'click',
        (e) => this.handleMapItClick(e, btn as HTMLElement),
        true,
      );
    });
  }

  private handleMapItClick(e: Event, btn: HTMLElement) {
    const accordionHeader = btn.closest('.accordion-header');
    if (!accordionHeader) return;

    // Extract mapping variables from DOM
    const libraryTitleEl = accordionHeader.querySelector(
      '.getit-library-title',
    );
    const subLocationEl = accordionHeader.querySelector(
      '[data-qa="location-sub-location"]',
    );
    const callNumberEl = accordionHeader.querySelector(
      '[data-qa="location-call-number"]',
    );

    const mainLocation = libraryTitleEl?.textContent?.trim() || '';
    const subLocation =
      subLocationEl?.textContent?.replace(';', '')?.trim() || '';
    const callNumber = callNumberEl?.textContent?.trim() || '';

    // Attempt to retrieve docId either from state or fallback to querying the DOM
    let currentDocId = this.docId();
    if (!currentDocId) {
      const titleAnchor = document.querySelector(
        'nde-record-title a[id^="record_id_"]',
      );
      if (titleAnchor) currentDocId = titleAnchor.id.replace('record_id_', '');
    }

    const currentDelivery = this.deliveryState();
    if (!currentDocId || !currentDelivery?.entities?.[currentDocId]?.delivery)
      return;

    const deliveryRecord = currentDelivery.entities[currentDocId].delivery;
    const holdings = deliveryRecord.holding || [];

    // Find matching holding
    const match =
      holdings.find(
        (h: any) =>
          h.mainLocation === mainLocation &&
          h.subLocation === subLocation &&
          h.callNumber === callNumber,
      ) || deliveryRecord.bestlocation;

    if (match?.stackMapUrl) {
      // We found the URL! Prevent Primo from opening it in a new tab.
      e.preventDefault();
      e.stopPropagation();

      // Gather brief record HTML components
      const titleEl = document.querySelector(
        '.brief-result-container nde-record-title',
      );
      const detailsEl = document.querySelector(
        '.brief-result-container nde-record-main-details',
      );

      this.dialog.open(LibMapsDialogComponent, {
        width: '80vw',
        maxWidth: '90vw',
        height: '80vh', // Sets height to ensure the iframe takes up substantial screen real estate
        maxHeight: '90vh',
        data: {
          mapUrl: match.stackMapUrl,
          titleHtml: titleEl?.outerHTML || '',
          detailsHtml: detailsEl?.outerHTML || '',
        },
      });
    }
  }
}
