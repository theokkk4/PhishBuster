/**
 * PhishBuster Type Definitions
 *
 * These types define the structure of our phishing detection results.
 */

/**
 * Represents a single red flag detected in the analyzed text
 */
export type RedFlag = {
  /** Unique identifier for this red flag */
  id: string;
  /** Short label describing the red flag */
  label: string;
  /** Detailed explanation of why this is suspicious */
  description: string;
  /** Weight/severity of this red flag (contributes to total score) */
  weight: number;
};

/**
 * The complete result of phishing analysis
 */
export type PhishingResult = {
  /** Overall phishing risk score from 0-100 */
  score: number;
  /** Human-readable safety classification */
  label: "Safe" | "Suspicious" | "Likely Phishing";
  /** List of all red flags detected in the text */
  redFlags: RedFlag[];
};
