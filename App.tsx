import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
          <HomeScreen />
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;