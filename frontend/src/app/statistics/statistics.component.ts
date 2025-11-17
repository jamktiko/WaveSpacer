import { Component, inject, OnInit } from '@angular/core';
import { uiStore } from '../utilities/stores/ui.store';
import { profileStore } from '../utilities/stores/profile.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { DecadecardComponent } from '../decadecard/decadecard.component';
import { RouterLink } from '@angular/router';
import { settingStore } from '../utilities/stores/settings.store';
import { NgClass } from '@angular/common';
import { recentListensStore } from '../utilities/stores/recentlistens.store';
import { RecentlistenedComponent } from '../recentlistened/recentlistened.component';

@Component({
  selector: 'app-statistics',
  imports: [
    UserdropdownComponent,
    DecadecardComponent,
    RouterLink,
    NgClass,
    RecentlistenedComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  uiStore = inject(uiStore);
  profileStore = inject(profileStore);
  settingStore = inject(settingStore);
  recentlistensStore = inject(recentListensStore);

  title: string = this.uiStore.title();
  profilepic!: string;

  decades = [
    {
      decade: "1970's",
      count: 13.5,
    },
    {
      decade: "1980's",
      count: 13.5,
    },
    {
      decade: "1990's",
      count: 13.5,
    },
    {
      decade: "2000's",
      count: 13.5,
    },
    {
      decade: "2010's",
      count: 13.5,
    },
    {
      decade: "2020's",
      count: 13.5,
    },
  ];

  otherCategories = [
    {
      category: 'Obscure',
      count: 13.5,
    },
    {
      category: 'Mainstream',
      count: 24.2,
    },
    {
      category: 'Average',
      count: 62.3,
    },
  ];

  ngOnInit(): void {
    this.profilepic = localStorage.getItem('profilepic') || 'placeholderpp.png';

    if (localStorage.getItem('lightmode')) {
      if (JSON.parse(localStorage.getItem('lightmode') || '')) {
        this.settingStore.turnOnLightMode();
      }
    }
    this.recentlistensStore.getRecentListens();
  }
}
