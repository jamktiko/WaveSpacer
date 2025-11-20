import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recentlistened',
  imports: [NgClass],
  templateUrl: './recentlistened.component.html',
  styleUrl: './recentlistened.component.css',
})
export class RecentlistenedComponent implements OnInit {
  @Input() img!: string | null;
  @Input() trackName!: string | null;
  @Input() artists!: string[] | [];
  @Input() index!: number;
  @Input() firstRecentSong!: boolean;
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

  isLastItem() {
    return this.lastItem ? `rounded-bl-xl` : '';
  }

  ngOnInit(): void {
    if (this.listenedAt) {
      this.formattedDate = this.formatDate(this.listenedAt);
    }
  }
}
