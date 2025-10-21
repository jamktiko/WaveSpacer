import { Component, inject, effect } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { playlistStore } from '../utilities/stores/playlist.store';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  title: String = 'WaveSpacer';
  randomPlaylistImg!: string;

  profileStore = inject(profileStore);
  playlistStore = inject(playlistStore);

  constructor() {
    effect(() => {
      const playlists = this.playlistStore.playlists();

      if (playlists.length > 0) {
        const index = Math.floor(Math.random() * playlists.length);
        this.randomPlaylistImg = this.playlistStore.playlists()[index].img;
      }
    });
  }

  ngOnInit(): void {
    this.profileStore.getProfile();
    this.playlistStore.getPlaylists();
  }
}
