import { Component, Input } from '@angular/core';
import { ConfirmPlaylistSelectComponent } from '../confirm-playlist-select/confirm-playlist-select.component';

@Component({
  selector: 'app-playlist',
  imports: [ConfirmPlaylistSelectComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent {
  // Inputs acquired from homepage-component
  @Input() name!: string;
  @Input() img!: string;
  @Input() totalTrack!: number;
  @Input() id!: string;

  playlistName!: string; // Selected playlist's name that is sent to confirm-playlist-select-component
  playlistImg!: string; // Selected playlist's image that is sent to confirm-playlist-select-component

  playlistSelected: boolean = false;

  selectPlaylist(name: string, img: string): void {
    this.playlistName = name;
    this.playlistImg = img;
    this.playlistSelected = true;
  }

  closeConfirm(value: boolean): void {
    this.playlistSelected = value;
  }
}
