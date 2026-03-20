import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'custom-finding-aids',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './finding-aids.component.html',
  styleUrl: './finding-aids.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingAidsComponent implements OnInit {
  private itemSubject = new BehaviorSubject<any>(null);

  @Input()
  set item(value: any) {
    this.itemSubject.next(value);
  }
  get item(): any {
    return this.itemSubject.value;
  }

  findingAidLinks$: Observable<{ href: string; text: string }[] | null> =
    of(null);

  private cachedDomRecordId: string | null = null;

  constructor(
    private store: Store<any>,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    const parser = new DOMParser();
    const textArea = document.createElement('textarea');

    this.findingAidLinks$ = combineLatest([
      this.itemSubject.asObservable(),
      this.store.select((state) => state.Search?.entities),
      this.store.select((state) => state['full-display']?.selectedRecordId),
    ]).pipe(
      map(([item, entities, selectedRecordId]) => {
        let entity = item;

        // If item isn't provided directly, try to extract the record ID from the DOM
        if (!entity) {
          if (!this.cachedDomRecordId && !selectedRecordId) {
            this.cachedDomRecordId = this.getRecordIdFromDOM();
          }

          const recordId = selectedRecordId || this.cachedDomRecordId;
          if (recordId && entities) {
            entity = entities[recordId];
          }
        }

        if (!entity) {
          return null; // Still no entity, can't proceed
        }

        // Support various object shapes just in case NDE passes the entity in an unexpected format
        const pnx = entity?.pnx || entity?.item?.pnx || entity;
        const lds08Array = pnx?.display?.lds08;
        const links: { href: string; text: string }[] = [];

        if (lds08Array && Array.isArray(lds08Array) && lds08Array.length > 0) {
          lds08Array.forEach((lds08String: string) => {
            // Primo VE often HTML-encodes its data (e.g. &lt;a href...&gt;)
            textArea.innerHTML = lds08String;
            const decodedString = textArea.value;

            const doc = parser.parseFromString(decodedString, 'text/html');
            const aTags = doc.querySelectorAll('a');
            aTags.forEach((aTag) => {
              links.push({
                href: aTag.getAttribute('href') || '',
                text: aTag.textContent || 'Finding Aid',
              });
            });
          });
        }

        return links.length > 0 ? links : null;
      }),
    );
  }

  private getRecordIdFromDOM(): string | null {
    const el = this.el.nativeElement as HTMLElement;

    // 1. If we are in the brief results list, find the closest result item
    const resultItem = el.closest('.search-result-item');
    if (resultItem) {
      return this.extractIdFromResultItem(resultItem);
    }

    // 2. If we are on the full display page/overlay, find the container and then the result item within it
    const fullDisplayContainer = el.closest('nde-full-display-container');
    if (fullDisplayContainer) {
      const fullDisplayResultItem = fullDisplayContainer.querySelector(
        '.search-result-item',
      );
      if (fullDisplayResultItem) {
        return this.extractIdFromResultItem(fullDisplayResultItem);
      }
    }

    // 3. Look for data-recordid on ancestors (standard Primo VE list item wrapper)
    const container = el.closest('[data-recordid]');
    if (container) {
      return container.getAttribute('data-recordid');
    }

    // 4. Ultimate fallback: parse the URL if we are on a permalink page
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

  private extractIdFromResultItem(resultItem: Element): string | null {
    // Extract from the title link (e.g., id="record_id_alma99112343300001021")
    const titleLink = resultItem.querySelector('a[id^="record_id_"]');
    if (titleLink && titleLink.id) {
      return titleLink.id.replace('record_id_', '');
    }

    // Fallback: extract from the hidden span's data-url attribute
    const urlSpan = resultItem.querySelector(
      '.urlToXmlPnx, .urlToXmlPnxSingleRecord',
    );
    const dataUrl = urlSpan?.getAttribute('data-url');
    if (dataUrl) {
      const match = dataUrl.match(
        /\/xml\/[^\/]+\/(alma\d+|cdi_[a-zA-Z0-9_]+|TN_[a-zA-Z0-9_]+)/i,
      );
      if (match) return match[1];
    }
    return null;
  }
}
