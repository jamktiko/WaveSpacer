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

  // Data acquired from playlists-component. Single playlist attributes
  @Input() name!: string;
  @Input() img!: string;
  @Input() totalTrack!: number;
  @Input() id!: string;

  playlist!: Playlistdata | null;

  playlistSelected: boolean = false;

  // Playlist is added to localstorage, so that the state remains, even if the user goes back a screen
  selectPlaylist(id: string): void {
    this.playlist =
      this.playlistStore.playlists().find((playlist) => playlist.id === id) ||
      null;
    this.playlistStore.selectPlaylist(this.playlist);
    this.playlistSelected = true;
    localStorage.setItem('selectedPlaylist', JSON.stringify(this.playlist));
  }

  // Playlist selection window is closed when the playlist selection is confirmed
  closeConfirm(value: boolean): void {
    this.playlistSelected = value;
  }
}
