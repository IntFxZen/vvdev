import React, { useState } from 'react';
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
import { getHabits, saveHabits } from '../storage';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

const DURATION_OPTIONS = ['15 MIN', '30 MIN', '60 MIN'];

const normalizeHabitTitle = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
};

const AddHabitScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [time, setTime] = useState('06:00 AM');
  const [duration, setDuration] = useState('30 min');

  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isEmojiFocused, setIsEmojiFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';
  const focusedBorderColor = isDark ? 'rgba(204, 255, 0, 0.7)' : theme.primary;

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
      id: Date.now().toString(),
      title: title.trim(),
      emoji: emoji.trim() || '🎯',
      color: '#E3F2FD',
      time: time.trim() || '06:00 AM',
      duration: duration.trim() || '30 min',
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
        <View
          style={[
            styles.timeInputContainer,
            {
              borderColor: isTimeFocused ? focusedBorderColor : subtleBorderColor,
              borderWidth: isTimeFocused ? 1.5 : 1,
              backgroundColor: isDark ? '#121212' : '#FFFFFF',
            },
          ]}
        >
          <TextInput
            style={[styles.timeInput, { color: theme.text }]}
            placeholder="06:00 AM"
            placeholderTextColor={isDark ? '#555555' : '#888888'}
            value={time}
            onChangeText={setTime}
            onFocus={() => setIsTimeFocused(true)}
            onBlur={() => setIsTimeFocused(false)}
          />
          <Text style={[styles.timeIcon, { color: theme.textSecondary }]}>⏱</Text>
        </View>

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
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: monoFont,
    padding: 0,
  },
  timeIcon: {
    fontSize: 16,
    marginLeft: 8,
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