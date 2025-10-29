import { RouterLink } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { Playlistdata } from '../utilities/interfaces/playlistdata';
import { PlaylistComponent } from '../playlist/playlist.component';
import { playlistStore } from '../utilities/stores/playlist.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-playlists',
  imports: [PlaylistComponent, RouterLink, NgClass],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css',
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlistdata[] = [];
  title: string = 'WaveSpacer';
  profilepic!: string;

  constructor() {}
  playlistStore = inject(playlistStore);

  ngOnInit(): void {
    this.profilepic =
      localStorage.getItem('profilepic') || 'images/placeholderpp.png';
    this.playlistStore.getPlaylists();
  }

  refreshPlaylists() {
    this.playlistStore.getPlaylists(true);
  }

  playlistScrollbarClass() {
    return this.playlistStore.playlists().length > 2
      ? `relative px-5 pb-5 w-xs md:w-md md:px-10 pb-10 lg:my-20 lg:ml-10 xl:w-lg xl:ml-32 rounded-2xl bg-gradient-to-b from-[#212121] 
    to-gray-500 border-[#58525A] border-1 max-h-[90vh] overflow-y-auto overscroll-contain custom-scrollbar`
      : `relative px-5 pb-5 w-xs md:w-md md:px-10 pb-10 lg:my-20 lg:ml-10 xl:w-lg xl:ml-32 rounded-2xl bg-gradient-to-b from-[#212121] 
    to-gray-500 border-[#58525A] border-1;`;
  }

  playlistScrollableClass() {
    return this.playlistStore.playlists().length > 2
      ? `grid gap-5 md:grid-cols-2 lg:gap-7 mb-20`
      : `grid gap-5 md:grid-cols-2 lg:gap-7 mb-10`;
  }
}
