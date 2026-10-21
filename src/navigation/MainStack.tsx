import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import HabitDetailsScreen from '../screens/HabitDetailsScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false, // Убираем тень под шапкой
      }}
    >
      <Stack.Screen name="Today" component={HomeScreen} options={{ title: '// TODAY' }} />
      <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ title: '// NEW_HABIT' }} />
      <Stack.Screen name="HabitDetails" component={HabitDetailsScreen} options={{ title: '// DETAILS' }} />
    </Stack.Navigator>
  );
}