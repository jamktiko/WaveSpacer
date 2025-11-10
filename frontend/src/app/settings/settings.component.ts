import { Component, OnInit, inject } from '@angular/core';
import { uiStore } from '../utilities/stores/ui.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';

@Component({
  selector: 'app-settings',
  imports: [UserdropdownComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  profilepic!: string;

  uiStore = inject(uiStore);

  ngOnInit(): void {
    this.profilepic =
      localStorage.getItem('profilepic') || 'images/placeholderpp.png';
  }
}
