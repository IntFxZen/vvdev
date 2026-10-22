import React, { useState, useMemo } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { getHabits, saveHabits } from '../storage';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';
import { createId, todayDateKey } from '../utils/date';
import { normalizeHabitTitle } from '../utils/habits';
import DurationPicker from '../components/DurationPicker';
import TimePickerInput from '../components/TimePickerInput';
import CustomAlert, { AlertButton } from '../components/CustomAlert';

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

  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isEmojiFocused, setIsEmojiFocused] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
  }>({ visible: false, title: '' });

  const showAlert = (titleStr: string, messageStr?: string, buttonsArr?: AlertButton[]) => {
    setAlertConfig({ visible: true, title: titleStr, message: messageStr, buttons: buttonsArr });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';
  const focusedBorderColor = isDark ? 'rgba(204, 255, 0, 0.7)' : theme.primary;

  const formattedTimeString = useMemo(() => {
    return selectedTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, [selectedTime]);

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
      showAlert('Habit Name Required', 'Please enter a name for your habit.');
      return;
    }

    const currentHabits = getHabits();
    const normalizedInputTitle = normalizeHabitTitle(title);
    const hasDuplicate = currentHabits.some(
      (habit) => normalizeHabitTitle(habit.title) === normalizedInputTitle
    );

    if (hasDuplicate) {
      showAlert('Duplicate Habit', 'A habit with this name already exists.');
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
      showAlert(
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

        <TimePickerInput
          selectedTime={selectedTime}
          onTimeChange={setSelectedTime}
          formattedTimeString={formattedTimeString}
        />

        <DurationPicker
          duration={duration}
          onSelectDuration={setDuration}
        />

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

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onRequestClose={hideAlert}
      />
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
