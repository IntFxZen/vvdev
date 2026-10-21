import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

import HomeScreen from '../screens/HomeScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import HabitDetailsScreen from '../screens/HabitDetailsScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { theme, isDark } = useTheme();
  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

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
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
                  borderColor: subtleBorderColor,
                },
              ]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={[styles.backButtonText, { color: theme.text }]}>← BACK</Text>
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerRight: () => (
            <Text style={[styles.headerRightTitle, { color: theme.text }]}>
              Add Habit
            </Text>
          ),
          headerStyle: { backgroundColor: theme.background },
        })}
      />
      <Stack.Screen
        name="HabitDetails"
        component={HabitDetailsScreen}
        options={{ title: '// DETAILS' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 4,
  },
  backButtonText: {
    fontSize: 12,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  headerRightTitle: {
    fontSize: 18,
    fontFamily: monoFont,
    marginRight: 12,
  },
});