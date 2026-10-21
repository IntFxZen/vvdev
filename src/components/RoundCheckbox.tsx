import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  isChecked: boolean;
  onPress: () => void;
};

const RoundCheckbox = ({ isChecked, onPress }: Props) => {
  const { theme, isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.checkbox,
        isChecked
          ? { backgroundColor: theme.primary, borderColor: theme.primary }
          : {
              backgroundColor: isDark ? '#222226' : '#E8E8E8',
              borderColor: isDark ? '#3A3A3C' : '#D1D1D6',
            },
        pressed && { opacity: 0.7 },
      ]}
    >
      {isChecked && (
        <Text style={[styles.checkmark, { color: isDark ? '#000000' : '#FFFFFF' }]}>
          ✓
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
});

export default RoundCheckbox;