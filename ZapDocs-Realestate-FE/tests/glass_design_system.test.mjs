import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const brokerCss = readFileSync(new URL('../src/broker/brokerPrototype.css', import.meta.url), 'utf8');
const selectCss = readFileSync(new URL('../src/components/common/GlassSelect.css', import.meta.url), 'utf8');
const buttonCss = readFileSync(new URL('../src/components/common/Button/Button.css', import.meta.url), 'utf8');
const bankScreen = readFileSync(new URL('../src/screens/BankUpiSettings/BankUpiSettingsScreen.jsx', import.meta.url), 'utf8');

describe('broker glass design system', () => {
  test('defines the shared surface hierarchy and motion accessibility', () => {
    for (const token of [
      '--zd-surface-nav',
      '--zd-surface-card',
      '--zd-surface-card-soft',
      '--zd-surface-control',
      '--zd-surface-floating',
      '--zd-border-glass',
      '--zd-blur-card',
      '--zd-shadow-card',
      '--zd-focus-ring'
    ]) {
      assert.match(brokerCss, new RegExp(token));
    }
    assert.match(brokerCss, /@media \(prefers-reduced-motion: reduce\)/);
  });

  test('covers every broker page surface with shared styling', () => {
    for (const pageSurface of [
      '.zd-resource-card',
      '.table-container',
      '.client-card',
      '.zd-settings-card',
      '.zd-refer-hero',
      '.zd-callback-card'
    ]) {
      assert.ok(brokerCss.includes(pageSurface), `Missing shared treatment for ${pageSurface}`);
    }
  });

  test('uses the same control tokens for dropdowns, buttons, and bank callouts', () => {
    assert.match(selectCss, /--zd-control-height/);
    assert.match(selectCss, /--zd-surface-floating/);
    assert.match(buttonCss, /--zd-surface-control/);
    assert.match(bankScreen, /className="zd-settings-info-callout"/);
  });
});
