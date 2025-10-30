import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { playlistStore } from '../utilities/stores/playlist.store';
import { songStore } from '../utilities/stores/songs.store';
import { songSelectStore } from '../utilities/stores/songSelect.store';

@Component({
  selector: 'app-confirm-song-deletion-select',
  imports: [],
  templateUrl: './confirm-song-deletion-select.component.html',
  styleUrl: './confirm-song-deletion-select.component.css',
})
export class ConfirmSongDeletionSelectComponent {
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);
  songSelectStore = inject(songSelectStore);

  @Input() selectAmount!: number;

  @Output() songDeletionConfirmVisible = new EventEmitter<boolean>();

  closeSongDeletionConfirm() {
    this.songDeletionConfirmVisible.emit(false);
  }
}
