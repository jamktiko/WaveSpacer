import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Playlistdata } from '../playlistdata';

@Component({
  selector: 'app-playlist',
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent implements OnInit {
  playlists: Playlistdata[] = [];

  ngOnInit(): void {
    axios
      .get('http://127.0.0.1:8888/playlists', { withCredentials: true })
      .then((response) => {
        this.playlists = response.data.items.map(
          (playlist: any): Playlistdata => ({
            name: playlist.name,
            img: playlist.images.map((image: any) => image),
            totalTracks: playlist.tracks.total,
          })
        );
      });
  }
}
