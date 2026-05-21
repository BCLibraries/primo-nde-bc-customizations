// This component replaces the default collection search, which is limited to the current collection, excluding children. It renders a button that links to the advanced search page with the Featured Collections scope selected, which allows users to search across all collections.

import { Component, inject, Signal, computed } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface CustomRouterState {
  state: {
    root: {
      queryParams: {
        query?: string;
        [key: string]: any;
      };
    };
  };
}

const selectRouterState = createFeatureSelector<CustomRouterState>('router');
const selectSearchView = createSelector(
  selectRouterState,
  (router) => router?.state?.root?.queryParams?.['vid'],
);

@Component({
  selector: 'custom-search-collections',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './search-collections.component.html',
  styleUrl: './search-collections.component.scss',
})
export class SearchCollectionsComponent {
  private store = inject(Store);

  searchView: Signal<string | undefined> =
    this.store.selectSignal(selectSearchView);

  private readonly encodedSearchView = computed((): string =>
    encodeURIComponent(this.searchView() || ''),
  );
  getSearchUrl(): string {
    return `/nde/home?vid=${this.encodedSearchView()}&tab=LibraryCatalog&search_scope=FEATURED&mode=advanced`;
  }
}
