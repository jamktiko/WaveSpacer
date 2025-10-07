import { Songdata } from './songdata';

export interface songState {
  songs: Songdata[];
  loading: boolean;
}
