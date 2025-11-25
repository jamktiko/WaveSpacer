import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { playlistStore } from '../../../core/stores/playlist.store';
import { songStore } from '../../../core/stores/songs.store';
import { songSelectStore } from '../../../core/stores/songSelect.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirm-song-deletion-select',
  imports: [RouterLink],
  templateUrl: './confirm-song-deletion-select.component.html',
  styleUrl: './confirm-song-deletion-select.component.css',
})
export class ConfirmSongDeletionSelectComponent {
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);
  songSelectStore = inject(songSelectStore);

  @Input() selectAmount!: number; // The number of selected songs

  @Output() songDeletionConfirmVisible = new EventEmitter<boolean>();

  // Whichever button the users presses emits the value of windows visibility (false) to playlistclean.component
  closeSongDeletionConfirm() {
    this.songDeletionConfirmVisible.emit(false);
  }

  // If the user presses yes, the song deletion method is called with the selected songs and the id of the playlist
  deleteSongs() {
    this.songStore.deleteSongs(
      this.playlistStore.selected()?.id || null,
      this.songSelectStore.selectedIds()
    );
    this.songSelectStore.clear();
    this.songDeletionConfirmVisible.emit(false);
  }
}
