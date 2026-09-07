const fs = require('fs');
const path = require('path');

// Configuration
const MUSIC_DIR = path.join(__dirname, '../assets/musics');
const SONGS_FILE = path.join(__dirname, '../data/songs.ts');

// Use logo and banner for all music artwork
const LOGO_PATH = '../public/logo.png';
const BANNER_PATH = '../public/banner.jpeg';

// Helper function to convert folder name to display label
function folderNameToLabel(folderName) {
  return folderName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to generate description for category
function generateDescription(folderName) {
  const label = folderNameToLabel(folderName);
  return `Music from ${label}`;
}

// Helper function to sanitize filename for ID
function sanitizeId(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-z0-9]/gi, '_') // Replace special chars with underscore
    .toLowerCase();
}

// Helper function to clean up title (remove special characters and extra info)
function cleanTitle(filename) {
  // Remove extension first
  let title = filename.replace(/\.[^/.]+$/, '');
  
  title = title
    .replace(/[｜｜]/g, ' | ') // Replace special separators with pipe
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // Try to extract just the song title from complex patterns
  // Pattern: Title | Artist | Movie | Actors | Additional Info (5 parts)
  // Pattern: Title | Movie | Actors | Artists (4 parts)
  const complexPatterns = [
    /^([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*(.+)/,
    /^([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*(.+)/,
    /^([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)/,
    /^([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)/,
  ];
  
  for (const pattern of complexPatterns) {
    const match = title.match(pattern);
    if (match) {
      // Return just the first part (the song title)
      return match[1].trim();
    }
  }
  
  return title;
}

// Helper function to extract artist from filename (basic heuristic)
function extractArtist(filename) {
  // Remove extension first
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Try to extract artist from common patterns
  const patterns = [
    // Pattern: Title | Artist | Movie | Actors | Additional Info (5 parts)
    {
      regex: /([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*(.+)/,
      group: 2
    },
    // Pattern: Title | Movie | Actors | Artist(s) (4 parts) - uses the actual full-width pipe character
    {
      regex: /([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*([^｜]+)\s*｜\s*(.+)/,
      group: 4
    },
    // Pattern: Title | Artist | Movie | Actors | Additional Info (5 parts) - regular pipe
    {
      regex: /([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)/,
      group: 2
    },
    // Pattern: Title | Movie | Actors | Artist(s) (4 parts) - regular pipe
    {
      regex: /([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)/,
      group: 4
    },
    // Pattern: Artist - Title
    {
      regex: /(.+?)\s*[｜-]\s*(.+)/,
      group: 1
    },
    // Pattern: Artist ft. Title
    {
      regex: /(.+?)\s+ft\.?\s*(.+)/i,
      group: 1
    },
  ];
  
  for (const {regex, group} of patterns) {
    const match = nameWithoutExt.match(regex);
    if (match) {
      return match[group].trim();
    }
  }
  
  return 'Unknown Artist';
}

// Generate song entry
function generateSongEntry(filename, category, index, artworkIndex) {
  const id = `${category}_${index + 1}`;
  const title = cleanTitle(filename);
  const artist = extractArtist(filename); // Use original filename for artist extraction
  const audioPath = `../assets/musics/${category}/${filename}`;
  
  // Escape single quotes and backslashes in the filename for the require statement
  const escapedAudioPath = audioPath
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'");   // Then escape single quotes
  
  // Escape single quotes in title and artist
  const escapedTitle = title.replace(/'/g, "\\'");
  const escapedArtist = artist.replace(/'/g, "\\'");
  
  return `  {
    id: '${id}',
    title: '${escapedTitle}',
    artist: '${escapedArtist}',
    album: 'Unknown Album',
    category: '${category}',
    audioUri: require('${escapedAudioPath}'),
    artwork: ARTWORK_OPTIONS[${artworkIndex}],
  }`;
}

// Scan directory for MP3 files
function scanDirectory(dirPath, category) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return [];
  }
  
  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.mp3') && !file.startsWith('.'))
    .sort();
  
  console.log(`Found ${files.length} files in ${category}`);
  return files;
}

// Get all category folders
function getCategoryFolders() {
  if (!fs.existsSync(MUSIC_DIR)) {
    console.log(`Music directory not found: ${MUSIC_DIR}`);
    return [];
  }
  
  const folders = fs.readdirSync(MUSIC_DIR)
    .filter(file => {
      const filePath = path.join(MUSIC_DIR, file);
      return fs.statSync(filePath).isDirectory() && !file.startsWith('.');
    })
    .sort();
  
  console.log(`Found ${folders.length} category folders: ${folders.join(', ')}`);
  return folders;
}

// Generate songs content
function generateSongsContent() {
  const categories = getCategoryFolders();
  
  // Generate category info
  const categoriesArray = categories.map(folder => {
    return `  {
    key: '${folder}',
    label: '${folderNameToLabel(folder)}',
    description: '${generateDescription(folder)}',
  }`;
  }).join(',\n');
  
  // Generate category labels
  const categoryLabels = categories.map(folder => {
    return `  ${folder}: '${folderNameToLabel(folder)}'`;
  }).join(',\n');
  
  let content = `import { Song, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
${categoriesArray},
];

export const CATEGORY_LABELS: Record<string, string> = {
${categoryLabels},
};

// Default artwork images used when a song has no custom artwork.
// These are stock photos from Pexels (license-free).
const ARTWORK_OPTIONS = ${JSON.stringify(ARTWORK_OPTIONS)};

// ---------------------------------------------------------------------------
//  AUTO-GENERATED SONG LIST
//  This file is automatically generated by scripts/generate-songs.js
//  To add new songs or categories:
//    1. Create a new folder in assets/musics/ (e.g., "english", "pop")
//    2. Place MP3 files in that folder
//    3. Run: npm run generate-songs
//  The folder name will automatically become the category name!
// ---------------------------------------------------------------------------

export const SONGS: Song[] = [
`;

  // Add songs for each category
  categories.forEach((folder, folderIndex) => {
    const files = scanDirectory(path.join(MUSIC_DIR, folder), folder);
    
    if (files.length > 0) {
      content += `  // === ${folderNameToLabel(folder)} (auto-generated from assets/musics/${folder}/) ===\n`;
      
      files.forEach((file, index) => {
        // Use artwork index based on category and song position
        const artworkIndex = (folderIndex + index) % ARTWORK_OPTIONS.length;
        content += generateSongEntry(file, folder, index, artworkIndex) + ',\n';
      });
      
      content += '\n';
    }
  });

  content += '];\n';
  
  return content;
}

// Main execution
try {
  console.log('Generating songs.ts from music folders...');
  const content = generateSongsContent();
  fs.writeFileSync(SONGS_FILE, content, 'utf8');
  console.log('✅ Successfully generated songs.ts');
  console.log(`📁 Updated: ${SONGS_FILE}`);
} catch (error) {
  console.error('❌ Error generating songs:', error.message);
  process.exit(1);
}