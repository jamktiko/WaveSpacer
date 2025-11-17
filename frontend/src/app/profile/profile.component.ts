import { Component, inject } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { uiStore } from '../utilities/stores/ui.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { settingStore } from '../utilities/stores/settings.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, UserdropdownComponent, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileStore = inject(profileStore);
  uiStore = inject(uiStore);
  settingStore = inject(settingStore);

  title: string = this.uiStore.title();
  profilepic!: string;

  ngOnInit(): void {
    this.profileStore.getProfile();

    if (localStorage.getItem('lightmode')) {
      if (JSON.parse(localStorage.getItem('lightmode') || '')) {
        this.settingStore.turnOnLightMode();
      }
    }
  }
}
