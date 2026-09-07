import { Song, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'old_nepali',
    label: 'Old Nepali',
    description: 'Timeless classics from Nepal',
  },
  {
    key: 'old_hindi',
    label: 'Old Hindi',
    description: 'Golden era Hindi melodies',
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  old_nepali: 'Old Nepali',
  old_hindi: 'Old Hindi',
};

// Default artwork images used when a song has no custom artwork.
// These are stock photos from Pexels (license-free).
const ARTWORK_NEPALI_1 =
  'https://images.pexels.com/photos/38418070/pexels-photo-38418070.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';
const ARTWORK_NEPALI_2 =
  'https://images.pexels.com/photos/13319068/pexels-photo-13319068.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';
const ARTWORK_NEPALI_3 =
  'https://images.pexels.com/photos/38417936/pexels-photo-38417936.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';
const ARTWORK_HINDI_1 =
  'https://images.pexels.com/photos/228842/pexels-photo-228842.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';
const ARTWORK_HINDI_2 =
  'https://images.pexels.com/photos/32098834/pexels-photo-32098834.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';
const ARTWORK_HINDI_3 =
  'https://images.pexels.com/photos/8852636/pexels-photo-8852636.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';
const ARTWORK_VINYL =
  'https://images.pexels.com/photos/5764281/pexels-photo-5764281.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';

// ---------------------------------------------------------------------------
//  HOW TO ADD YOUR OWN SONGS
// ---------------------------------------------------------------------------
//
//  1. Place your .mp3 files inside:
//       assets/musics/old_nepali/   (for Nepali songs)
//       assets/musics/old_hindi/    (for Hindi songs)
//
//  2. For each song, add an entry to the SONGS array below.
//     Use `require()` to reference the local audio file — this lets Expo
//     bundle it into the native app build.
//
//  3. (Optional) Set an `artwork` URL for album art, or omit it to use a
//     category default.
//
//  Example:
//
//    {
//      id: 'nepali_1',
//      title: 'Resham Firiri',
//      artist: 'Narayan Gopal',
//      album: 'Classic Hits',
//      category: 'old_nepali',
//      audioUri: require('../assets/musics/old_nepali/resham_firiri.mp3'),
//      artwork: 'https://example.com/album-art.jpg',
//    },
//
//  To add a new category (e.g. old_english):
//    - Add the key to the `SongCategory` type in types/index.ts
//    - Add an entry to CATEGORIES above
//    - Add songs with that category
// ---------------------------------------------------------------------------

export const SONGS: Song[] = [
  // === OLD NEPALI (sample entries — replace with your own) ===
  {
    id: 'nepali_1',
    title: 'Resham Firiri',
    artist: 'Narayan Gopal',
    album: 'Evergreen Classics',
    category: 'old_nepali',
    // Replace with: require('../assets/musics/old_nepali/resham_firiri.mp3')
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artwork: ARTWORK_NEPALI_1,
  },
  {
    id: 'nepali_2',
    title: 'Aaja Bholi Hunchhu',
    artist: 'Narayan Gopal',
    album: 'Golden Voices',
    category: 'old_nepali',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artwork: ARTWORK_NEPALI_2,
  },
  {
    id: 'nepali_3',
    title: 'Malai Lekha Deu',
    artist: 'Dharma Raj Thapa',
    album: 'Folk Treasures',
    category: 'old_nepali',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    artwork: ARTWORK_NEPALI_3,
  },
  {
    id: 'nepali_4',
    title: 'Panche Baja',
    artist: 'Traditional',
    album: 'Folk Treasures',
    category: 'old_nepali',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    artwork: ARTWORK_NEPALI_1,
  },
  {
    id: 'nepali_5',
    title: 'Simsime Pani',
    artist: 'Folk Collective',
    category: 'old_nepali',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    artwork: ARTWORK_VINYL,
  },
  {
    id: 'nepali_6',
    title: 'Gairika Ko Geet',
    artist: 'Bhaktaraj Sharma',
    album: 'Classic Hits',
    category: 'old_nepali',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    artwork: ARTWORK_NEPALI_2,
  },

  // === OLD HINDI (sample entries — replace with your own) ===
  {
    id: 'hindi_1',
    title: 'Kora Kagaz Tha',
    artist: 'Kishore Kumar',
    album: 'Bollywood Classics',
    category: 'old_hindi',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artwork: ARTWORK_HINDI_1,
  },
  {
    id: 'hindi_2',
    title: 'Lag Ja Gale',
    artist: 'Lata Mangeshkar',
    album: 'Golden Era',
    category: 'old_hindi',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artwork: ARTWORK_HINDI_2,
  },
  {
    id: 'hindi_3',
    title: 'Kabhi Kabhie',
    artist: 'Mukesh',
    album: 'Bollywood Classics',
    category: 'old_hindi',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    artwork: ARTWORK_HINDI_3,
  },
  {
    id: 'hindi_4',
    title: 'Tere Bina Zindagi',
    artist: 'Kishore Kumar, Lata Mangeshkar',
    album: 'Duets',
    category: 'old_hindi',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    artwork: ARTWORK_HINDI_1,
  },
  {
    id: 'hindi_5',
    title: 'Chingari Koi Bhadke',
    artist: 'Kishore Kumar',
    album: 'Golden Era',
    category: 'old_hindi',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    artwork: ARTWORK_VINYL,
  },
  {
    id: 'hindi_6',
    title: 'Mera Joota Hai Japani',
    artist: 'Mukesh',
    album: 'Classic Hits',
    category: 'old_hindi',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    artwork: ARTWORK_HINDI_2,
  },
];
