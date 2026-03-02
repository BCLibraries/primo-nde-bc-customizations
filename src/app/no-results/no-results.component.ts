import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Minimal shape for the Search feature state used in this component
interface SearchState {
  searchParams: {
    q?: string;
    scope?: string;
  };
}

@Component({
  selector: 'custom-no-results',
  standalone: true,
  imports: [
    /* CommonModule, other necessary modules */
    CommonModule,
  ],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss',
})
export class NoResultsComponent implements OnInit {
  private store = inject(Store);
  selectSearchState = createFeatureSelector<SearchState>('Search');
  selectSearchTerm = createSelector(
    this.selectSearchState,
    (state) => state.searchParams.q,
  );
  selectSearchScope = createSelector(
    this.selectSearchState,
    (state) => state.searchParams.scope,
  );

  // State variables
  customMessage: string = '';
  searchTerm: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchTerm,
  ) as Signal<string | undefined>;
  searchScope: Signal<string | undefined> = this.store.selectSignal(
    this.selectSearchScope,
  ) as Signal<string | undefined>;

  constructor() {
    // Services would be injected here, if needed (e.g., private dataService: PrimoDataService)
  }

  ngOnInit(): void {
    const term = this.searchTerm();
    if (term) {
      this.customMessage = `Sorry, your search for "${term}" returned no results.`;
    } else {
      this.customMessage = `Sorry, no results were found.`;
    }
  }

  // Expose signal values via getters for template type-check compatibility
  get searchTermValue(): string | undefined {
    return this.searchTerm();
  }

  get isShortSearchTerm(): boolean {
    const t = this.searchTermValue;
    return !!t && t.length < 5;
  }

  get isBooks(): boolean {
    const t = this.searchScope();
    return !!t && t === 'MyInstitution';
  }

  get isCDI(): boolean {
    const t = this.searchScope();
    return !!t && t === 'CentralIndex';
  }

  /**
   * Replaces the AngularJS controller method for generating a link.
   * @returns A safe, encoded URL.
   */
  getArticlesUrl(): string {
    const encodedTerm = encodeURIComponent(this.searchTerm() || '');
    return `/nde/search?query=${encodedTerm}&tab=CentralIndex&search_scope=CentralIndex&searchInFulltext=false&vid=01BC_INST:scot_nde&lang=en`;
  }

  getBooksUrl(): string {
    const encodedTerm = encodeURIComponent(this.searchTerm() || '');
    return `/nde/search?query=${encodedTerm}&tab=LibraryCatalog&search_scope=MyInstitution&searchInFulltext=false&vid=01BC_INST:scot_nde&lang=en`;
  }

  getWorldCatUrl(): string {
    const encodedTerm = encodeURIComponent(this.searchTerm() || '');
    return `https://bc.on.worldcat.org/search?databaseList=&queryString=${encodedTerm}`;
  }
}
