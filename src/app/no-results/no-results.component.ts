import { CommonModule } from '@angular/common';
import { Component, inject, Signal, computed } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';

/**
 * Interface representing the structure of your router state as seen in state.json.
 * This allows the selectors to safely navigate the nested properties.
 */
interface CustomRouterState {
  state: {
    root: {
      queryParams: {
        query?: string;
        search_scope?: string;
        tab?: string;
        vid?: string;
        pcAvailability?: string;
        [key: string]: any;
      };
    };
  };
}

@Component({
  selector: 'custom-no-results',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss',
})
export class NoResultsComponent {
  private store = inject(Store);

  /**
   * Selectors targeting the specific path found in your state.json:
   * router > state > root > queryParams
   */
  selectRouterState = createFeatureSelector<CustomRouterState>('router');

  selectSearchTerm = createSelector(
    this.selectRouterState,
    (router) => router?.state?.root?.queryParams?.query,
  );

  selectSearchScope = createSelector(
    this.selectRouterState,
    (router) => router?.state?.root?.queryParams?.search_scope,
  );

  selectSearchTab = createSelector(
    this.selectRouterState,
    (router) => router?.state?.root?.queryParams?.tab,
  );

  selectSearchView = createSelector(
    this.selectRouterState,
    (router) => router?.state?.root?.queryParams?.vid,
  );

  selectSearchExpanded = createSelector(
    this.selectRouterState,
    (router) => router?.state?.root?.queryParams?.pcAvailability,
  );

  // Signals linked to the selectors
  searchTerm: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchTerm,
  );

  searchScope: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchScope,
  );

  searchTab: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchTab,
  );

  searchView: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchView,
  );

  searchExpanded: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchExpanded,
  );

  // derived/computed values
  private readonly encodedSearchTerm = computed((): string =>
    encodeURIComponent(this.searchTerm() || ''),
  );

  private readonly encodedSearchView = computed((): string =>
    encodeURIComponent(this.searchView() || ''),
  );

  private readonly encodedSearchScope = computed((): string =>
    encodeURIComponent(this.searchScope() || ''),
  );

  private readonly encodedSearchTab = computed((): string =>
    encodeURIComponent(this.searchTab() || ''),
  );

  isBooks = computed(() => this.searchScope() === 'MyInstitution');
  isCDI = computed(() => this.searchScope() === 'CentralIndex');
  isEverything = computed(() => this.searchScope() === 'MyInst_and_CI');
  isNotExpanded = computed(() => this.searchExpanded() !== 'true');
  isShortSearchTerm = computed(() => {
    const t = this.searchTerm();
    return !!t && t.length < 5;
  });

  customMessage = computed(() => {
    const t = this.searchTerm();
    return t
      ? `Sorry, your search for "${t}" returned no results.`
      : `Sorry, no results were found.`;
  });

  // no constructor or lifecycle methods needed; messages & flags come from computed signals

  // keep searchTermValue getter for the template; everything else uses computed signals
  get searchTermValue(): string | undefined {
    return this.searchTerm();
  }

  getArticlesUrl(): string {
    return `/nde/search?query=${this.encodedSearchTerm()}&tab=CentralIndex&search_scope=CentralIndex&searchInFulltext=false&vid=${this.encodedSearchView()}&lang=en`;
  }

  getExpandURL(): string {
    return `/nde/search?query=${this.encodedSearchTerm()}&tab=${this.encodedSearchTab()}&search_scope=${this.encodedSearchScope()}&searchInFulltext=false&vid=${this.encodedSearchView()}&lang=en&pcAvailability=true`;
  }

  getBooksUrl(): string {
    return `/nde/search?query=${this.encodedSearchTerm()}&tab=LibraryCatalog&search_scope=MyInstitution&searchInFulltext=false&vid=${this.encodedSearchView()}&lang=en`;
  }

  getWorldCatUrl(): string {
    return `https://bc.on.worldcat.org/search?databaseList=&queryString=${this.encodedSearchTerm()}`;
  }
}
