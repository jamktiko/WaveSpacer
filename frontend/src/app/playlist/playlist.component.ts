import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Playlistdata } from '../playlistdata';
import { ListComponent } from '../list/list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist',
  imports: [ListComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent implements OnInit {
  playlists: Playlistdata[] = [];
  title: string = 'WaveSpacer';

  constructor(private router: Router) {}

  ngOnInit(): void {
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
      });
  }

  toHomeScreen() {
    this.router.navigate(['']);
  }
}
