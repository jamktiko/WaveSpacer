import { RouterLink } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { Playlistdata } from '../utilities/interfaces/playlistdata';
import { PlaylistComponent } from '../playlist/playlist.component';
import { playlistStore } from '../utilities/stores/playlist.store';
import { NgClass } from '@angular/common';
import { uiStore } from '../utilities/stores/ui.store';
import { UserdropdownComponent } from '../userdropdown/userdropdown.component';
import { settingStore } from '../utilities/stores/settings.store';

@Component({
  selector: 'app-playlists',
  imports: [PlaylistComponent, RouterLink, NgClass, UserdropdownComponent],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css',
})
export class PlaylistsComponent implements OnInit {
  playlistStore = inject(playlistStore);
  uiStore = inject(uiStore);
  settingStore = inject(settingStore);

  playlists: Playlistdata[] = [];
  title: string = this.uiStore.title();
  profilepic!: string;

  ngOnInit(): void {
    this.profilepic =
      localStorage.getItem('profilepic') || 'images/placeholderpp.png';
    this.playlistStore.getPlaylists();
  }

  /* Used to fetch latest data on user's playlists. The fetching of playlists are normally blocked, but using the argument true it accepts
  the request 
  */
  refreshPlaylists() {
    this.playlistStore.getPlaylists(true);
  }

  // NgClass. Controls whether the playlists-list is scrollable
  playlistScrollbarClass() {
    return this.playlistStore.playlists().length > 2
      ? `max-h-[90vh] overflow-y-auto overscroll-contain custom-scrollbar`
      : ``;
  }

  playlistScrollableClass() {
    return this.playlistStore.playlists().length > 2 ? `mb-20` : `mb-10`;
  }
}
