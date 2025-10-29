import { Component, inject } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  title: string = 'WaveSpacer';
  profilepic!: string;

  profileStore = inject(profileStore);

  ngOnInit(): void {
    this.profileStore.getProfile();
  }
}
