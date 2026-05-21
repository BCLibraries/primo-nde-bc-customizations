// This component displays a link to Browzine above the categories column on the Journal Search page.

import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'custom-journals-categories',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './journals-categories.component.html',
  styleUrl: './journals-categories.component.scss'
})
export class JournalsCategoriesComponent {

}
