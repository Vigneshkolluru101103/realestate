import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bankScreen = readFileSync(
  new URL('../src/screens/BankUpiSettings/BankUpiSettingsScreen.jsx', import.meta.url),
  'utf8'
);
const bankCss = readFileSync(
  new URL('../src/screens/BankUpiSettings/BankUpiSettings.css', import.meta.url),
  'utf8'
);
const referScreen = readFileSync(
  new URL('../src/screens/ReferEarn/ReferEarnScreen.jsx', import.meta.url),
  'utf8'
);

describe('Bank & UPI back navigation', () => {
  test('keeps the existing referral-to-settings navigation path', () => {
    assert.match(referScreen, /onNavigate\s*&&\s*onNavigate\('bank-upi'\)/);
  });

  test('provides a shared ghost back button above the settings heading', () => {
    assert.match(bankScreen, /import \{ useNavigate \} from 'react-router-dom';/);
    assert.match(bankScreen, /import \{ ArrowLeft \} from 'lucide-react';/);
    assert.match(bankScreen, /variant="ghost"/);
    assert.match(bankScreen, /<ArrowLeft size=\{16\} aria-hidden="true" \/>/);
    assert.match(bankScreen, /Back to Earn &amp; Refer/);
    assert.ok(
      bankScreen.indexOf('Back to Earn &amp; Refer') < bankScreen.indexOf('zd-settings-header__title'),
      'The back control must appear before the settings heading.'
    );
  });

  test('uses a safe client-side fallback route without replacing browser history', () => {
    assert.match(bankScreen, /onClick=\{\(\) => navigate\('\/broker\/refer'\)\}/);
    assert.doesNotMatch(bankScreen, /navigate\('\/broker\/refer',\s*\{\s*replace:\s*true\s*\}\)/);
  });

  test('keeps the control responsive with visible hover and keyboard focus states', () => {
    assert.match(bankCss, /\.zd-settings-back-btn/);
    assert.match(bankCss, /\.zd-settings-back-btn:hover/);
    assert.match(bankCss, /\.zd-settings-back-btn:focus-visible/);
    assert.match(bankCss, /@media \(max-width: 640px\)/);
  });
});
