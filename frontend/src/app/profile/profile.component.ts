import { Component, inject } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { uiStore } from '../utilities/stores/ui.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, UserdropdownComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileStore = inject(profileStore);
  uiStore = inject(uiStore);

  title: string = this.uiStore.title();
  profilepic!: string;

  ngOnInit(): void {
    this.profileStore.getProfile();
  }
}
