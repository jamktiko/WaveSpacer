import { Songdata } from './songdata';
import { Genre } from './genre';

export interface songState {
  songs: Songdata[];
  loading: boolean;
  genres: Genre[];
}
