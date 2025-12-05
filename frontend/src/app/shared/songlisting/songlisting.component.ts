import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-songlisting',
  imports: [NgClass],
  templateUrl: './songlisting.component.html',
  styleUrl: './songlisting.component.css',
})
export class SonglistingComponent implements OnInit {
  // Data is acquired from dashboard and statistics-component based on where it is used
  @Input() img!: string | null;
  @Input() trackName!: string | null;
  @Input() artists!: string[] | [];
  @Input() index!: number;
  @Input() titled!: boolean;
  @Input() plays!: number | null;
  @Input() listenedAt!: Date | null;
  @Input() listType!: string;
  @Input() title!: string;
  @Input() genre!: string;
  @Input() genrePercentile!: string;
  @Input() lastItem!: boolean;

  formattedDate!: string | undefined;

  formatDate(date: Date) {
    if (date) {
      const formatted = new Date(date).toUTCString();
      return formatted;
    } else {
      return;
    }
  }

  // NgClass. Last item of the listing should be rounded for visual purposes
  isLastItem() {
    return this.lastItem ? `rounded-bl-xl` : '';
  }

  ngOnInit(): void {
    if (this.listenedAt) {
      this.formattedDate = this.formatDate(this.listenedAt);
    }
  }
}
