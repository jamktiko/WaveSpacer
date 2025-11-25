import { Component, OnInit, inject } from '@angular/core';
import { uiStore } from '../utilities/stores/ui.store';
import { settingStore } from '../utilities/stores/settings.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { LanguageDropDownComponent } from '../language-drop-down/language-drop-down.component';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [
    UserdropdownComponent,
    LanguageDropDownComponent,
    NgClass,
    RouterLink,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  profilepic!: string;
  languages = [
    { language: 'English', id: 1 },
    { language: 'Finnish', id: 2 },
  ];

  uiStore = inject(uiStore);
  settingStore = inject(settingStore);

  ngOnInit(): void {
    this.profilepic =
      localStorage.getItem('profilepic') || 'images/placeholderpp.png';
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'English');
    } else {
      this.settingStore.changeLanguage(localStorage.getItem('language') || '');
    }
    if (localStorage.getItem('lightmode')) {
      if (JSON.parse(localStorage.getItem('lightmode') || '')) {
        this.settingStore.turnOnLightMode();
      }
    }
  }

  // If the dropdown is visible, the top should be rounded to make it look better
  languageDropdownVisible() {
    return this.settingStore.dropdownvisible() ? `rounded-t-lg` : `rounded-lg`;
  }

  // NgClass. Controls the bg color of the toggle input
  lightModeActive() {
    return this.settingStore.lightmode() ? `bg-white` : `bg-black`;
  }

  // NgClass. Controls the location of the thumb on the toggle input
  lightModeActive2() {
    return this.settingStore.lightmode()
      ? 'right-1 bg-black'
      : 'left-1 bg-[#D9D9D9]';
  }
}
