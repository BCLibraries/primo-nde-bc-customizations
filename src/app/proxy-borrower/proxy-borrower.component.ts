import { Component, inject, Signal, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';

// Updated interface to match the actual 'account' slice structure (arrays instead of objects)
interface CustomAccountState {
  personalDetails: {
    patronstatus: Array<{
      registration: Array<{
        institution: Array<{
          patronstatusname?: string;
          [key: string]: any;
        }>;
        [key: string]: any;
      }>;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  [key: string]: any;
}

@Component({
  selector: 'custom-proxy-borrower',
  standalone: true,
  imports: [MatCardModule, MatDividerModule],
  templateUrl: './proxy-borrower.component.html',
  styleUrl: './proxy-borrower.component.scss',
})
export class ProxyBorrowerComponent {
  private store = inject(Store);

  // Signal for the patron status name
  patronStatusName: Signal<string | undefined> = this.store.selectSignal(
    selectPatronStatusName,
  );

  // Computed signal to check for specific words (case-insensitive)
  isEligible = computed(() => {
    const status = this.patronStatusName()?.toLowerCase();
    return status
      ? ['staff', 'faculty', 'accommodation'].some((word) =>
          status.includes(word),
        )
      : false;
  });

}

// Updated selectors for the 'account' feature
const selectAccountState = createFeatureSelector<CustomAccountState>('account');
const selectPatronStatus = createSelector(
  selectAccountState,
  (accountState) => accountState.personalDetails.patronstatus,
);
const selectPatronStatusName = createSelector(
  selectPatronStatus,
  (patronStatus) => {
    if (Array.isArray(patronStatus) && patronStatus.length > 0) {
      const registration = patronStatus[0]?.registration;
      if (Array.isArray(registration) && registration.length > 0) {
        const institution = registration[0]?.institution;
        if (Array.isArray(institution) && institution.length > 0) {
          return institution[0]?.patronstatusname;
        }
      }
    }
    return undefined;
  },
);
