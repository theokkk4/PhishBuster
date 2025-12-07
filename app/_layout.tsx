/**
 * Root Layout
 *
 * Configures the navigation structure for the app using expo-router.
 */

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'PhishBuster',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Analysis Results',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
