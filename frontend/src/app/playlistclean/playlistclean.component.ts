import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { playlistStore } from '../utilities/stores/playlist.store';
import { songStore } from '../utilities/stores/songs.store';
import { RouterLink } from '@angular/router';
import { SongComponent } from '../song/song.component';
import { songSelectStore } from '../utilities/stores/songSelect.store';
import { FiltersComponent } from '../filters/filters.component';
import { ConfirmSongDeletionSelectComponent } from '../confirm-song-deletion-select/confirm-song-deletion-select.component';
import { uiStore } from '../utilities/stores/ui.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { settingStore } from '../utilities/stores/settings.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-playlistclean',
  imports: [
    RouterLink,
    SongComponent,
    FiltersComponent,
    ConfirmSongDeletionSelectComponent,
    UserdropdownComponent,
    NgClass,
  ],
  templateUrl: './playlistclean.component.html',
  styleUrl: './playlistclean.component.css',
})
export class PlaylistcleanComponent implements OnInit {
  playlistStore = inject(playlistStore);
  songStore = inject(songStore);
  songSelectStore = inject(songSelectStore);
  uiStore = inject(uiStore);
  settingStore = inject(settingStore);

  title: string = this.uiStore.title();
  filtersVisible: boolean = false;
  confirmDeleteVisible!: boolean;
  selectedPlaylist!: any;
  profilepic!: string;

  ngOnInit(): void {
    this.selectedPlaylist = JSON.parse(
      localStorage.getItem('selectedPlaylist') || ''
    );
    this.songStore.getSongs(this.selectedPlaylist.id);
    // this.profileStore.getProfile();
    this.profilepic =
      localStorage.getItem('profilepic') || 'images/placeholderpp.png';
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

  closeSongDeletionConfirm(value: boolean) {
    this.confirmDeleteVisible = value;
  }
}
