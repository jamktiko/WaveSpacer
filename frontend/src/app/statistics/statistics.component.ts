import { Component, inject, OnInit } from '@angular/core';
import { uiStore } from '../utilities/stores/ui.store';
import { profileStore } from '../utilities/stores/profile.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { DecadecardComponent } from '../decadecard/decadecard.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-statistics',
  imports: [UserdropdownComponent, DecadecardComponent, RouterLink],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  uiStore = inject(uiStore);
  profileStore = inject(profileStore);

  title: string = this.uiStore.title();
  profilepic!: string;

  decades = [
    {
      decade: "1970's",
      count: 100,
    },
    {
      decade: "1980's",
      count: 100,
    },
    {
      decade: "1990's",
      count: 100,
    },
    {
      decade: "2000's",
      count: 100,
    },
    {
      decade: "2010's",
      count: 100,
    },
    {
      decade: "2020's",
      count: 100,
    },
  ];

  ngOnInit(): void {
    this.profilepic = localStorage.getItem('profilepic') || 'placeholderpp.png';
  }
}
