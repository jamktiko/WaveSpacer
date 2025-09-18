import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-playlist',
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent implements OnInit {
  ngOnInit(): void {
    axios
      .get('http://127.0.0.1:8888/playlists', { withCredentials: true })
      .then((response) => console.log(response));
  }
}
