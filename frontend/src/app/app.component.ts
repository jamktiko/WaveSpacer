import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { settingStore } from './core/stores/settings.store';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  settingStore = inject(settingStore);

  ngOnInit(): void {
    const lightmode = JSON.parse(localStorage.getItem('lightmode') || 'false');
    if (lightmode) {
      this.settingStore.turnOnLightMode();
    } else {
      this.settingStore.applyTheme(false);
    }
  }
}
