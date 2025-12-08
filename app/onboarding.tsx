/**
 * Onboarding Screen
 *
 * Beautiful welcome screen with smooth animations inspired by premium UI design.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  // Animation values
  const shieldScale = useSharedValue(0);
  const shieldRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    // Orchestrated animation sequence
    // Shield appears with bounce
    shieldScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    shieldRotate.value = withSequence(
      withTiming(10, { duration: 300 }),
      withTiming(-10, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );

    // Title fades in and slides up
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    // Subtitle follows
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(700, withSpring(0, { damping: 15 }));

    // Button appears last
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    buttonScale.value = withDelay(1000, withSpring(1, { damping: 12 }));
  }, []);

  // Animated styles
  const shieldAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: shieldScale.value },
      { rotate: `${shieldRotate.value}deg` },
    ],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const handleGetStarted = () => {
    // Animate out before navigation
    shieldScale.value = withTiming(1.2, { duration: 300 });
    titleOpacity.value = withTiming(0, { duration: 300 });
    subtitleOpacity.value = withTiming(0, { duration: 300 });
    buttonOpacity.value = withTiming(0, { duration: 300 });

    setTimeout(() => {
      router.replace('/home');
    }, 300);
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated Shield Icon */}
      <Animated.View style={[styles.iconContainer, shieldAnimatedStyle]}>
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={styles.shieldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.shieldIcon}>🛡️</Text>
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
        <Text style={styles.title}>PhishBuster</Text>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleUnderline}
        />
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
        <Text style={styles.subtitle}>Your Phishing Defense Shield</Text>
        <Text style={styles.description}>
          Protect yourself from cyber threats with AI-powered phishing detection
        </Text>
      </Animated.View>

      {/* Features */}
      <Animated.View style={[styles.featuresContainer, subtitleAnimatedStyle]}>
        <View style={styles.feature}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Real-time threat detection</Text>
        </View>
        <View style={styles.feature}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>100% privacy - local analysis</Text>
        </View>
        <View style={styles.feature}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Comprehensive risk assessment</Text>
        </View>
      </Animated.View>

      {/* Get Started Button */}
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGetStarted}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF8C00']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 40,
  },
  shieldGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  shieldIcon: {
    fontSize: 70,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 100,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 22,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
});
