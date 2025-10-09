import { Component, Input } from '@angular/core';
import { Songdata } from '../utilities/interfaces/songdata';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-song',
  imports: [NgClass, FormsModule],
  templateUrl: './song.component.html',
  styleUrl: './song.component.css',
})
export class SongComponent {
  @Input() featured!: boolean;
  @Input() index!: number;
  @Input() song!: Songdata;

  checked: boolean = false;

  featuredSongs() {
    return this.featured
      ? `grid grid-flow-row grid-rows-4 h-full`
      : `flex items-center gap-2`;
  }

  featuredSongImg() {
    return this.featured ? `w-40 h-40 rounded-xl` : `w-30 h-30 rounded-xl`;
  }
}
