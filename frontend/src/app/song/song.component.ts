import { Component, Input, inject, effect } from '@angular/core';
import { Songdata } from '../utilities/interfaces/songdata';
import { NgClass } from '@angular/common';
import { songSelectStore } from '../utilities/stores/songSelect.store';
import { songStore } from '../utilities/stores/songs.store';

@Component({
  selector: 'app-song',
  imports: [NgClass],
  templateUrl: './song.component.html',
  styleUrl: './song.component.css',
})
export class SongComponent {
  @Input() featured!: boolean;
  @Input() index!: number;
  @Input() song!: Songdata;

  songSelectStore = inject(songSelectStore);
  songStore = inject(songStore);

  selectedSongs: number[] = [];
  lastTimePlayed!: string;

  formatDate(date: Date) {
    if (!date || isNaN(new Date(date).getTime())) {
      return '-';
    }
    return new Date(date).toLocaleDateString();
  }

  featuredSongs() {
    return this.featured
      ? `grid grid-flow-row grid-rows-4 h-full`
      : `flex items-center gap-2`;
  }

  featuredSongImg() {
    return this.featured ? `w-25 h-25 rounded-xl` : `w-20 h-20 rounded-xl`;
  }
}
