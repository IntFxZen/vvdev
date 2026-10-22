import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

interface SelectionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.selectionBar,
        {
          backgroundColor: theme.selectionBarBg,
          borderColor: theme.selectionBarBorder,
        },
      ]}
    >
      <Text style={[styles.selectionText, { color: theme.textSecondary }]}>
        {selectedCount} selected
      </Text>
      <View style={styles.selectionActions}>
        <TouchableOpacity
          style={[styles.selectionAction, { backgroundColor: theme.buttonBackground }]}
          onPress={onClearSelection}
        >
          <Text style={[styles.selectionActionText, { color: theme.text }]}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectionAction, { backgroundColor: theme.deleteButtonBg }]}
          onPress={onDeleteSelected}
          disabled={!selectedCount}
        >
          <Text style={[styles.selectionActionText, { color: theme.deleteButtonText }]}>
            DELETE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionBar: {
    padding: 16,
    borderBottomWidth: 1,
  },
  selectionText: {
    fontSize: 14,
    fontFamily: monoFont,
    marginBottom: 8,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectionAction: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  selectionActionText: {
    fontSize: 14,
    fontFamily: monoFont,
    textAlign: 'center',
  },
});

export default SelectionBar;
