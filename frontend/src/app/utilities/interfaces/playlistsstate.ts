import { Playlistdata } from './playlistdata';

export interface PlaylistsState {
  playlists: Playlistdata[];
  loading: boolean;
}
