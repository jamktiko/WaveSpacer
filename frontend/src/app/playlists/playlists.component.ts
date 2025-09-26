import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Playlistdata } from '../playlistdata';
import { PlaylistComponent } from '../playlist/playlist.component';
import { Userdata } from '../userdata';

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

  ngOnInit(): void {
    axios
      .get('http://127.0.0.1:8888/profile', { withCredentials: true })
      .then((response) => {
        console.log(response);
        this.userdata = {
          display_name: response.data.display_name,
          email: response.data.email,
          country: response.data.country,
          profilepic:
            response.data.images.length === 0
              ? 'placeholderpp.png'
              : response.data.images[0].url,
          product: response.data.product,
          followers: response.data.followers.total,
          id: response.data.id,
        };
      });

    axios
      .get('http://127.0.0.1:8888/playlists', { withCredentials: true })
      .then((response) => {
        console.log(response);
        this.playlists = response.data.items.map(
          (playlist: any): Playlistdata => ({
            name: playlist.name,
            img: playlist.images[0].url,
            totalTracks: playlist.tracks.total,
            id: playlist.id,
          })
        );
        console.log(this.playlists);
        console.log(this.userdata);
      });
  }
}
