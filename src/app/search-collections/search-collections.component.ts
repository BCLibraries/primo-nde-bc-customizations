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

@Component({
  selector: 'custom-search-collections',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './search-collections.component.html',
  styleUrl: './search-collections.component.scss',
})
export class SearchCollectionsComponent {
  private store = inject(Store);
  selectRouterState = createFeatureSelector<CustomRouterState>('router');
  selectSearchView = createSelector(
    this.selectRouterState,
    (router) => router?.state?.root?.queryParams?.['vid'],
  );
  searchView: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchView,
  );
  private readonly encodedSearchView = computed((): string =>
    encodeURIComponent(this.searchView() || ''),
  );
  getSearchUrl(): string {
    return `/nde/home?vid=${this.encodedSearchView()}&tab=LibraryCatalog&search_scope=FEATURED&mode=advanced`;
  }
}
