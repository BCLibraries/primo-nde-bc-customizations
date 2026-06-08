import { NoResultsComponent } from '../no-results/no-results.component';
import { ProxyBorrowerComponent } from '../proxy-borrower/proxy-borrower.component';
import { HathiTrustComponent } from '../hathi-trust/hathi-trust.component';
import { SearchCollectionsComponent } from '../search-collections/search-collections.component';
import { LinksFilterComponent } from '../links-filter/links-filter.component';
import { RequestServicesComponent } from '../request-services/request-services.component';
import { FindingAidsComponent } from '../finding-aids/finding-aids.component';
import { OffsiteAvailabilityComponent } from '../offsite-availability/offsite-availability.component';
import { InstitutionalLoginComponent } from '../institutional-login/institutional-login.component';
import { RequestCardComponent } from '../request-card/request-card.component';
import { JournalsCategoriesComponent } from '../journals-categories/journals-categories.component';
import { IllLoansOverviewComponent } from '../ill/ill-loans-overview.component';
import { LibraryLogoComponent } from '../library-logo/library-logo.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LibrarySearchComponent } from '../library-search/library-search.component';

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-search-no-results-before', NoResultsComponent],
  ['nde-personal-details-view-after', ProxyBorrowerComponent],
  ['nde-online-availability-before', HathiTrustComponent],
  ['nde-collection-discovery-search-bar', SearchCollectionsComponent],
  ['nde-full-display-links-after', LinksFilterComponent],
  ['nde-location-after', RequestServicesComponent],
  ['nde-online-availability-top', FindingAidsComponent],
  ['nde-physical-availability-line-after', OffsiteAvailabilityComponent],
  ['nde-view-it-section-after', InstitutionalLoginComponent],
  ['nde-request-card-top', RequestCardComponent],
  ['nde-categories-before', JournalsCategoriesComponent],
  ['nde-requests-page-after', IllLoansOverviewComponent],
  ['nde-account-overview-bottom', IllLoansOverviewComponent],
  ['nde-logo-after', LibraryLogoComponent],
  ['nde-search-bar-presenter-top', SearchBarComponent],
  ['nde-search-bar-presenter-after', LibrarySearchComponent],
]);
