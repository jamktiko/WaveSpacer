import { Component, Input, inject } from '@angular/core';
import { ConfirmPlaylistSelectComponent } from '../confirm-playlist-select/confirm-playlist-select.component';
import { Playlistdata } from '../utilities/interfaces/playlistdata';
import { playlistStore } from '../utilities/stores/playlist.store';

@Component({
  selector: 'app-playlist',
  imports: [ConfirmPlaylistSelectComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent {
  playlistStore = inject(playlistStore);

  // Inputs acquired from homepage-component
  @Input() name!: string;
  @Input() img!: string;
  @Input() totalTrack!: number;
  @Input() id!: string;

  playlist!: Playlistdata | null;
  playlistName!: string; // Selected playlist's name that is sent to confirm-playlist-select-component
  playlistImg!: string; // Selected playlist's image that is sent to confirm-playlist-select-component

  playlistSelected: boolean = false;

  selectPlaylist(id: string): void {
    this.playlist =
      this.playlistStore.playlists().find((playlist) => playlist.id === id) ||
      null;
    this.playlistStore.selectPlaylist(this.playlist);
    this.playlistSelected = true;
  }

  closeConfirm(value: boolean): void {
    this.playlistSelected = value;
  }
}
