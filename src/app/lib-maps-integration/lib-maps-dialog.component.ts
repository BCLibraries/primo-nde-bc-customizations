import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeHtml,
} from '@angular/platform-browser';

export interface LibMapsDialogData {
  mapUrl: string;
  titleHtml: string;
  detailsHtml: string;
}

@Component({
  selector: 'custom-lib-maps-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <div class="lib-maps-dialog-header">
      <button mat-icon-button (click)="close()" aria-label="Close dialog">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="lib-maps-dialog-content">
      <div class="brief-record-info">
        <div [innerHTML]="safeTitleHtml"></div>
        <div [innerHTML]="safeDetailsHtml"></div>
      </div>

      <mat-divider></mat-divider>

      <iframe
        [src]="safeMapUrl"
        class="lib-maps-iframe"
        frameborder="0"
      ></iframe>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .lib-maps-dialog-header {
        display: flex;
        justify-content: flex-end;
        padding: 8px;
      }
      .lib-maps-dialog-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 8px 8px 8px;
        overflow: hidden;
      }
      .brief-record-info {
        margin-bottom: 16px;
      }
      .lib-maps-iframe {
        flex: 1;
        width: 100%;
        margin-top: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding-top: 16px;
        background-color: #ffffff;
      }
    `,
  ],
})
export class LibMapsDialogComponent {
  safeMapUrl: SafeResourceUrl;
  safeTitleHtml: SafeHtml;
  safeDetailsHtml: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<LibMapsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LibMapsDialogData,
    private sanitizer: DomSanitizer,
  ) {
    // Sanitize injected outerHTML and resource URLs to bypass Angular's security restrictions
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      data.mapUrl,
    );
    this.safeTitleHtml = this.sanitizer.bypassSecurityTrustHtml(data.titleHtml);
    this.safeDetailsHtml = this.sanitizer.bypassSecurityTrustHtml(
      data.detailsHtml,
    );
  }

  close() {
    this.dialogRef.close();
  }
}
