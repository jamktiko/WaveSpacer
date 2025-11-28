import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { playlistStore } from '../../../core/stores/playlist.store';
import { songStore } from '../../../core/stores/songs.store';
import { songSelectStore } from '../../../core/stores/songSelect.store';
import { RouterLink, Router } from '@angular/router';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-confirm-song-deletion-select',
  standalone: true,
  imports: [RouterLink, SpinnerComponent],
  templateUrl: './confirm-song-deletion-select.component.html',
  styleUrl: './confirm-song-deletion-select.component.css',
})
export class ConfirmSongDeletionSelectComponent {
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);
  songSelectStore = inject(songSelectStore);
  router = inject(Router);

  @Input() selectAmount!: number;
  @Output() songDeletionConfirmVisible = new EventEmitter<boolean>();

  @ViewChild('spinner') spinner?: SpinnerComponent;

  spinnerShown = false;

  closeSongDeletionConfirm() {
    this.songDeletionConfirmVisible.emit(false);
  }

  async deleteSongs() {
    this.spinnerShown = true;

    await Promise.resolve();

    this.spinner?.go();

    // delete songs
    this.songStore.deleteSongs(
      this.playlistStore.selected()?.id || null,
      this.songSelectStore.selectedIds()
    );

    await new Promise((r) => setTimeout(r, 4200));

    // cleanup
    this.songSelectStore.clear();
    this.spinnerShown = false;
    this.songDeletionConfirmVisible.emit(false);

    this.router.navigate(['/dashboard']);
  }
}
