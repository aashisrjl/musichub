import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Search as SearchIcon, X } from 'lucide-react-native';
import SongListItem from '@/components/SongListItem';
import EmptyState from '@/components/EmptyState';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { searchSongs, getAllSongs } from '@/services/musicLibrary';
import { Song } from '@/types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const allSongs = getAllSongs();

  const results = useMemo(() => searchSongs(query), [query]);

  const handleClear = useCallback(() => setQuery(''), []);

  const renderEmpty = () => {
    if (!query.trim()) {
      return (
        <EmptyState
          icon={<SearchIcon size={32} color={Colors.gold} strokeWidth={1.5} />}
          title="Search music..."
          message="Find songs by title, artist, album, or category"
        />
      );
    }
    return (
      <EmptyState
        title="No results found"
        message={`No songs match "${query}"`}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../public/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Search</Text>
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Colors.textTertiary} strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Search music..."
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <X size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item: Song) => item.id}
          renderItem={({ item }) => (
            <SongListItem song={item} queue={results} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        renderEmpty()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  searchBarContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    color: Colors.text,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 120,
  },
});
