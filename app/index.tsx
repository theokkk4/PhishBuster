/**
 * Index Screen
 *
 * Entry point that redirects to onboarding screen.
 */

import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  useEffect(() => {
    // Redirect to onboarding after a brief moment
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFD700" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
