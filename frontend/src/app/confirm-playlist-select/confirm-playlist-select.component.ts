import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-playlist-select',
  imports: [],
  templateUrl: './confirm-playlist-select.component.html',
  styleUrl: './confirm-playlist-select.component.css',
})
export class ConfirmPlaylistSelectComponent {
  @Input() playlistName!: string;
}
