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

    // axios
    //   .get('http://127.0.0.1:8888/playlists', { withCredentials: true })
    //   .then((response) => {
    //     console.log(response);
    //     this.playlists = response.data.items.map(
    //       (playlist: any): Playlistdata => ({
    //         name: playlist.name,
    //         img: playlist.images[0].url,
    //         totalTracks: playlist.tracks.total,
    //         id: playlist.id,
    //       })
    //     );
    //     console.log(this.playlists);
    //   });
  }
}
