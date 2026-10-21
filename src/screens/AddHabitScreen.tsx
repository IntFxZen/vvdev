import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getHabits, saveHabits } from '../storage';
import { useTheme } from '../theme/ThemeContext';

const AddHabitScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [time, setTime] = useState('8:00 AM');
  const [duration, setDuration] = useState('30 min');

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Ошибка', 'Название привычки не может быть пустым');
      return;
    }

    const currentHabits = getHabits();

    const newHabit = {
      id: Date.now().toString(),
      title: title.trim(),
      emoji: emoji || '🎯',
      color: '#E3F2FD',
      time: time.trim() || '8:00 AM',
      duration: duration.trim() || '30 min',
      history: [],
    };

    saveHabits([...currentHabits, newHabit]);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.label, { color: theme.text }]}>Название привычки</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        placeholder="Например: MORNING_RUN"
        placeholderTextColor={theme.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: theme.text }]}>Эмодзи</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        placeholder="Введите эмодзи"
        placeholderTextColor={theme.textSecondary}
        value={emoji}
        onChangeText={setEmoji}
        maxLength={2}
      />

      <Text style={[styles.label, { color: theme.text }]}>Время (например: 8:00 AM)</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        placeholder="8:00 AM"
        placeholderTextColor={theme.textSecondary}
        value={time}
        onChangeText={setTime}
      />

      <Text style={[styles.label, { color: theme.text }]}>Длительность (например: 30 min)</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        placeholder="30 min"
        placeholderTextColor={theme.textSecondary}
        value={duration}
        onChangeText={setDuration}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: isDark ? '#000000' : '#FFFFFF' }]}>Добавить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: { fontSize: 16, fontWeight: 'bold' },
});

export default AddHabitScreen;