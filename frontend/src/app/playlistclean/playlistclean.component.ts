import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { RouterLink } from '@angular/router';
import { playlistStore } from '../utilities/stores/playlist.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-playlistclean',
  imports: [RouterLink, FormsModule],
  templateUrl: './playlistclean.component.html',
  styleUrl: './playlistclean.component.css',
})
export class PlaylistcleanComponent implements OnInit {
  title: string = 'WaveSpacer';
  checked: boolean = false;

  profileStore = inject(profileStore);
  playlistStore = inject(playlistStore);

  ngOnInit(): void {
    this.profileStore.getProfile();
  }
}
