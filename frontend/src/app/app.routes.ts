import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SpotifyCbComponent } from './spotify-cb/spotify-cb.component';

export const routes: Routes = [
  {
    component: HomepageComponent,
    path: '',
  },
  {
    component: PlaylistComponent,
    path: 'playlists',
  },
  {
    component: SpotifyCbComponent,
    path: 'spotifycb',
  },
];
