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
    const button = target.closest('button.view-it-card-no-license-container');

    // Use toLowerCase() and includes() to be immune to weird spacing or casing in Prod
    if (button && button.textContent?.toLowerCase().includes('sign in')) {
      // Guard against multiple component instances overriding the global methods concurrently
      if ((window as any)._isSignInPatched) return;
      (window as any)._isSignInPatched = true;

      const originalOpen = window.open;
      const originalCreateElement = document.createElement;

      let timeoutId: ReturnType<typeof setTimeout>;

      const restoreOriginals = () => {
        if (window.open !== originalOpen) window.open = originalOpen;
        if (document.createElement !== originalCreateElement)
          document.createElement = originalCreateElement;
        (window as any)._isSignInPatched = false;
        clearTimeout(timeoutId);
      };

      window.open = function (
        url?: string | URL,
        targetName?: string,
        features?: string,
      ) {
        if (url) {
          window.location.href = url.toString();
        }
        restoreOriginals();
        return null;
      };

      // Temporarily override document.createElement to catch dynamically created <a> tags
      document.createElement = function (
        tagName: string,
        options?: ElementCreationOptions,
      ) {
        const el = originalCreateElement.call(document, tagName, options);
        if (tagName.toLowerCase() === 'a') {
          const originalClick = el.click;
          el.click = function () {
            const anchor = el as HTMLAnchorElement;
            if (anchor.href) {
              window.location.href = anchor.href;
              restoreOriginals();
              return;
            }
            return originalClick.apply(this, arguments as any);
          };
        }
        return el;
      } as typeof document.createElement;

      // Increase timeout to 10 seconds for safety
      timeoutId = setTimeout(restoreOriginals, 10000);
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
