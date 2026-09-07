# Music Management System

This app uses an automatic music management system that generates song lists from your music folders.

## How to Add New Music

### Adding New Songs to Existing Categories

1. Simply place your MP3 files in the appropriate folder:
   - `assets/musics/old_nepali/` for Nepali songs
   - `assets/musics/old_hindi/` for Hindi songs

2. Run the generation command:
   ```bash
   npm run generate-songs
   ```

3. Restart your app to see the new songs!

### Creating New Categories

1. Create a new folder in `assets/musics/` with your desired category name:
   - Example: `assets/musics/english/` or `assets/musics/pop/`

2. Place MP3 files in that folder

3. Run the generation command:
   ```bash
   npm run generate-songs
   ```

4. The new category will automatically appear in your app with:
   - Category name derived from folder name (e.g., "english" → "English")
   - All songs from that folder
   - Automatic artwork assignment

## How It Works

- **Folder Names = Category Names**: The system automatically detects all folders in `assets/musics/` and creates categories from them
- **Automatic Song Detection**: All `.mp3` files in each folder are automatically added to the song list
- **Smart Title Generation**: Song titles are cleaned up from filenames (removes extensions, special characters)
- **Artist Detection**: Basic artist extraction from filename patterns
- **Artwork Assignment**: Songs automatically get assigned artwork from a pool of stock images

## File Naming Tips

For better automatic artist detection, use naming patterns like:
- `Artist - Song Title.mp3`
- `Artist ft. Featured Artist - Song Title.mp3`
- `Artist | Song Title.mp3`

## Manual Customization

If you want to customize song metadata (artist, album, artwork) after generation, you can manually edit `data/songs.ts`. However, your changes will be overwritten the next time you run `npm run generate-songs`.

## Example Workflow

```bash
# Add new songs to old_nepali folder
cp ~/Music/new_song.mp3 assets/musics/old_nepali/

# Create a new category
mkdir assets/musics/rock
cp ~/Music/rock_songs/*.mp3 assets/musics/rock/

# Regenerate the song list
npm run generate-songs

# Restart your app
npm run dev
```

## Notes

- Only `.mp3` files are currently supported
- Files starting with `.` (hidden files) are ignored
- The app needs to be restarted after running the generation command
- The generation script preserves the order of files alphabetically