import { Playlistdata } from './playlistdata';

export interface PlaylistsState {
  playlists: Playlistdata[];
  selected: Playlistdata | null;
  loading: boolean;
  loaded: boolean;
}
