import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recentlistened',
  imports: [],
  templateUrl: './recentlistened.component.html',
  styleUrl: './recentlistened.component.css',
})
export class RecentlistenedComponent {
  @Input() img!: string | null;
  @Input() trackName!: string | null;
  @Input() artists!: string[] | [];
  @Input() index!: number;
  @Input() firstRecentSong!: boolean;
}
