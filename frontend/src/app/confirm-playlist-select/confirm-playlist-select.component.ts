import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { playlistStore } from '../utilities/stores/playlist.store';
import { songStore } from '../utilities/stores/songs.store';

@Component({
  selector: 'app-confirm-playlist-select',
  imports: [RouterLink],
  templateUrl: './confirm-playlist-select.component.html',
  styleUrl: './confirm-playlist-select.component.css',
})
export class ConfirmPlaylistSelectComponent {
  @Output() confirmShown = new EventEmitter<boolean>(); // Emits boolean value to close the confirm window

  playlistStore = inject(playlistStore);
  songStore = inject(songStore);

  selectPlaylist(id: string | undefined) {
    if (id) {
      this.songStore.getSongs(id);
    } else {
      return console.log('error');
    }
  }

  closePlaylistSelect() {
    this.confirmShown.emit(false);
  }
}
