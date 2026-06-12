// This component detects if the current record has an electronic service that matches a target list of institutional login packages. If so, it binds the user sign-in button to the service hyperlink. This causes the user to log in to see the GES with credential information and the full text availability will be hidden.

import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

const TARGET_PACKAGES = [
  'Log In to ACRL Benchmark',
  'Log in to Banker & Tradesman',
  'Watch Dawnland',
  'Log in to Doris Lessing Studies',
  'Log In to International Music Score Library Project (IMSLP)',
  'Log in to Library Journal',
  'Watch Máxima',
  'Log In to Muscle and Motion',
  'Log in to Nabobkov Journal',
  'Access PebbleGo',
  'Access PebbleGo Next',
  'Log in to RMA Journal',
  'Log in to Theologische Beiträge',
  'Log in to The Sun',
  'Watch Voices of Grief',
];

@Component({
  selector: 'custom-institutional-login',
  standalone: true,
  imports: [],
  templateUrl: './institutional-login.component.html',
  styleUrl: './institutional-login.component.scss',
})
export class InstitutionalLoginComponent implements OnInit, OnDestroy {
  private itemSubject = new BehaviorSubject<any>(null);
  private subscription = new Subscription();
  private observer: MutationObserver | null = null;
  private cachedDomRecordId: string | null = null;

  private handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // In updated NDE versions, the element might be an anchor tag or have a different structure.
    const actionElement = target.closest(
      '.view-it-card-no-license-container, button, a',
    );

    if (!actionElement) return;

    // Use toLowerCase() and includes() to be immune to weird spacing or casing in Prod
    const textContent = actionElement.textContent?.toLowerCase() || '';
    const isSignInOrLogIn =
      textContent.includes('sign in') || textContent.includes('log in');
    const isTargetPackage = TARGET_PACKAGES.some((pkg) =>
      textContent.includes(pkg.toLowerCase()),
    );

    const isMatch =
      target.closest('.view-it-card-no-license-container') ||
      (target.closest('nde-view-it-section') &&
        (isSignInOrLogIn || isTargetPackage));

    if (isMatch) {
      event.preventDefault();
      event.stopPropagation();

      const triggerSignIn = () => {
        // Using the data-mat-icon-name="Login" attribute ignores language, spacing, or case issues!
        const loginIcon = document.querySelector(
          'mat-icon[data-mat-icon-name="Login"]',
        );
        const signInBtn = (loginIcon?.closest('button') ||
          document.querySelector(
            'button[aria-label*="Sign in" i]',
          )) as HTMLElement;

        if (signInBtn) {
          signInBtn.click();
        } else {
          console.warn('Could not find the native Primo Sign In button.');
          // Fallback: If they are already logged in (no sign in button) or it fails, just navigate normally
          const anchor = target.closest('a');
          if (anchor && anchor.href) {
            window.location.href = anchor.href;
          }
        }
      };

      // Angular Material menus aren't in the DOM until opened.
      if (document.querySelector('mat-icon[data-mat-icon-name="Login"]')) {
        triggerSignIn();
      } else {
        const userMenuBtn = document.getElementById(
          'user-area-button',
        ) as HTMLElement;
        if (userMenuBtn) {
          userMenuBtn.click();
          setTimeout(triggerSignIn, 100);
        }
      }
    }
  };

  @Input()
  set item(value: any) {
    this.itemSubject.next(value);
  }
  get item(): any {
    return this.itemSubject.value;
  }

  constructor(
    private store: Store<any>,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      combineLatest([
        this.itemSubject.asObservable(),
        this.store.select((state) => state.Delivery?.entities),
        this.store.select((state) => state['full-display']?.selectedRecordId),
      ]).subscribe(([item, entities, selectedRecordId]) => {
        let recordId = selectedRecordId;

        if (!recordId && item) {
          recordId = item.pnx?.control?.recordid?.[0] || item.recordid;
        }

        if (!recordId) {
          if (!this.cachedDomRecordId) {
            this.cachedDomRecordId = this.getRecordIdFromDOM();
          }
          recordId = this.cachedDomRecordId;
        }

        if (recordId && entities && entities[recordId]) {
          const electronicServices =
            entities[recordId].delivery?.electronicServices;
          if (electronicServices && Array.isArray(electronicServices)) {
            const hasMatch = electronicServices.some((service: any) =>
              TARGET_PACKAGES.includes(service.packageName),
            );

            if (hasMatch) {
              this.hideViewItSection();
              this.setupObserver();
            } else {
              this.disconnectObserver();
            }
          }
        }
      }),
    );

    // Intercept clicks in the capture phase (before Primo's handler triggers)
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.disconnectObserver();
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  private setupObserver(): void {
    if (this.observer) {
      return;
    }

    // Scope the observer to the current record's container to improve performance
    const parent =
      this.el.nativeElement.closest('nde-full-display-container') ||
      this.el.nativeElement.parentElement ||
      document.body;
    this.observer = new MutationObserver(() => {
      this.hideViewItSection();
    });

    this.observer.observe(parent, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private hideViewItSection(): void {
    const current = this.el.nativeElement as HTMLElement;

    // Search for the nde-view-it-section globally within the parent full display container to be safe
    const container =
      current?.closest('nde-full-display-container') || current?.parentElement;
    if (!container) return;

    const viewItSections = container.querySelectorAll('nde-view-it-section');
    viewItSections.forEach((section: Element) => {
      const htmlSection = section as HTMLElement;
      if (
        htmlSection.style.display !== 'none' &&
        htmlSection.textContent?.includes('Full text availability')
      ) {
        htmlSection.style.display = 'none';
      }
    });
  }

  private getRecordIdFromDOM(): string | null {
    const el = this.el.nativeElement as HTMLElement;

    const resultItem = el.closest('.search-result-item');
    if (resultItem) {
      const titleLink = resultItem.querySelector('a[id^="record_id_"]');
      if (titleLink && titleLink.id) {
        return titleLink.id.replace('record_id_', '');
      }
    }

    const container = el.closest('[data-recordid]');
    if (container) {
      return container.getAttribute('data-recordid');
    }

    const urlMatch =
      window.location.pathname.match(
        /\/fulldisplay\/(alma\d+|cdi_[a-zA-Z0-9_]+|TN_[a-zA-Z0-9_]+)/i,
      ) ||
      window.location.search.match(
        /docid=(alma\d+|cdi_[a-zA-Z0-9_]+|TN_[a-zA-Z0-9_]+)/i,
      );
    if (urlMatch) {
      return urlMatch[1];
    }

    return null;
  }
}
