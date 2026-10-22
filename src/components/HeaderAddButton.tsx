import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

interface HeaderAddButtonProps {
  onPress: () => void;
}

const HeaderAddButton: React.FC<HeaderAddButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: theme.buttonBackground,
            borderWidth: 1,
            borderColor: theme.subtleBorder,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.addButtonText, { color: theme.primary }]}>+ NEW</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
});

export default HeaderAddButton;
