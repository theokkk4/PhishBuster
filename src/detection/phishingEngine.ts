/**
 * PhishBuster Detection Engine
 *
 * This module implements a rule-based phishing detection system.
 * It analyzes text messages for common phishing indicators using
 * pattern matching, keyword detection, and URL analysis.
 *
 * @author PhishBuster
 * @version 1.0.0
 */

import { RedFlag, PhishingResult } from '../types/phishing';
import {
  normalizeText,
  extractUrls,
  countAllCapsWords,
  countExclamationMarks,
} from '../utils/textCleaning';

/**
 * Main phishing analysis function
 * Analyzes text and returns a comprehensive phishing risk assessment
 *
 * @param rawText - The raw text to analyze (email body, message, etc.)
 * @returns PhishingResult containing score, label, and detected red flags
 */
export function analyzeTextForPhishing(rawText: string): PhishingResult {
  const normalizedText = normalizeText(rawText);
  const redFlags: RedFlag[] = [];

  // Run all detection rules
  redFlags.push(...checkUrgencyLanguage(normalizedText, rawText));
  redFlags.push(...checkBrandImpersonation(normalizedText));
  redFlags.push(...checkCredentialHarvesting(normalizedText));
  redFlags.push(...checkSuspiciousLinks(rawText)); // Use raw text to preserve URLs
  redFlags.push(...checkAggressiveFormatting(rawText));

  // Calculate total score by summing all red flag weights
  const totalScore = redFlags.reduce((sum, flag) => sum + flag.weight, 0);

  // Cap score at 100
  const score = Math.min(totalScore, 100);

  // Determine label based on score thresholds
  let label: "Safe" | "Suspicious" | "Likely Phishing";
  if (score < 30) {
    label = "Safe";
  } else if (score < 70) {
    label = "Suspicious";
  } else {
    label = "Likely Phishing";
  }

  return {
    score,
    label,
    redFlags,
  };
}

/**
 * RULE 1: Urgency and Threat Language Detection
 *
 * Phishing attacks often create a sense of urgency to pressure victims
 * into acting without thinking. This rule detects common urgency phrases.
 */
function checkUrgencyLanguage(normalizedText: string, rawText: string): RedFlag[] {
  const urgencyPhrases = [
    { phrase: 'urgent', weight: 15 },
    { phrase: 'immediately', weight: 15 },
    { phrase: 'act now', weight: 20 },
    { phrase: 'final notice', weight: 25 },
    { phrase: 'verify your account', weight: 20 },
    { phrase: 'your account will be closed', weight: 25 },
    { phrase: 'account will be suspended', weight: 25 },
    { phrase: 'suspended', weight: 15 },
    { phrase: 'expire', weight: 12 },
    { phrase: 'limited time', weight: 15 },
    { phrase: 'confirm your identity', weight: 18 },
    { phrase: 'unusual activity', weight: 18 },
  ];

  const flags: RedFlag[] = [];
  const foundPhrases: string[] = [];

  for (const { phrase, weight } of urgencyPhrases) {
    if (normalizedText.includes(phrase)) {
      foundPhrases.push(phrase);
    }
  }

  // If we found urgency language, create a single red flag
  if (foundPhrases.length > 0) {
    // Use the highest weight, plus a bonus for multiple urgency phrases
    const maxWeight = Math.max(...urgencyPhrases
      .filter(p => foundPhrases.includes(p.phrase))
      .map(p => p.weight));

    const bonus = Math.min((foundPhrases.length - 1) * 5, 15);

    flags.push({
      id: 'urgency-language',
      label: 'Urgent or Threatening Language',
      description: `Contains urgency keywords like "${foundPhrases[0]}"${foundPhrases.length > 1 ? ' and others' : ''}. Legitimate companies rarely pressure you to act immediately.`,
      weight: maxWeight + bonus,
    });
  }

  return flags;
}

/**
 * RULE 2: Brand Impersonation Detection
 *
 * Phishers often impersonate well-known brands to gain trust.
 * This rule detects mentions of commonly impersonated organizations.
 */
function checkBrandImpersonation(normalizedText: string): RedFlag[] {
  const flags: RedFlag[] = [];

  // Financial institutions and payment services
  const financialBrands = [
    'bank', 'paypal', 'venmo', 'cash app', 'coinbase', 'binance',
    'chase', 'wells fargo', 'bank of america', 'citi', 'capital one',
    'stripe', 'square', 'zelle',
  ];

  // Tech companies
  const techBrands = [
    'apple', 'apple id', 'icloud', 'google', 'microsoft', 'amazon',
    'facebook', 'meta', 'netflix', 'spotify',
  ];

  // Government/official entities
  const governmentEntities = [
    'irs', 'social security', 'ssa', 'usps', 'fedex', 'ups', 'dhl',
    'customs', 'immigration', 'dmv',
  ];

  const foundFinancial = financialBrands.some(brand => normalizedText.includes(brand));
  const foundTech = techBrands.some(brand => normalizedText.includes(brand));
  const foundGovernment = governmentEntities.some(brand => normalizedText.includes(brand));

  if (foundFinancial) {
    flags.push({
      id: 'financial-impersonation',
      label: 'Financial Institution Mentioned',
      description: 'References a bank or payment service. Verify the sender carefully—phishers often impersonate financial institutions to steal credentials.',
      weight: 20,
    });
  }

  if (foundTech) {
    flags.push({
      id: 'tech-impersonation',
      label: 'Tech Company Mentioned',
      description: 'References a major tech company. Always verify by going directly to the official website rather than clicking links.',
      weight: 18,
    });
  }

  if (foundGovernment) {
    flags.push({
      id: 'government-impersonation',
      label: 'Government Entity Mentioned',
      description: 'References a government agency. Note that government agencies typically communicate through official mail, not unsolicited emails.',
      weight: 22,
    });
  }

  return flags;
}

/**
 * RULE 3: Credential and Secret Harvesting Detection
 *
 * Legitimate organizations never ask for passwords or sensitive codes via email.
 * This rule detects requests for credentials or secrets.
 */
function checkCredentialHarvesting(normalizedText: string): RedFlag[] {
  const flags: RedFlag[] = [];

  const credentialKeywords = [
    'password', 'log in', 'login', 'sign in', 'signin',
    'security code', 'verification code', 'one-time code',
    'otp', 'pin', 'ssn', 'social security number',
    'account number', 'credit card', 'cvv', 'routing number',
  ];

  const actionWords = [
    'enter', 'provide', 'verify', 'confirm', 'update', 'submit',
    'validate', 'reset',
  ];

  const foundCredentials: string[] = [];
  const foundActions: string[] = [];

  for (const keyword of credentialKeywords) {
    if (normalizedText.includes(keyword)) {
      foundCredentials.push(keyword);
    }
  }

  for (const action of actionWords) {
    if (normalizedText.includes(action)) {
      foundActions.push(action);
    }
  }

  // Strong red flag if the message asks for credentials
  if (foundCredentials.length > 0) {
    const hasAction = foundActions.length > 0;
    const weight = hasAction ? 30 : 22;

    flags.push({
      id: 'credential-harvesting',
      label: 'Requests Login or Secret Information',
      description: `Mentions sensitive terms like "${foundCredentials[0]}"${hasAction ? ' and asks you to ' + foundActions[0] : ''}. Legitimate companies NEVER ask for passwords or security codes via email.`,
      weight,
    });
  }

  return flags;
}

/**
 * RULE 4: Suspicious Link Detection
 *
 * Analyzes URLs in the message for common phishing indicators:
 * - IP address URLs
 * - Suspicious top-level domains (TLDs)
 * - Excessive number of links
 */
function checkSuspiciousLinks(rawText: string): RedFlag[] {
  const flags: RedFlag[] = [];
  const urls = extractUrls(rawText);

  // Check for multiple links
  if (urls.length >= 3) {
    flags.push({
      id: 'multiple-links',
      label: 'Multiple Links Detected',
      description: `Contains ${urls.length} links. Phishing emails often include multiple links to increase the chance you'll click one.`,
      weight: 15,
    });
  }

  // Check for IP-based URLs (e.g., http://192.168.1.1)
  const ipUrlRegex = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;
  const hasIpUrl = urls.some(url => ipUrlRegex.test(url));

  if (hasIpUrl) {
    flags.push({
      id: 'ip-based-url',
      label: 'IP Address URL Detected',
      description: 'Contains a link with an IP address instead of a domain name. This is highly suspicious—legitimate sites use domain names.',
      weight: 35,
    });
  }

  // Check for suspicious TLDs
  const suspiciousTlds = ['.ru', '.cn', '.tk', '.ml', '.top', '.xyz', '.gq', '.cf', '.ga'];
  const foundSuspiciousTlds: string[] = [];

  for (const url of urls) {
    for (const tld of suspiciousTlds) {
      if (url.toLowerCase().includes(tld)) {
        if (!foundSuspiciousTlds.includes(tld)) {
          foundSuspiciousTlds.push(tld);
        }
      }
    }
  }

  if (foundSuspiciousTlds.length > 0) {
    flags.push({
      id: 'suspicious-tld',
      label: 'Suspicious Domain Extension',
      description: `Contains links with suspicious domain extensions (${foundSuspiciousTlds.join(', ')}). These TLDs are commonly used for phishing.`,
      weight: 25,
    });
  }

  // Check for URL shorteners (common in phishing to hide real destination)
  const shortenerDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link'];
  const hasShortener = urls.some(url =>
    shortenerDomains.some(shortener => url.toLowerCase().includes(shortener))
  );

  if (hasShortener) {
    flags.push({
      id: 'url-shortener',
      label: 'URL Shortener Detected',
      description: 'Contains shortened URLs that hide the real destination. Proceed with extreme caution.',
      weight: 20,
    });
  }

  return flags;
}

/**
 * RULE 5: Aggressive Formatting Detection
 *
 * Detects spammy/aggressive formatting like excessive ALL CAPS or
 * multiple exclamation marks, which are common in phishing emails.
 */
function checkAggressiveFormatting(rawText: string): RedFlag[] {
  const flags: RedFlag[] = [];

  const capsWords = countAllCapsWords(rawText);
  const exclamations = countExclamationMarks(rawText);

  // Check for excessive ALL CAPS
  if (capsWords >= 5) {
    flags.push({
      id: 'excessive-caps',
      label: 'Excessive ALL CAPS',
      description: `Contains ${capsWords} words in ALL CAPS. This aggressive formatting is common in spam and phishing attempts.`,
      weight: 10,
    });
  }

  // Check for excessive exclamation marks
  if (exclamations >= 3) {
    flags.push({
      id: 'excessive-exclamation',
      label: 'Excessive Exclamation Marks',
      description: `Contains ${exclamations} exclamation marks. Over-the-top punctuation is a sign of spam or phishing.`,
      weight: 8,
    });
  }

  return flags;
}
