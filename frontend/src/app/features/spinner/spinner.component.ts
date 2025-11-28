import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInOut, doneFade } from '../animations/Spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  animations: [fadeInOut, doneFade],
})
export class SpinnerComponent {
  status: 'idle' | 'loading' | 'done' = 'idle';

  go() {
    this.status = 'loading';
    setTimeout(() => {
      this.status = 'done';
      setTimeout(() => (this.status = 'idle'), 1200);
    }, 3000);
  }
}
