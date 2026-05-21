//  This component adds logo text after the library logo in the header.

import { Component } from '@angular/core';
import { AssetsPublicPathDirective } from "../services/assets-public-path.directive";

@Component({
  selector: 'custom-library-logo',
  standalone: true,
  imports: [AssetsPublicPathDirective],
  templateUrl: './library-logo.component.html',
  styleUrl: './library-logo.component.scss'
})
export class LibraryLogoComponent {

}
