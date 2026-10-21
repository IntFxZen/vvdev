import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

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
        headerTitleStyle: { fontFamily: monoFont },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Today"
        component={HomeScreen}
        options={{ title: '// TODAY' }}
      />
      <Stack.Screen
        name="AddHabit"
        component={AddHabitScreen}
        options={{ title: '// NEW_HABIT' }}
      />
      <Stack.Screen
        name="HabitDetails"
        component={HabitDetailsScreen}
        options={{ title: '// DETAILS' }}
      />
    </Stack.Navigator>
  );
}