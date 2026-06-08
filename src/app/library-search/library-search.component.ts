// This component listens to changes in the router's query parameters. If it detects that the 'mode' parameter is set to 'LibrarySearch' and there is no 'query' parameter, it programmatically clicks the "Advanced Search" button after a short delay. This permits the tab and scope parameters to set the preferred dropdown values.

// Example URL: https://bc.primo.exlibrisgroup.com/nde/home?vid=01BC_INST:bclib_nde&lang=en&tab=LibraryCatalog&search_scope=BURNS&mode=LibrarySearch

import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';

interface CustomRouterState {
  state: {
    root: {
      queryParams: {
        query?: string;
        mode?: string;
        [key: string]: any;
      };
    };
  };
}

const selectRouterState = createFeatureSelector<CustomRouterState>('router');
const selectQueryParams = createSelector(
  selectRouterState,
  (router) => router?.state?.root?.queryParams,
);

@Component({
  selector: 'custom-library-search',
  standalone: true,
  imports: [],
  templateUrl: './library-search.component.html',
  styleUrl: './library-search.component.scss',
})
export class LibrarySearchComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store
      .select(selectQueryParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (!params) return;

        const hasNoQuery = !params['query'];
        const isLibrarySearch = params['mode'] === 'LibrarySearch';

        if (hasNoQuery && isLibrarySearch) {
          setTimeout(() => {
            const advancedSearchBtn = document.querySelector(
              '[data-qa="advanced_search_button"]',
            ) as HTMLButtonElement | null;
            if (advancedSearchBtn) {
              advancedSearchBtn.click();
            }
          }, 100);
        }
      });
  }
}
