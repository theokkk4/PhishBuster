/**
 * RedFlagList Component
 *
 * Displays a list of detected phishing red flags with descriptions.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RedFlag } from '../types/phishing';

type Props = {
  redFlags: RedFlag[];
};

export default function RedFlagList({ redFlags }: Props) {
  if (redFlags.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>✓</Text>
        <Text style={styles.emptyText}>
          No obvious phishing patterns detected
        </Text>
        <Text style={styles.emptySubtext}>
          This doesn't guarantee the message is safe, but no common red flags were found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {redFlags.map((flag) => (
        <View key={flag.id} style={styles.flagCard}>
          <View style={styles.flagHeader}>
            <Text style={styles.flagIcon}>⚠️</Text>
            <Text style={styles.flagLabel}>{flag.label}</Text>
          </View>
          <Text style={styles.flagDescription}>{flag.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#15803d',
    textAlign: 'center',
  },
  flagCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 16,
    marginBottom: 12,
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  flagLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
    flex: 1,
  },
  flagDescription: {
    fontSize: 14,
    color: '#7f1d1d',
    lineHeight: 20,
  },
});
