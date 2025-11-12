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

  login() {
    location.href = `${environment.apiUrl}api/login`;
  }

  ngOnInit(): void {
    if (localStorage.getItem('lightmode')) {
      if (JSON.parse(localStorage.getItem('lightmode') || '')) {
        this.settingStore.turnOnLightMode();
      }
    }
  }

  modeBackground() {
    return this.settingStore.lightmode()
      ? `bg-[url(/images/lightbackground2.png)]`
      : `bg-[url(/images/background.png)]`;
  }
}
