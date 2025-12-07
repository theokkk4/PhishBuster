/**
 * ScoreBadge Component
 *
 * Displays the phishing risk score with color-coded styling
 * based on the safety classification.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  score: number;
  label: "Safe" | "Suspicious" | "Likely Phishing";
};

export default function ScoreBadge({ score, label }: Props) {
  // Determine colors based on label
  const getColors = () => {
    switch (label) {
      case "Safe":
        return {
          background: '#10b981', // green
          border: '#059669',
          text: '#ffffff',
        };
      case "Suspicious":
        return {
          background: '#f59e0b', // orange
          border: '#d97706',
          text: '#ffffff',
        };
      case "Likely Phishing":
        return {
          background: '#ef4444', // red
          border: '#dc2626',
          text: '#ffffff',
        };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
      borderColor: colors.border,
    }]}>
      <Text style={[styles.scoreText, { color: colors.text }]}>
        {score}
      </Text>
      <Text style={[styles.scoreLabel, { color: colors.text }]}>
        / 100
      </Text>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 18,
    marginTop: -8,
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
