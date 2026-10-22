import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

export type CompletionFilter = 'all' | 'done' | 'pending';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  completionFilter: CompletionFilter;
  onFilterChange: (filter: CompletionFilter) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  completionFilter,
  onFilterChange,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: theme.card,
            borderColor: theme.subtleBorder,
          },
        ]}
      >
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search habits"
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
          multiline={false}
          numberOfLines={1}
          returnKeyType="search"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.filterRowStandalone}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            completionFilter === 'all' && { backgroundColor: theme.buttonBackground },
          ]}
          onPress={() => onFilterChange('all')}
        >
          <Text style={[styles.filterChipText, { color: theme.text }]}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            completionFilter === 'done' && { backgroundColor: theme.doneBadgeBg },
          ]}
          onPress={() => onFilterChange('done')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: completionFilter === 'done' ? theme.primary : theme.text },
            ]}
          >
            DONE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            completionFilter === 'pending' && {
              backgroundColor: theme.pendingBadgeBg,
            },
          ]}
          onPress={() => onFilterChange('pending')}
        >
          <Text
            style={[
              styles.filterChipText,
              {
                color: completionFilter === 'pending'
                  ? theme.pendingBadgeText
                  : theme.text,
              },
            ]}
          >
            PENDING
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  searchInput: {
    fontSize: 14,
    fontFamily: monoFont,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  filterRowStandalone: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  filterChip: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
});

export default SearchAndFilter;
