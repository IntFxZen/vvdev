import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitDetailsScreen from './src/screens/HabitDetailsScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Мои привычки' }}
        />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ title: 'Новая привычка' }}
        />
        <Stack.Screen
          name="HabitDetails"
          component={HabitDetailsScreen}
          options={{ title: 'Детали привычки' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;