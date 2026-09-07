export type SongCategory = string;

export type RepeatMode = 'off' | 'all' | 'one';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  category: SongCategory;
  audioUri: string;
  artwork?: string;
}

export interface CategoryInfo {
  key: SongCategory;
  label: string;
  description: string;
}

export interface AppSettings {
  autoplay: boolean;
  shuffle: boolean;
  darkTheme: boolean;
}
