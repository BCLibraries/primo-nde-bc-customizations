import { NoResultsComponent } from '../no-results/no-results.component';
import { ProxyBorrowerComponent } from '../proxy-borrower/proxy-borrower.component';
import { HathiTrustComponent } from '../hathi-trust/hathi-trust.component';
import { SearchCollectionsComponent } from '../search-collections/search-collections.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-search-no-results', NoResultsComponent],
  ['nde-personal-details-view-after', ProxyBorrowerComponent],
  ['nde-online-availability-before', HathiTrustComponent],
  ['nde-collection-discovery-search-bar', SearchCollectionsComponent],
]);
