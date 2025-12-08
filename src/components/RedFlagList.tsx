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
      {redFlags.map((flag, index) => (
        <View key={flag.id} style={[styles.flagCard, index !== redFlags.length - 1 && styles.flagCardMargin]}>
          <View style={styles.flagHeader}>
            <View style={styles.flagIconContainer}>
              <Text style={styles.flagIcon}>⚠️</Text>
            </View>
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  flagCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 16,
  },
  flagCardMargin: {
    marginBottom: 12,
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  flagIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagIcon: {
    fontSize: 18,
  },
  flagLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    flex: 1,
  },
  flagDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginLeft: 44,
  },
});
