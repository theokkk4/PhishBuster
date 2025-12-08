/**
 * Home Screen
 *
 * Main entry point where users can paste/type suspicious messages
 * for phishing analysis with smooth animations.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  SlideInDown,
  SlideInUp,
} from 'react-native-reanimated';
import { analyzeTextForPhishing } from '../src/detection/phishingEngine';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [messageText, setMessageText] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Animation values
  const headerScale = useSharedValue(0.9);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    headerScale.value = withSpring(1, { damping: 15 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const handleAnalyze = () => {
    // Validate input
    if (messageText.trim().length === 0) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsAnalyzing(true);

    // Animate button press
    cardScale.value = withTiming(0.95, { duration: 100 });

    // Run phishing analysis
    setTimeout(() => {
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

      setIsAnalyzing(false);
      cardScale.value = withSpring(1);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            style={[styles.header, headerAnimatedStyle]}
            entering={FadeIn.duration(600)}
          >
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Hi Alex,</Text>
              <Text style={styles.welcomeText}>Welcome Back</Text>
            </View>
            <View style={styles.statusBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.statusGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.statusIcon}>🛡️</Text>
                <Text style={styles.statusText}>Protection Active</Text>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Main Input Card */}
          <Animated.View
            style={styles.cardContainer}
            entering={SlideInUp.delay(200).springify()}
          >
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 165, 0, 0.05)']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Scan Message</Text>
              <Text style={styles.cardSubtitle}>
                Paste suspicious content below for analysis
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={8}
                  placeholder="Example:&#10;&#10;URGENT: Your account will be suspended!&#10;Click here to verify..."
                  placeholderTextColor="#666666"
                  value={messageText}
                  onChangeText={(text) => {
                    setMessageText(text);
                    if (showError && text.trim().length > 0) {
                      setShowError(false);
                    }
                  }}
                  textAlignVertical="top"
                />
              </View>

              {showError && (
                <Animated.View
                  style={styles.errorContainer}
                  entering={SlideInDown.springify()}
                >
                  <Text style={styles.errorText}>
                    ⚠️ Please enter text to analyze
                  </Text>
                </Animated.View>
              )}

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleAnalyze}
                disabled={messageText.trim().length === 0 || isAnalyzing}
              >
                <LinearGradient
                  colors={
                    messageText.trim().length === 0 || isAnalyzing
                      ? ['#555555', '#444444']
                      : ['#FFD700', '#FFA500', '#FF8C00']
                  }
                  style={styles.analyzeButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.analyzeButtonText}>
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* Info Section */}
          <Animated.View
            style={styles.infoSection}
            entering={FadeIn.delay(400).duration(600)}
          >
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>🔒</Text>
                <Text style={styles.infoTitle}>Your Privacy Matters</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoDot} />
                <Text style={styles.infoText}>All analysis happens on your device</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoDot} />
                <Text style={styles.infoText}>No data sent to external servers</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoDot} />
                <Text style={styles.infoText}>Instant, real-time protection</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  headerContent: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    minHeight: 160,
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  analyzeButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
});
