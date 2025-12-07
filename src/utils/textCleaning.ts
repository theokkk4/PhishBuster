/**
 * Text Cleaning and Normalization Utilities
 *
 * These functions prepare text for phishing analysis by normalizing
 * whitespace, case, and other formatting variations.
 */

/**
 * Normalizes text for consistent analysis
 * - Converts to lowercase for case-insensitive matching
 * - Normalizes whitespace (replaces multiple spaces/newlines with single space)
 * - Trims leading/trailing whitespace
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts URLs from text using regex
 * Matches http:// and https:// URLs
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  return text.match(urlRegex) || [];
}

/**
 * Counts the number of words in ALL CAPS
 * (Useful for detecting aggressive/spammy formatting)
 */
export function countAllCapsWords(text: string): number {
  // Split by whitespace and filter words that are:
  // - At least 2 characters long
  // - Completely uppercase
  // - Not just numbers or special characters
  const words = text.split(/\s+/);
  return words.filter(word => {
    return word.length >= 2 &&
           word === word.toUpperCase() &&
           /[A-Z]/.test(word);
  }).length;
}

/**
 * Counts the number of exclamation marks in text
 */
export function countExclamationMarks(text: string): number {
  return (text.match(/!/g) || []).length;
}
