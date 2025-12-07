/**
 * Result Screen
 *
 * Displays the phishing analysis results including score, label,
 * red flags, and recommended actions.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import ScoreBadge from '../src/components/ScoreBadge';
import RedFlagList from '../src/components/RedFlagList';
import { RedFlag } from '../src/types/phishing';

export default function ResultScreen() {
  const params = useLocalSearchParams();

  // Parse parameters
  const score = parseInt(params.score as string, 10);
  const label = params.label as "Safe" | "Suspicious" | "Likely Phishing";
  const redFlags: RedFlag[] = JSON.parse(params.redFlags as string);

  // Get explanation text based on label
  const getExplanation = () => {
    switch (label) {
      case "Safe":
        return "We did not detect common phishing patterns, but still use caution.";
      case "Suspicious":
        return "Some phishing-like patterns were detected. Be careful.";
      case "Likely Phishing":
        return "Multiple strong phishing indicators detected. Do NOT click links or share info.";
    }
  };

  // Get recommended actions based on label
  const getRecommendations = () => {
    switch (label) {
      case "Safe":
        return [
          "Always verify the sender's email address carefully",
          "Never share passwords or sensitive codes via email",
          "When in doubt, contact the organization directly through official channels",
          "Be cautious of unexpected messages, even if they seem legitimate",
        ];
      case "Suspicious":
        return [
          "Do NOT click any links in this message",
          "Verify the sender by contacting them through official channels",
          "Look for subtle misspellings in email addresses or domain names",
          "Never provide personal information or credentials",
          "Report this message to your email provider or IT department",
        ];
      case "Likely Phishing":
        return [
          "DELETE this message immediately",
          "Do NOT click any links or download attachments",
          "NEVER enter login credentials or personal information",
          "Report this to your email provider as phishing/spam",
          "If it claims to be from a company you use, contact them directly using official contact info from their website",
          "Warn others who may have received the same message",
        ];
    }
  };

  const handleAnalyzeAnother = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Score Badge */}
      <View style={styles.scoreSection}>
        <ScoreBadge score={score} label={label} />
      </View>

      {/* Explanation */}
      <View style={styles.explanationSection}>
        <Text style={styles.explanationText}>{getExplanation()}</Text>
      </View>

      {/* Red Flags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detected Red Flags</Text>
        <RedFlagList redFlags={redFlags} />
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You Should Do</Text>
        <View style={styles.recommendationsContainer}>
          {getRecommendations().map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* General Safety Tip */}
      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>💡 Pro Tip</Text>
        <Text style={styles.tipText}>
          When in doubt, always navigate directly to the official website by typing
          the URL yourself rather than clicking links. Contact customer support
          through verified channels if you're unsure about a message.
        </Text>
      </View>

      {/* Analyze Another Button */}
      <TouchableOpacity
        style={styles.analyzeAnotherButton}
        onPress={handleAnalyzeAnother}
      >
        <Text style={styles.analyzeAnotherText}>Analyze Another Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  explanationSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  explanationText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  recommendationsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#374151',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  tipSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  analyzeAnotherButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  analyzeAnotherText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
