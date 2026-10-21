import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitDetailsScreen from './src/screens/HabitDetailsScreen';
import { ThemeProvider } from './src/theme/ThemeContext'; // <--- Импорт

const Stack = createNativeStackNavigator();

function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Мои привычки' }} />
          <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ title: 'Новая привычка' }} />
          <Stack.Screen name="HabitDetails" component={HabitDetailsScreen} options={{ title: 'Детали' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;