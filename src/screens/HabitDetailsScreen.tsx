import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HabitDetailsScreen = ({ route }: any) => {
  const { habitTitle } = route.params || { habitTitle: 'Неизвестно' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История: {habitTitle}</Text>
      <Text style={styles.text}>Здесь будет список дат.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#666' },
});

export default HabitDetailsScreen;