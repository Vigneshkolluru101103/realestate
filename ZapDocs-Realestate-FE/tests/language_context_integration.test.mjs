import test from 'node:test';
import assert from 'node:assert/strict';
import { getLanguageForState } from '../src/constants/translations.js';

// Simulation of storage and LanguageContext state logic
class MockStorage {
  constructor() {
    this.store = {};
  }
  get(key, fallback = null) {
    return this.store[key] !== undefined ? this.store[key] : fallback;
  }
  set(key, val) {
    this.store[key] = val;
  }
  clear() {
    this.store = {};
  }
}

function createLanguageController(storage, initialBrokerSession = null) {
  const LANGUAGE_STORAGE_KEYS = ['zd_lang', 'zapdocs_interface_language'];
  const MANUAL_OVERRIDE_KEY = 'zd_lang_manual_override';
  const BROKER_STATE_KEY = 'zapdocs_broker_jurisdiction_state';

  let brokerState = storage.get(BROKER_STATE_KEY) || initialBrokerSession?.state || 'Karnataka';
  let isManualOverride = storage.get(MANUAL_OVERRIDE_KEY) === 'true';

  let language = 'en';
  // 1. Saved preference check
  let foundSaved = false;
  for (const k of LANGUAGE_STORAGE_KEYS) {
    const saved = storage.get(k);
    if (saved && typeof saved === 'string') {
      const s = saved.toLowerCase().trim();
      if (['hi', 'te', 'kn', 'mr', 'en'].includes(s)) {
        language = s;
        foundSaved = true;
        break;
      }
    }
  }

  // 2. If no saved preference, resolve by state
  if (!foundSaved) {
    language = getLanguageForState(brokerState);
  }

  function setLanguage(code, isManual = true) {
    language = code;
    LANGUAGE_STORAGE_KEYS.forEach((k) => storage.set(k, code));
    if (isManual) {
      storage.set(MANUAL_OVERRIDE_KEY, 'true');
      isManualOverride = true;
    }
  }

  function setBrokerState(newState) {
    brokerState = newState;
    storage.set(BROKER_STATE_KEY, newState);
    const hasManual = storage.get(MANUAL_OVERRIDE_KEY) === 'true';
    if (!hasManual) {
      const defaultLang = getLanguageForState(newState);
      setLanguage(defaultLang, false);
    }
  }

  function suggestLanguageForState(stateName) {
    if (!stateName) return language;
    const regionalLang = getLanguageForState(stateName);
    const hasManual = storage.get(MANUAL_OVERRIDE_KEY) === 'true';
    if (!hasManual) {
      setLanguage(regionalLang, false);
    }
    return regionalLang;
  }

  return {
    get language() { return language; },
    get brokerState() { return brokerState; },
    get isManualOverride() { return isManualOverride; },
    setLanguage,
    setBrokerState,
    suggestLanguageForState
  };
}

test('Scenario 1: Fresh Login from Karnataka without prior preference selects Kannada (kn)', () => {
  const mockStorage = new MockStorage();
  const ctrl = createLanguageController(mockStorage, { state: 'Karnataka' });
  assert.equal(ctrl.language, 'kn', 'Should default to Kannada for Karnataka broker');
  assert.equal(ctrl.isManualOverride, false);
});

test('Scenario 2: Fresh Login from Telangana selects Telugu (te)', () => {
  const mockStorage = new MockStorage();
  const ctrl = createLanguageController(mockStorage, { state: 'Telangana' });
  assert.equal(ctrl.language, 'te', 'Should default to Telugu for Telangana broker');
});

test('Scenario 3: Fresh Login from Maharashtra selects Marathi (mr)', () => {
  const mockStorage = new MockStorage();
  const ctrl = createLanguageController(mockStorage, { state: 'Maharashtra' });
  assert.equal(ctrl.language, 'mr', 'Should default to Marathi for Maharashtra broker');
});

test('Scenario 4: Fresh Login from Delhi or UP selects Hindi (hi)', () => {
  const mockStorage = new MockStorage();
  const ctrl = createLanguageController(mockStorage, { state: 'Delhi' });
  assert.equal(ctrl.language, 'hi', 'Should default to Hindi for Delhi broker');
});

test('Scenario 5: Manual language selection persists and overrides state-based default', () => {
  const mockStorage = new MockStorage();
  const ctrl = createLanguageController(mockStorage, { state: 'Karnataka' });
  assert.equal(ctrl.language, 'kn');

  // Broker manually chooses Hindi
  ctrl.setLanguage('hi', true);
  assert.equal(ctrl.language, 'hi');
  assert.equal(ctrl.isManualOverride, true);
  assert.equal(mockStorage.get('zd_lang'), 'hi');
  assert.equal(mockStorage.get('zd_lang_manual_override'), 'true');

  // Next session: restored from storage
  const nextSessionCtrl = createLanguageController(mockStorage, { state: 'Karnataka' });
  assert.equal(nextSessionCtrl.language, 'hi', 'Saved manual language must persist across sessions');
  assert.equal(nextSessionCtrl.isManualOverride, true);

  // When broker state changes, manual choice is NOT overwritten
  nextSessionCtrl.setBrokerState('Maharashtra');
  assert.equal(nextSessionCtrl.brokerState, 'Maharashtra');
  assert.equal(nextSessionCtrl.language, 'hi', 'State change must NEVER overwrite manual choice');
});

test('Scenario 6: When no manual override exists, updating jurisdiction state updates language', () => {
  const mockStorage = new MockStorage();
  const ctrl = createLanguageController(mockStorage, { state: 'Karnataka' });
  assert.equal(ctrl.language, 'kn');
  assert.equal(ctrl.isManualOverride, false);

  // Broker switches jurisdiction to Telangana without having locked manual override
  ctrl.setBrokerState('Telangana');
  assert.equal(ctrl.language, 'te', 'Should automatically adopt Telugu for Telangana');

  ctrl.setBrokerState('Maharashtra');
  assert.equal(ctrl.language, 'mr', 'Should automatically adopt Marathi for Maharashtra');
});
