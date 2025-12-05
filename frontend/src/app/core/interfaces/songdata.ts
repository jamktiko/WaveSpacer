export interface Songdata {
  id: string | null;
  name: string | null;
  amount: number | null;
  track_image: string | null;
  artist_names: [];
  last_played: Date;
}
