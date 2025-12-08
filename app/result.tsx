/**
 * Result Screen
 *
 * Displays the phishing analysis results including score, label,
 * red flags, and recommended actions with smooth animations.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import ScoreBadge from '../src/components/ScoreBadge';
import RedFlagList from '../src/components/RedFlagList';
import { RedFlag } from '../src/types/phishing';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const params = useLocalSearchParams();

  // Parse parameters
  const score = parseInt(params.score as string, 10);
  const label = params.label as "Safe" | "Suspicious" | "Likely Phishing";
  const redFlags: RedFlag[] = JSON.parse(params.redFlags as string);

  // Animation values
  const scoreScale = useSharedValue(0);
  const scoreRotate = useSharedValue(360);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    // Animate score badge with pulse
    scoreScale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 12 })
    );
    scoreRotate.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Fade in content
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    // Button appears
    buttonScale.value = withDelay(800, withSpring(1, { damping: 12 }));
  }, []);

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scoreScale.value },
      { rotate: `${scoreRotate.value}deg` },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

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
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Animated Score Badge */}
        <Animated.View style={[styles.scoreSection, scoreAnimatedStyle]}>
          <ScoreBadge score={score} label={label} />
        </Animated.View>

        {/* Animated Content */}
        <Animated.View style={contentAnimatedStyle}>
          {/* Explanation */}
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 165, 0, 0.05)']}
            style={styles.explanationSection}
          >
            <Text style={styles.explanationText}>{getExplanation()}</Text>
          </LinearGradient>

          {/* Red Flags */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🚩</Text>
              <Text style={styles.sectionTitle}>Detected Red Flags</Text>
            </View>
            <View style={styles.card}>
              <RedFlagList redFlags={redFlags} />
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✅</Text>
              <Text style={styles.sectionTitle}>What You Should Do</Text>
            </View>
            <View style={styles.card}>
              {getRecommendations().map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.bulletGradient}
                  >
                    <View style={styles.bullet} />
                  </LinearGradient>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* General Safety Tip */}
          <View style={styles.tipSection}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>Pro Tip</Text>
            </View>
            <Text style={styles.tipText}>
              When in doubt, always navigate directly to the official website by typing
              the URL yourself rather than clicking links. Contact customer support
              through verified channels if you're unsure about a message.
            </Text>
          </View>
        </Animated.View>

        {/* Animated Button */}
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleAnalyzeAnother}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF8C00']}
              style={styles.analyzeAnotherButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.analyzeAnotherText}>Analyze Another Message</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  explanationSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  explanationText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
  recommendationText: {
    fontSize: 15,
    color: '#CCCCCC',
    flex: 1,
    lineHeight: 22,
  },
  tipSection: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tipText: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
  },
  analyzeAnotherButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  analyzeAnotherText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
