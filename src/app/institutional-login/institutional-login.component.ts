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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.disconnectObserver();
  }

  private setupObserver(): void {
    if (this.observer) {
      return;
    }

    const parent = this.el.nativeElement.parentElement || document.body;
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
