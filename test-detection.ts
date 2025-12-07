/**
 * Simple test script to verify the phishing detection engine
 * Run with: npx ts-node test-detection.ts
 */

import { analyzeTextForPhishing } from './src/detection/phishingEngine';

console.log('🛡️  PhishBuster Detection Engine Test\n');
console.log('='.repeat(60));

// Test 1: High Risk Phishing Email
console.log('\n📧 Test 1: HIGH RISK phishing attempt');
console.log('-'.repeat(60));
const phishingEmail = `
URGENT: Your PayPal account will be suspended immediately!
Click here to verify your login and password: http://192.168.1.1/paypal
Act now or lose access!!!
`;
const result1 = analyzeTextForPhishing(phishingEmail);
console.log(`Score: ${result1.score}/100`);
console.log(`Label: ${result1.label}`);
console.log(`Red Flags Found: ${result1.redFlags.length}`);
result1.redFlags.forEach(flag => {
  console.log(`  ⚠️  ${flag.label} (weight: ${flag.weight})`);
});

// Test 2: Suspicious Email
console.log('\n📧 Test 2: SUSPICIOUS email');
console.log('-'.repeat(60));
const suspiciousEmail = `
Your Amazon order #12345 has been delayed.
Please confirm your shipping address: https://amzn.tk/verify
`;
const result2 = analyzeTextForPhishing(suspiciousEmail);
console.log(`Score: ${result2.score}/100`);
console.log(`Label: ${result2.label}`);
console.log(`Red Flags Found: ${result2.redFlags.length}`);
result2.redFlags.forEach(flag => {
  console.log(`  ⚠️  ${flag.label} (weight: ${flag.weight})`);
});

// Test 3: Safe Message
console.log('\n📧 Test 3: SAFE message');
console.log('-'.repeat(60));
const safeMessage = `
Hey, just wanted to let you know the meeting has been moved to 3pm tomorrow.
Let me know if that works for you!
`;
const result3 = analyzeTextForPhishing(safeMessage);
console.log(`Score: ${result3.score}/100`);
console.log(`Label: ${result3.label}`);
console.log(`Red Flags Found: ${result3.redFlags.length}`);
if (result3.redFlags.length > 0) {
  result3.redFlags.forEach(flag => {
    console.log(`  ⚠️  ${flag.label} (weight: ${flag.weight})`);
  });
} else {
  console.log(`  ✅ No red flags detected!`);
}

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed!\n');
