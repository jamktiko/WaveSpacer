import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { uiStore } from '../utilities/stores/ui.store';
import { settingStore } from '../utilities/stores/settings.store';
import { NgClass } from '@angular/common';

//aws testi push kommentti 8

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, RouterLink, NgClass],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  uiStore = inject(uiStore);
  settingStore = inject(settingStore);

  title = this.uiStore.title();

  // User is redirected to Spotify login
  login() {
    location.href = `${environment.apiUrl}api/login`;
  }

  ngOnInit(): void {
    // On init, check if user has turned on lightmode before
    if (localStorage.getItem('lightmode')) {
      if (JSON.parse(localStorage.getItem('lightmode') || '')) {
        this.settingStore.turnOnLightMode();
      }
    }
  }

  // NgClass, background image changes based on if lightmode is on, part 1 of background image, because the bg image is in two parts
  modeBackground() {
    return this.settingStore.lightmode()
      ? `bg-[url(/images/lightbackground2.png)]`
      : `bg-[url(/images/background.png)]`;
  }

  // NgClass, part 2 of background image
  modeBackground2() {
    return this.settingStore.lightmode() ? `bg-[#D8D8D8]` : `bg-[#252525]`;
  }
}
