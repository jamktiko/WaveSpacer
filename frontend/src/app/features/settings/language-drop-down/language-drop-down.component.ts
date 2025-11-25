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
import { settingStore } from '../../../core/stores/settings.store';

@Component({
  selector: 'app-language-drop-down',
  imports: [],
  templateUrl: './language-drop-down.component.html',
  styleUrl: './language-drop-down.component.css',
})
export class LanguageDropDownComponent {
  settingStore = inject(settingStore);

  @Input() languages!: any; // All the languages all acquired from settings.component
  @Output() close = new EventEmitter<void>();

  constructor(private eRef: ElementRef) {}

  // If user clicks outside the language dropdown, close the menu
  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }

  // The list of remaining languages changes based on what language is selected. The selected language should never appear on the list
  remainingLanguages = computed(() =>
    this.languages.filter(
      (lang: any) => lang.language !== this.settingStore.language()
    )
  );
}
