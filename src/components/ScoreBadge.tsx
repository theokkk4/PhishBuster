/**
 * ScoreBadge Component
 *
 * Displays the phishing risk score with color-coded styling
 * based on the safety classification with gradient effects.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  score: number;
  label: "Safe" | "Suspicious" | "Likely Phishing";
};

export default function ScoreBadge({ score, label }: Props) {
  // Determine gradient colors based on label
  const getGradientColors = () => {
    switch (label) {
      case "Safe":
        return {
          gradient: ['#10b981', '#059669'],
          shadow: '#10b981',
        };
      case "Suspicious":
        return {
          gradient: ['#f59e0b', '#d97706'],
          shadow: '#f59e0b',
        };
      case "Likely Phishing":
        return {
          gradient: ['#ef4444', '#dc2626'],
          shadow: '#ef4444',
        };
    }
  };

  const colors = getGradientColors();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={colors.gradient}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.scoreText}>
          {score}
        </Text>
        <Text style={styles.scoreLabel}>
          / 100
        </Text>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
          </Text>
        </View>
      </LinearGradient>
      <View style={[styles.glow, { backgroundColor: colors.shadow }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreLabel: {
    fontSize: 18,
    marginTop: -8,
    marginBottom: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  labelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#ffffff',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    opacity: 0.3,
    top: 0,
    left: 0,
    zIndex: -1,
    transform: [{ scale: 1.1 }],
  },
});
