import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadingModalAnimation } from '../animations/Loadingmodal';

@Component({
  selector: 'app-loading-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loadingmodal.component.html',
  styleUrls: ['./loadingmodal.component.css'],
  animations: [loadingModalAnimation],
})
export class LoadingModalComponent implements OnInit {
  @Input() open = true;
  @Input() message = 'Loading playlist . . .';
  progress = 0;

  ngOnInit() {
    this.startProgress();
  }

  startProgress() {
    const interval = setInterval(() => {
      (this.progress += 1), 8;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => (this.open = false), 1000);
      }
    }, 100);
  }
}
