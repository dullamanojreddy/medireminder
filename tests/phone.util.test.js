/**
 * Unit Tests for Phone Number Normalization Utility
 * 
 * Run with: node backend/src/utils/phone.util.test.js
 */

import { sanitizePhone, isValidE164, normalizePhone, validateAndNormalize } from "./phone.util.js";

const tests = [];
let passed = 0;
let failed = 0;

/**
 * Test helper function
 */
function test(description, fn) {
  tests.push({ description, fn });
}

/**
 * Assert helper
 */
function assertEqual(actual, expected, message = "") {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

function assertTrue(value, message = "") {
  if (!value) {
    throw new Error(`${message}\n  Expected truthy value, got: ${value}`);
  }
}

function assertFalse(value, message = "") {
  if (value) {
    throw new Error(`${message}\n  Expected falsy value, got: ${value}`);
  }
}

function assertThrows(fn, message = "") {
  try {
    fn();
    throw new Error(`${message}\n  Expected function to throw error`);
  } catch (error) {
    if (error.message.includes("Expected function to throw")) {
      throw error;
    }
    // Expected error was thrown
  }
}

// ============================================
// TEST CASES
// ============================================

// sanitizePhone tests
test("sanitizePhone: removes all non-digit characters", () => {
  assertEqual(sanitizePhone("+91-9966-0078-04"), "919966007804");
  assertEqual(sanitizePhone("(996) 600-7804"), "9966007804");
  assertEqual(sanitizePhone(" 9966007804 "), "9966007804");
});

test("sanitizePhone: handles empty/null input", () => {
  assertEqual(sanitizePhone(""), "");
  assertEqual(sanitizePhone(null), "");
  assertEqual(sanitizePhone(undefined), "");
  assertEqual(sanitizePhone(123), "");
});

// isValidE164 tests
test("isValidE164: validates correct E.164 numbers", () => {
  assertTrue(isValidE164("+919966007804"));
  assertTrue(isValidE164("+14155238886"));
  assertTrue(isValidE164("+442071234567"));
});

test("isValidE164: rejects invalid formats", () => {
  assertFalse(isValidE164("9966007804"));
  assertFalse(isValidE164("+91"));
  assertFalse(isValidE164("+9123"));
  assertFalse(isValidE164(""));
  assertFalse(isValidE164(null));
});

// normalizePhone tests
test("normalizePhone: converts 10-digit Indian numbers to E.164", () => {
  assertEqual(normalizePhone("9966007804"), "+919966007804");
  assertEqual(normalizePhone(" 9966007804 "), "+919966007804");
  assertEqual(normalizePhone("9876543210"), "+919876543210");
});

test("normalizePhone: handles numbers with formatting", () => {
  assertEqual(normalizePhone("+91-9966-0078-04"), "+919966007804");
  assertEqual(normalizePhone("(996) 600-7804"), "+919966007804");
  assertEqual(normalizePhone("+91 9966 0078 04"), "+919966007804");
});

test("normalizePhone: leaves already normalized numbers unchanged", () => {
  assertEqual(normalizePhone("+919966007804"), "+919966007804");
  assertEqual(normalizePhone("+14155238886"), "+14155238886");
});

test("normalizePhone: handles numbers starting with 0", () => {
  assertEqual(normalizePhone("09960007804"), "+919960007804");
  assertEqual(normalizePhone("0 9966007804"), "+919966007804");
});

test("normalizePhone: handles 12-digit Indian numbers without +", () => {
  assertEqual(normalizePhone("919966007804"), "+919966007804");
});

test("normalizePhone: handles international numbers", () => {
  assertEqual(normalizePhone("14155238886"), "+14155238886");
  assertEqual(normalizePhone("+442071234567"), "+442071234567");
});

test("normalizePhone: handles edge cases", () => {
  assertEqual(normalizePhone(""), "");
  assertEqual(normalizePhone(null), "");
  assertEqual(normalizePhone(undefined), "");
  assertEqual(normalizePhone("   "), "");
});

test("normalizePhone: prevents duplicate normalization", () => {
  const once = normalizePhone("9966007804");
  const twice = normalizePhone(once);
  assertEqual(once, twice, "Normalizing twice should produce same result");
});

// validateAndNormalize tests
test("validateAndNormalize: normalizes valid numbers", () => {
  assertEqual(validateAndNormalize("9966007804"), "+919966007804");
  assertEqual(validateAndNormalize("+919966007804"), "+919966007804");
});

test("validateAndNormalize: throws error for invalid numbers", () => {
  assertThrows(() => validateAndNormalize(""), "Empty string should throw");
  assertThrows(() => validateAndNormalize("123"), "Too short should throw");
  assertThrows(() => validateAndNormalize(null), "Null should throw");
});

// ============================================
// RUN TESTS
// ============================================

console.log("Running Phone Normalization Tests...\n");
console.log("=".repeat(60));

for (const { description, fn } of tests) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   ${error.message}\n`);
    failed++;
  }
}

console.log("=".repeat(60));
console.log(`\nTest Results: ${passed} passed, ${failed} failed, ${tests.length} total`);

if (failed > 0) {
  console.log("\n❌ Some tests failed!");
  process.exit(1);
} else {
  console.log("\n✅ All tests passed!");
  process.exit(0);
}