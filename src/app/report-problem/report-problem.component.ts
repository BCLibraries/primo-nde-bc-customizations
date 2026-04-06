import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'custom-report-problem',
  standalone: true,
  imports: [],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReportProblemComponent implements AfterViewInit, OnDestroy {
  private observer: MutationObserver | null = null;

  // Added data-custom-icon="true" to the SVG to identify it later
  private readonly questionMarkSvg = `<svg data-custom-icon="true" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" fill="currentColor"></path></svg>`;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.replaceIcon();

    // Observe changes inside the wrapper element in case Primo renders the button dynamically
    // If not found (e.g. injected as a sibling), fallback to observing the document body
    const targetNode =
      this.el.nativeElement.closest('nde-report-a-problem') || document.body;
    this.observer = new MutationObserver(() => {
      this.replaceIcon();
    });
    this.observer.observe(targetNode, { childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private replaceIcon(): void {
    const parent =
      this.el.nativeElement.closest('nde-report-a-problem') ||
      document.querySelector('nde-report-a-problem');
    if (!parent) return;

    const matIcon = parent.querySelector('button mat-icon');
    if (matIcon && matIcon.parentNode) {
      // Check if we've already inserted our custom sibling
      const hasCustomSvg = matIcon.parentNode.querySelector(
        'span.custom-report-icon',
      );
      if (!hasCustomSvg) {
        const customIcon = document.createElement('span');
        // Add mat-icon class so it naturally inherits Angular Material's button margins/spacings
        customIcon.className = 'mat-icon notranslate custom-report-icon';
        customIcon.innerHTML = this.questionMarkSvg;

        // Insert it right after the hidden mat-icon
        matIcon.parentNode.insertBefore(customIcon, matIcon.nextSibling);
      }
    }
  }
}
