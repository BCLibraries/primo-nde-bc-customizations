import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'custom-no-results',
  standalone: true,
  imports: [
    /* CommonModule, other necessary modules */
  ],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss',
})
export class NoResultsComponent implements OnInit {
  private store = inject(Store);
  selectSearchState = createFeatureSelector<SearchState>('Search');
  selectSearchTerm = createSelector(
    selectSearchState,
    (state) => state.searchParams.q
  );
  selectSearchScope = createSelector(
    selectSearchState,
    (state) => state.searchParams.scope
  );

  // State variables
  customMessage: string = '';
  searchTerm = this.store.selectSignal(selectSearchTerm);
  searchScope = this.store.selectSignal(selectSearchScope);

  constructor() {
    // Services would be injected here, if needed (e.g., private dataService: PrimoDataService)
  }

  ngOnInit(): void {
    if (this.searchTerm) {
      this.customMessage = `Sorry, your search for "${this.searchTerm}" returned no results.`;
    } else {
      this.customMessage = `Sorry, no results were found.`;
    }
  }

  /**
   * Replaces the AngularJS controller method for generating a link.
   * @returns A safe, encoded URL for Google Scholar.
   */
  getGoogleScholarUrl(): string {
    const encodedTerm = encodeURIComponent(this.searchTerm || '');
    return `https://scholar.google.com/scholar?q=${encodedTerm}`;
  }
}
