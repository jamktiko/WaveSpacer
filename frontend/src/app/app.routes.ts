import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SpotifyCbComponent } from './spotify-cb/spotify-cb.component';
import { RegisterComponent } from './register/register.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { loginGuard } from './utilities/guards/login.guard';
import { selectionGuard } from './utilities/guards/selection.guard';
import { PlaylistcleanComponent } from './playlistclean/playlistclean.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingModalComponent } from './loadingmodal/modal.component';



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
  component: SpinnerComponent,
  path: 'spinner',
  title: 'Animations',
  },
  {
  component: LoadingModalComponent,
  path: 'loading',
  title: 'Loading Modal Test',
  },

];
