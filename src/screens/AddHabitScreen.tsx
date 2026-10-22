import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { getHabits, saveHabits } from '../storage';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';
import { createId, todayDateKey } from '../utils/date';
import { normalizeHabitTitle } from '../utils/habits';

const DURATION_OPTIONS = ['15 MIN', '30 MIN', '60 MIN'];

const AddHabitScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [duration, setDuration] = useState('30 min');

  const [selectedTime, setSelectedTime] = useState(() => {
    const d = new Date();
    d.setHours(6, 0, 0, 0);
    return d;
  });
  const [showIosTimePicker, setShowIosTimePicker] = useState(false);

  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isEmojiFocused, setIsEmojiFocused] = useState(false);

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';
  const focusedBorderColor = isDark ? 'rgba(204, 255, 0, 0.7)' : theme.primary;

  const formattedTimeString = useMemo(() => {
    return selectedTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }, [selectedTime]);

  const openNativeTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedTime,
        mode: 'time',
        is24Hour: false,
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            setSelectedTime(date);
          }
        },
      });
    } else {
      setShowIosTimePicker((prev) => !prev);
    }
  };

  const handleEmojiChange = (text: string) => {
    const chars = Array.from(text);
    if (chars.length > 0) {
      setEmoji(chars[chars.length - 1]);
    } else {
      setEmoji('');
    }
  };

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Habit Name Required', 'Please enter a name for your habit.');
      return;
    }

    const currentHabits = getHabits();
    const normalizedInputTitle = normalizeHabitTitle(title);
    const hasDuplicate = currentHabits.some(
      (habit) => normalizeHabitTitle(habit.title) === normalizedInputTitle
    );

    if (hasDuplicate) {
      Alert.alert('Duplicate Habit', 'A habit with this name already exists.');
      return;
    }

    const newHabit = {
      id: createId(),
      title: title.trim(),
      emoji: emoji.trim() || '🎯',
      time: formattedTimeString,
      duration: duration.trim() || '30 min',
      createdAt: todayDateKey(),
      history: [],
    };

    const isSaved = saveHabits([...currentHabits, newHabit]);
    if (!isSaved) {
      Alert.alert(
        'Save Failed',
        'We could not save your habit right now. Please try again.'
      );
      return;
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          HABIT_NAME
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: isTitleFocused ? focusedBorderColor : subtleBorderColor,
              borderWidth: isTitleFocused ? 1.5 : 1,
              backgroundColor: isDark ? '#121212' : '#FFFFFF',
            },
          ]}
          placeholder="e.g. MORNING_RUN"
          placeholderTextColor={isDark ? '#555555' : '#888888'}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
        />

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>
          EMOJI
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: isEmojiFocused ? focusedBorderColor : subtleBorderColor,
              borderWidth: isEmojiFocused ? 1.5 : 1,
              backgroundColor: isDark ? '#121212' : '#FFFFFF',
            },
          ]}
          placeholder="e.g. 🎯"
          placeholderTextColor={isDark ? '#555555' : '#888888'}
          value={emoji}
          onChangeText={handleEmojiChange}
          onFocus={() => setIsEmojiFocused(true)}
          onBlur={() => setIsEmojiFocused(false)}
        />

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
              onChange={(_event, date) => {
                if (date) setSelectedTime(date);
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

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>
          TARGET_DURATION
        </Text>
        <View style={styles.optionsRow}>
          {DURATION_OPTIONS.map((opt) => {
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
                onPress={() => setDuration(opt.toLowerCase())}
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

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.savePillButton,
              {
                backgroundColor: theme.primary,
              },
            ]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.savePillButtonText,
                { color: isDark ? '#000000' : '#FFFFFF' },
              ]}
            >
              [ SAVE_HABIT ]
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cancelPillButton,
              {
                backgroundColor: isDark ? '#161618' : '#FFFFFF',
                borderColor: subtleBorderColor,
                borderWidth: 1,
              },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={[styles.cancelPillButtonText, { color: theme.textSecondary }]}>
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 11,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: monoFont,
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
  bottomButtonsContainer: {
    marginTop: 40,
    gap: 12,
  },
  savePillButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePillButtonText: {
    fontSize: 15,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  cancelPillButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPillButtonText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
  },
});

export default AddHabitScreen;