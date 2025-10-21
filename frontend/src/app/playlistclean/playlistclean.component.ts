import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { profileStore } from '../utilities/stores/profile.store';
import { playlistStore } from '../utilities/stores/playlist.store';
import { songStore } from '../utilities/stores/songs.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SongComponent } from '../song/song.component';
import { songSelectStore } from '../utilities/stores/songSelect.store';

@Component({
  selector: 'app-playlistclean',
  imports: [RouterLink, FormsModule, SongComponent],
  templateUrl: './playlistclean.component.html',
  styleUrl: './playlistclean.component.css',
})
export class PlaylistcleanComponent implements OnInit {
  title: string = 'WaveSpacer';
  allChecked: boolean = false;

  profileStore = inject(profileStore);
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);
  songSelectStore = inject(songSelectStore);

  ngOnInit(): void {
    this.profileStore.getProfile();
    this.songStore.getSongs();
    this.songSelectStore.clear();
  }

  capitalize(name: any) {
    if (name) {
      const capitalized = name[0].toUpperCase() + name.slice(1, name.length);
      return capitalized;
    } else {
      return name;
    }
  }
}
