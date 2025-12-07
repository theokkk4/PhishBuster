# 🛡️ PhishBuster

A React Native mobile app that helps users identify phishing attempts in emails and messages using rule-based detection.

## Overview

PhishBuster analyzes text messages for common phishing indicators using a custom-built, rule-based detection engine. All analysis happens locally on the device with no external API calls or data transmission.

## Features

- **Rule-Based Detection**: Analyzes messages using 5 categories of phishing indicators:
  - Urgency and threat language
  - Brand impersonation (financial, tech, government)
  - Credential harvesting attempts
  - Suspicious links (IP addresses, suspicious TLDs, URL shorteners)
  - Aggressive formatting (excessive CAPS, exclamation marks)

- **Scoring System**: Provides a 0-100 risk score with three classifications:
  - Safe (0-29): No major red flags detected
  - Suspicious (30-69): Some phishing patterns found
  - Likely Phishing (70-100): Multiple strong indicators

- **Educational**: Detailed explanations for each red flag and actionable security recommendations

- **Privacy-Focused**: All processing happens locally—no data leaves your device

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **expo-router** for navigation
- Custom phishing detection engine (no external APIs)

## Project Structure

```
PhishBuster/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Navigation configuration
│   ├── index.tsx            # Home screen (input)
│   └── result.tsx           # Results screen
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ScoreBadge.tsx   # Score display with color coding
│   │   └── RedFlagList.tsx  # List of detected red flags
│   ├── detection/           # Phishing detection logic
│   │   └── phishingEngine.ts # Main detection engine
│   ├── types/               # TypeScript type definitions
│   │   └── phishing.ts
│   └── utils/               # Helper functions
│       └── textCleaning.ts  # Text normalization utilities
├── package.json
├── tsconfig.json
└── app.json
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI

### Steps

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device or emulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your physical device

## How to Use

1. **Launch the app** and you'll see the home screen
2. **Paste or type** a suspicious email or message into the text input
3. **Tap "Analyze Message"** to run the detection engine
4. **Review the results:**
   - See the phishing risk score (0-100)
   - Read detected red flags with explanations
   - Follow the recommended actions based on the risk level
5. **Tap "Analyze Another Message"** to return to the home screen

## Detection Engine Details

The phishing detection engine (`src/detection/phishingEngine.ts`) implements five rule categories:

### 1. Urgency/Threat Language (15-25 points)
Detects pressure tactics like "urgent", "act now", "account will be suspended"

### 2. Brand Impersonation (18-22 points)
Identifies mentions of commonly impersonated brands:
- Financial: PayPal, banks, crypto exchanges
- Tech: Apple, Google, Amazon, Netflix
- Government: IRS, Social Security, USPS

### 3. Credential Harvesting (22-30 points)
Flags requests for passwords, login codes, PINs, or other secrets

### 4. Suspicious Links (15-35 points)
Analyzes URLs for:
- IP-based addresses (e.g., `http://192.168.1.1`)
- Suspicious TLDs (`.ru`, `.tk`, `.xyz`, etc.)
- URL shorteners (bit.ly, tinyurl, etc.)
- Multiple links in one message

### 5. Aggressive Formatting (8-10 points)
Detects spam-like formatting (excessive CAPS, multiple exclamation marks)

## Example Test Messages

Try these examples to see PhishBuster in action:

### Likely Phishing (High Score)
```
URGENT: Your PayPal account will be suspended immediately!
Click here to verify your login and password: http://192.168.1.1/paypal
Act now or lose access!!!
```

### Suspicious (Medium Score)
```
Your Amazon order #12345 has been delayed.
Please confirm your shipping address: https://amzn.tk/verify
```

### Safe (Low Score)
```
Hey, just wanted to let you know the meeting has been moved to 3pm tomorrow.
Let me know if that works for you!
```

## Future Enhancements (Potential V2 Features)

- OCR capability to analyze screenshots of emails
- AI-powered detection using local LLMs
- History of analyzed messages
- Export/share analysis results
- Additional language support
- Custom rule configuration

## License

This is a personal project created for educational purposes.

## Author

Built as a cybersecurity portfolio project to demonstrate practical application of phishing detection techniques.
