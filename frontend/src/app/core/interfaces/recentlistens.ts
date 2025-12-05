import { Lastmonthfavorite } from './lastmonthfavorite';
import { Songdata } from './songdata';
import { Recentsongs } from './recentsongs';

export interface recentListens {
  recents: Recentsongs[];
  lastMonthFav: Lastmonthfavorite;
  loading: boolean;
}
