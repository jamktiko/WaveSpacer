import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SpotifyCbComponent } from './spotify-cb/spotify-cb.component';
import { RegisterComponent } from './register/register.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { loginGuard } from './utilities/guards/login.guard';
import { PlaylistcleanComponent } from './playlistclean/playlistclean.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    component: HomepageComponent,
    title: 'Home',
    path: '',
  },
  {
    component: PlaylistsComponent,
    path: 'playlists',
    title: 'Select your playlist',
    canActivate: [loginGuard],
  },
  {
    component: SpotifyCbComponent,
    path: 'spotifycb',
  },
  {
    component: RegisterComponent,
    path: 'register',
    title: 'Register your account',
  },
  {
    component: PlaylistcleanComponent,
    path: 'playlistclean',
    title: 'Clean your playlist',
    canActivate: [loginGuard],
  },
  {
    component: DashboardComponent,
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [loginGuard],
  },
];
