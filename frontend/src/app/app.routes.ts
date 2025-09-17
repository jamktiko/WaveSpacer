import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PlaylistComponent } from './playlist/playlist.component';

export const routes: Routes = [
  {
    component: HomepageComponent,
    path: '',
  },
  {
    component: PlaylistComponent,
    path: 'playlists',
  },
];
