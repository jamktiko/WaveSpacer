import { Component, Input, inject } from '@angular/core';
import { Songdata } from '../utilities/interfaces/songdata';
import { NgClass } from '@angular/common';
import { songSelect } from '../utilities/stores/songSelect.store';

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
  @Input() allChecked!: boolean;

  songSelectStore = inject(songSelect);

  selectedSongs: number[] = [];

  featuredSongs() {
    return this.featured
      ? `grid grid-flow-row grid-rows-4 h-full`
      : `flex items-center gap-2`;
  }

  featuredSongImg() {
    return this.featured ? `w-40 h-40 rounded-xl` : `w-30 h-30 rounded-xl`;
  }
}
