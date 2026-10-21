import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AddHabitScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Ошибка', 'Название привычки не может быть пустым');
      return;
    }


    Alert.alert('Успех', `Привычка "${title}" добавлена!`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Название привычки</Text>
      <TextInput
        style={styles.input}
        placeholder="Например: Пить воду"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Эмодзи</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите эмодзи"
        value={emoji}
        onChangeText={setEmoji}
        maxLength={2}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Добавить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddHabitScreen;