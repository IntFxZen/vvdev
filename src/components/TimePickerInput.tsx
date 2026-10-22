import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

interface TimePickerInputProps {
  selectedTime: Date;
  onTimeChange: (date: Date) => void;
  formattedTimeString: string;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  selectedTime,
  onTimeChange,
  formattedTimeString,
}) => {
  const { theme, isDark } = useTheme();
  const [showIosTimePicker, setShowIosTimePicker] = useState(false);

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  const openNativeTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedTime,
        mode: 'time',
        is24Hour: true,
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            onTimeChange(date);
          }
        },
      });
    } else {
      setShowIosTimePicker((prev) => !prev);
    }
  };

  return (
    <>
      <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>
        REMINDER_TIME
      </Text>
      <TouchableOpacity
        style={[
          styles.timeInputContainer,
          {
            borderColor: subtleBorderColor,
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            borderWidth: 1,
          },
        ]}
        onPress={openNativeTimePicker}
        activeOpacity={0.7}
      >
        <Text style={[styles.timeText, { color: theme.text }]}>
          {formattedTimeString}
        </Text>
        <Text style={[styles.timeIcon, { color: theme.textSecondary }]}>⏱</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && showIosTimePicker && (
        <View style={styles.iosPickerContainer}>
          <RNDateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            is24Hour={true}
            locale="en_GB"
            onChange={(_event, date) => {
              if (date) onTimeChange(date);
            }}
          />
          <TouchableOpacity
            style={styles.iosPickerDoneButton}
            onPress={() => setShowIosTimePicker(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.iosPickerDoneText, { color: theme.primary }]}>
              DONE
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeText: {
    fontSize: 15,
    fontFamily: monoFont,
  },
  timeIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  iosPickerContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  iosPickerDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  iosPickerDoneText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
});

export default TimePickerInput;
