/**
 * Root Layout
 *
 * Configures the navigation structure for the app using expo-router with smooth animations.
 */

import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#FFD700',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: '#1a1a1a',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: 'PhishBuster',
          headerShown: true,
          headerBackVisible: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Scan Results',
          headerShown: true,
          animation: 'slide_from_bottom',
          presentation: Platform.OS === 'ios' ? 'card' : 'modal',
        }}
      />
    </Stack>
  );
}
