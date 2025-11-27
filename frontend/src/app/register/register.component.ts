import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { uiStore } from '../utilities/stores/ui.store';
import { settingStore } from '../utilities/stores/settings.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  uiStore = inject(uiStore);
  settingStore = inject(settingStore);

  title: string = this.uiStore.title();
}
