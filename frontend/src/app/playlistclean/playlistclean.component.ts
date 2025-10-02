import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-playlistclean',
  imports: [RouterLink],
  templateUrl: './playlistclean.component.html',
  styleUrl: './playlistclean.component.css',
})
export class PlaylistcleanComponent implements OnInit {
  title: string = 'WaveSpacer';

  profileStore = inject(profileStore);

  ngOnInit(): void {
    this.profileStore.getProfile();
  }
}
