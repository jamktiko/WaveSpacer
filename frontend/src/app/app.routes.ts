import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SpotifyCbComponent } from './spotify-cb/spotify-cb.component';
import { RegisterComponent } from './register/register.component';
import { PlaylistsComponent } from './playlists/playlists.component';

export const routes: Routes = [
  {
    component: HomepageComponent,
    path: '',
  },
  {
    component: PlaylistsComponent,
    path: 'playlists',
  },
  {
    component: SpotifyCbComponent,
    path: 'spotifycb',
  },
  {
    component: RegisterComponent,
    path: 'register',
  },
];
