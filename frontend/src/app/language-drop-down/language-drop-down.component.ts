import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  inject,
  computed,
} from '@angular/core';
import { settingStore } from '../utilities/stores/settings.store';

@Component({
  selector: 'app-language-drop-down',
  imports: [],
  templateUrl: './language-drop-down.component.html',
  styleUrl: './language-drop-down.component.css',
})
export class LanguageDropDownComponent {
  settingStore = inject(settingStore);

  @Input() languages!: any;
  @Output() close = new EventEmitter<void>();

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }

  remainingLanguages = computed(() =>
    this.languages.filter(
      (lang: any) => lang.language !== this.settingStore.language()
    )
  );
}
