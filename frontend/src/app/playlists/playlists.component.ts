import { RouterLink } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import axios from 'axios';
import { Playlistdata } from '../utilities/interfaces/playlistdata';
import { PlaylistComponent } from '../playlist/playlist.component';
import { Userdata } from '../utilities/interfaces/userdata';
import { profileStore } from '../utilities/stores/profile.store';
import { playlistStore } from '../utilities/stores/playlist.store';

@Component({
  selector: 'app-playlists',
  imports: [PlaylistComponent, RouterLink],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css',
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlistdata[] = [];
  title: string = 'WaveSpacer';
  userdata!: Userdata | undefined;

  constructor() {}

  profileStore = inject(profileStore);
  playlistStore = inject(playlistStore);

  ngOnInit(): void {
    this.profileStore.getProfile();
    this.playlistStore.getPlaylists();
  }

  refreshPlaylists() {
    this.playlistStore.getPlaylists(true);
  }
}
