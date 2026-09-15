import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IllArticleData {
  url: string;
  title: string;
  jtitle: string;
  author: string;
  count: number;
  expires: string;
}

@Component({
  selector: 'ill-article',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div>
        <p>Title: <a [href]="cleanUrl" target="_blank">{{ item.title }}</a>
        <br />
        Author: {{ item.author }}
        <br />
        Expires: {{ item.expires }}.</p>
      </div>
    </div>
  `
})
export class IllArticleComponent {
  @Input() item!: IllArticleData;

  get cleanUrl(): string {
    return this.item?.url ? this.item.url.replace('/rrr', '') : '';
  }
}
