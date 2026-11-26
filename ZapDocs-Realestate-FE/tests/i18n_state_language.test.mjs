import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVAILABLE_LANGUAGES,
  STATE_TO_LANGUAGE_MAP,
  getLanguageForState,
  UI_TRANSLATIONS,
  FAQ_TRANSLATIONS
} from '../src/constants/translations.js';

test('1. State to Language Mapping verifies Phase 2 requirements', (t) => {
  // Karnataka → Kannada
  assert.equal(getLanguageForState('Karnataka'), 'kn', 'Karnataka must map to kn (Kannada)');
  assert.equal(getLanguageForState('karnataka'), 'kn', 'Case-insensitive Karnataka must map to kn');

  // Telangana → Telugu
  assert.equal(getLanguageForState('Telangana'), 'te', 'Telangana must map to te (Telugu)');
  assert.equal(getLanguageForState('telangana'), 'te', 'Case-insensitive Telangana must map to te');

  // Andhra Pradesh → Telugu
  assert.equal(getLanguageForState('Andhra Pradesh'), 'te', 'Andhra Pradesh must map to te (Telugu)');
  assert.equal(getLanguageForState('andhra pradesh'), 'te', 'Case-insensitive Andhra Pradesh must map to te');
  assert.equal(getLanguageForState('Andhra'), 'te', 'Andhra shorthand must map to te');

  // Maharashtra → Marathi
  assert.equal(getLanguageForState('Maharashtra'), 'mr', 'Maharashtra must map to mr (Marathi)');
  assert.equal(getLanguageForState('maharashtra'), 'mr', 'Case-insensitive Maharashtra must map to mr');

  // Other states → Hindi
  assert.equal(getLanguageForState('Delhi'), 'hi', 'Delhi must map to hi (Hindi)');
  assert.equal(getLanguageForState('Uttar Pradesh'), 'hi', 'Uttar Pradesh must map to hi (Hindi)');
  assert.equal(getLanguageForState('Rajasthan'), 'hi', 'Rajasthan must map to hi (Hindi)');
  assert.equal(getLanguageForState('Gujarat'), 'hi', 'Gujarat must map to hi (Hindi)');
  assert.equal(getLanguageForState('Madhya Pradesh'), 'hi', 'Madhya Pradesh must map to hi (Hindi)');
  assert.equal(getLanguageForState('Haryana'), 'hi', 'Haryana must map to hi (Hindi)');
  assert.equal(getLanguageForState('Punjab'), 'hi', 'Punjab must map to hi (Hindi)');
  assert.equal(getLanguageForState('Bihar'), 'hi', 'Bihar must map to hi (Hindi)');
  assert.equal(getLanguageForState('Tamil Nadu'), 'hi', 'Other unmapped state must default to hi (Hindi)');
  assert.equal(getLanguageForState('Unknown State'), 'hi', 'Unknown state must default to hi (Hindi)');

  // Empty / null fallback → English
  assert.equal(getLanguageForState(''), 'en', 'Empty state string must fallback to en (English)');
  assert.equal(getLanguageForState(null), 'en', 'Null state must fallback to en (English)');
  assert.equal(getLanguageForState(undefined), 'en', 'Undefined state must fallback to en (English)');
});

test('2. Available Languages match Phase 3 Native Name Requirements', (t) => {
  const codes = AVAILABLE_LANGUAGES.map((l) => l.code);
  assert.deepEqual(codes, ['en', 'hi', 'te', 'kn', 'mr'], 'Available languages must contain all 5 target language codes');

  const en = AVAILABLE_LANGUAGES.find((l) => l.code === 'en');
  assert.equal(en.native, 'English');
  assert.equal(en.fullLabel, 'English');

  const hi = AVAILABLE_LANGUAGES.find((l) => l.code === 'hi');
  assert.equal(hi.native, 'हिन्दी');
  assert.equal(hi.fullLabel, 'हिन्दी – Hindi');

  const te = AVAILABLE_LANGUAGES.find((l) => l.code === 'te');
  assert.equal(te.native, 'తెలుగు');
  assert.equal(te.fullLabel, 'తెలుగు – Telugu');

  const kn = AVAILABLE_LANGUAGES.find((l) => l.code === 'kn');
  assert.equal(kn.native, 'ಕನ್ನಡ');
  assert.equal(kn.fullLabel, 'ಕನ್ನಡ – Kannada');

  const mr = AVAILABLE_LANGUAGES.find((l) => l.code === 'mr');
  assert.equal(mr.native, 'मराठी');
  assert.equal(mr.fullLabel, 'मराठी – Marathi');
});

test('3. UI Translation Dictionary Completeness across all 5 languages', (t) => {
  const enKeys = Object.keys(UI_TRANSLATIONS.en);
  assert.ok(enKeys.length >= 150, `EN dictionary must contain comprehensive keys (found ${enKeys.length})`);

  const targetLangs = ['hi', 'te', 'kn', 'mr'];

  for (const lang of targetLangs) {
    const dict = UI_TRANSLATIONS[lang];
    assert.ok(dict, `Dictionary for ${lang} must exist`);

    const missingKeys = enKeys.filter((key) => dict[key] === undefined);
    assert.equal(
      missingKeys.length,
      0,
      `Language ${lang} has missing keys compared to EN: ${missingKeys.slice(0, 10).join(', ')}`
    );

    // Verify critical broker portal keys are translated
    assert.ok(dict.nav_home && dict.nav_home !== '', `${lang}: nav_home must be populated`);
    assert.ok(dict.nav_agreements && dict.nav_agreements !== '', `${lang}: nav_agreements must be populated`);
    assert.ok(dict.nav_clients && dict.nav_clients !== '', `${lang}: nav_clients must be populated`);
    assert.ok(dict.quota_used_docs && dict.quota_used_docs !== '', `${lang}: quota_used_docs must be populated`);
    assert.ok(dict.quota_unused_docs && dict.quota_unused_docs !== '', `${lang}: quota_unused_docs must be populated`);
    assert.ok(dict.btn_sec63 && dict.btn_sec63 !== '', `${lang}: btn_sec63 must be populated`);
    assert.ok(dict.lang_selector_title && dict.lang_selector_title !== '', `${lang}: lang_selector_title must be populated`);
  }
});

test('4. FAQ Translation Dictionaries Completeness', (t) => {
  const targetLangs = ['en', 'hi', 'te', 'kn', 'mr'];
  for (const lang of targetLangs) {
    const faqs = FAQ_TRANSLATIONS[lang];
    assert.ok(Array.isArray(faqs), `FAQ list for ${lang} must be an array`);
    assert.ok(faqs.length >= 8, `FAQ list for ${lang} must have at least 8 items (found ${faqs.length})`);

    faqs.forEach((faq, idx) => {
      assert.ok(faq.question && faq.question.length > 0, `${lang} FAQ #${idx} question must not be empty`);
      assert.ok(faq.answer && faq.answer.length > 0, `${lang} FAQ #${idx} answer must not be empty`);
    });
  }
});

test('5. Safe Translation Fallback Behavior', (t) => {
  function translate(lang, key, fallback) {
    const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
    if (dict && dict[key] !== undefined) return dict[key];
    if (UI_TRANSLATIONS.en && UI_TRANSLATIONS.en[key] !== undefined) return UI_TRANSLATIONS.en[key];
    return fallback !== undefined ? fallback : key;
  }

  // Exact key in Kannada
  assert.equal(translate('kn', 'nav_home', 'Home'), UI_TRANSLATIONS.kn.nav_home);

  // Fallback to EN if unknown language
  assert.equal(translate('unknown_lang', 'nav_home', 'Home'), UI_TRANSLATIONS.en.nav_home);

  // Missing key falls back to EN or custom fallback
  assert.equal(translate('kn', 'non_existent_key_xyz', 'Default Text'), 'Default Text');
});
