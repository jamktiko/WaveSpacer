import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { playlistStore } from '../utilities/stores/playlist.store';

@Component({
  selector: 'app-confirm-playlist-select',
  imports: [RouterLink],
  templateUrl: './confirm-playlist-select.component.html',
  styleUrl: './confirm-playlist-select.component.css',
})
export class ConfirmPlaylistSelectComponent {
  @Input() playlistName!: string; // Playlist's name is acquired from playlist-component, so it can be shown on confirm window
  @Input() playlistImg!: string; //Playlist's image is acquired from playlist-component, so it can be shown on confirm window
  @Output() confirmShown = new EventEmitter<boolean>(); // Emits boolean value to close the confirm window

  playlistStore = inject(playlistStore);

  closePlaylistSelect() {
    this.confirmShown.emit(false);
  }
}
