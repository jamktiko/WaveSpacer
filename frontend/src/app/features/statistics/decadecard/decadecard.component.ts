import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-decadecard',
  imports: [],
  templateUrl: './decadecard.component.html',
  styleUrl: './decadecard.component.css',
})
export class DecadecardComponent {
  // Data acquired from statistics-page
  @Input() year!: string;
  @Input() count!: number;
}
