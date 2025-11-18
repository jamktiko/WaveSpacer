import {
  Component,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { uiStore } from '../utilities/stores/ui.store';

@Component({
  selector: 'app-userdropdown',
  imports: [RouterLink],
  templateUrl: './userdropdown.component.html',
  styleUrl: './userdropdown.component.css',
})
export class UserdropdownComponent {
  uiStore = inject(uiStore);

  @Output() close = new EventEmitter<void>();

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }
}
