import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  isChecked: boolean;
  onPress: () => void;
};

const RoundCheckbox = ({ isChecked, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10} // Увеличиваем зону нажатия
      style={({ pressed }) => [
        styles.checkbox,
        isChecked && styles.checkboxChecked,
        pressed && { opacity: 0.6 }, // Визуальный отклик на нажатие
      ]}
    >
      {/* Если выполнено, показываем внутренний белый кружок */}
      {isChecked && <View style={styles.innerCircle} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14, // Идеальный круг
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6, // Внутренний круг
    backgroundColor: '#fff',
  },
});

export default RoundCheckbox;