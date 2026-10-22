import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

const DURATION_OPTIONS = ['15 MIN', '30 MIN', '60 MIN'];

interface DurationPickerProps {
  duration: string;
  onSelectDuration: (duration: string) => void;
  options?: string[];
}

const DurationPicker: React.FC<DurationPickerProps> = ({
  duration,
  onSelectDuration,
  options = DURATION_OPTIONS,
}) => {
  const { theme, isDark } = useTheme();

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  return (
    <>
      <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>
        TARGET_DURATION
      </Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isSelected =
            duration.toUpperCase() === opt || duration === opt.toLowerCase();
          const completedBorderColor = isDark
            ? 'rgba(204, 255, 0, 0.6)'
            : 'rgba(98, 0, 238, 0.6)';

          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.durationPill,
                isSelected
                  ? {
                      borderColor: completedBorderColor,
                      borderWidth: 1.5,
                      backgroundColor: isDark ? '#0D140A' : '#F4FBF0',
                    }
                  : {
                      borderColor: subtleBorderColor,
                      borderWidth: 1,
                      backgroundColor: isDark ? '#161618' : '#FFFFFF',
                    },
              ]}
              onPress={() => onSelectDuration(opt.toLowerCase())}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.durationText,
                  { color: isSelected ? theme.primary : theme.textSecondary },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
});

export default DurationPicker;
