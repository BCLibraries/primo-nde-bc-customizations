import { NoResultsComponent } from '../no-results/no-results.component';
import { ProxyBorrowerComponent } from '../proxy-borrower/proxy-borrower.component';
import { HathiTrustComponent } from '../hathi-trust/hathi-trust.component';
import { SearchCollectionsComponent } from '../search-collections/search-collections.component';
import { LinksFilterComponent } from '../links-filter/links-filter.component';
import { RequestServicesComponent } from '../request-services/request-services.component';
import { UserAreaComponent } from '../user-area/user-area.component';
import { FindingAidsComponent } from '../finding-aids/finding-aids.component';
import { OffsiteAvailabilityComponent } from '../offsite-availability/offsite-availability.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-search-no-results', NoResultsComponent],
  ['nde-personal-details-view-after', ProxyBorrowerComponent],
  ['nde-online-availability-before', HathiTrustComponent],
  ['nde-collection-discovery-search-bar', SearchCollectionsComponent],
  ['nde-full-display-links-after', LinksFilterComponent],
  ['nde-location-after', RequestServicesComponent],
  ['nde-user-area-after', UserAreaComponent],
  ['nde-online-availability-top', FindingAidsComponent],
  ['nde-physical-availability-line-after', OffsiteAvailabilityComponent]
]);
