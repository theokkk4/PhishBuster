/**
 * Home Screen
 *
 * Main entry point where users can paste/type suspicious messages
 * for phishing analysis.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { analyzeTextForPhishing } from '../src/detection/phishingEngine';

export default function HomeScreen() {
  const [messageText, setMessageText] = useState('');
  const [showError, setShowError] = useState(false);

  const handleAnalyze = () => {
    // Validate input
    if (messageText.trim().length === 0) {
      setShowError(true);
      return;
    }

    setShowError(false);

    // Run phishing analysis
    const result = analyzeTextForPhishing(messageText);

    // Navigate to result screen with the analysis
    router.push({
      pathname: '/result',
      params: {
        score: result.score.toString(),
        label: result.label,
        redFlags: JSON.stringify(result.redFlags),
        originalText: messageText,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🛡️ PhishBuster</Text>
          <Text style={styles.subtitle}>
            Analyze messages for phishing red flags
          </Text>
        </View>

        {/* Main Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Paste or type the suspicious message:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={10}
            placeholder="Example:&#10;&#10;URGENT: Your PayPal account will be suspended! Click here immediately to verify your login credentials..."
            placeholderTextColor="#9ca3af"
            value={messageText}
            onChangeText={(text) => {
              setMessageText(text);
              if (showError && text.trim().length > 0) {
                setShowError(false);
              }
            }}
            textAlignVertical="top"
          />

          {showError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                ⚠️ Please enter some text to analyze
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.analyzeButton,
              messageText.trim().length === 0 && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={messageText.trim().length === 0}
          >
            <Text style={styles.analyzeButtonText}>Analyze Message</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • PhishBuster uses rule-based detection to scan for common phishing patterns
          </Text>
          <Text style={styles.infoText}>
            • All analysis happens locally on your device
          </Text>
          <Text style={styles.infoText}>
            • Your messages are never sent to external servers
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 200,
    color: '#1f2937',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
  analyzeButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginBottom: 6,
    lineHeight: 20,
  },
});
