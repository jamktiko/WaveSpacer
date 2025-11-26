import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { SpotifyCbComponent } from './features/spotify-cb/spotify-cb.component';
import { RegisterComponent } from './features/register/register.component';
import { PlaylistsComponent } from './features/playlists/playlists/playlists.component';
import { loginGuard } from './core/guards/login.guard';
import { selectionGuard } from './core/guards/selection.guard';
import { PlaylistcleanComponent } from './features/playlistclean/playlistclean/playlistclean.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';
import { StatisticsComponent } from './features/statistics/statistics/statistics.component';

export const routes: Routes = [
  {
    component: WelcomeComponent,
    title: 'Welcome',
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
    title: 'loading',
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
    canActivate: [selectionGuard],
  },
  {
    component: DashboardComponent,
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [loginGuard],
  },
  {
    component: ProfileComponent,
    path: 'profile',
    title: 'Profile',
    canActivate: [loginGuard],
  },
  {
    component: SettingsComponent,
    path: 'settings',
    title: 'Settings',
    canActivate: [loginGuard],
  },
  {
    component: StatisticsComponent,
    path: 'statistics',
    title: 'Statistics',
    canActivate: [loginGuard],
  },
];
