import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UI_TRANSLATIONS,
  AVAILABLE_LANGUAGES,
  FAQ_TRANSLATIONS,
  STATE_TO_LANGUAGE_MAP,
  getLanguageForState
} from "../constants/translations";
import { storage } from "../utils/storage.js";
import { STORAGE_KEYS as APP_STORAGE_KEYS } from "../constants/storageKeys.js";

const LANGUAGE_STORAGE_KEYS = [
  APP_STORAGE_KEYS.LANGUAGE || "zd_lang",
  "zapdocs_interface_language"
];
const MANUAL_OVERRIDE_KEY = "zd_lang_manual_override";
const BROKER_STATE_KEY = "zapdocs_broker_jurisdiction_state";

const LanguageContext = createContext({
  language: "en",
  displayCode: "EN",
  availableLanguages: AVAILABLE_LANGUAGES,
  setLanguage: () => {},
  t: (key, fallback) => key,
  getFaqs: () => [],
  brokerState: "Karnataka",
  setBrokerState: () => {},
  suggestLanguageForState: () => {},
  isManualOverride: false
});

export const LanguageProvider = ({ children }) => {
  const [availableLanguages] = useState(AVAILABLE_LANGUAGES);

  // Broker associated state (default: Karnataka)
  const [brokerState, setBrokerStateInternal] = useState(() => {
    try {
      const saved = storage.get(BROKER_STATE_KEY);
      if (saved && typeof saved === "string") return saved;
      const brokerSession = storage.get(APP_STORAGE_KEYS.BROKER_SESSION || "zd_brk");
      if (brokerSession?.state) return brokerSession.state;
    } catch {}
    return "Karnataka";
  });

  const [isManualOverride, setIsManualOverride] = useState(() => {
    try {
      return storage.get(MANUAL_OVERRIDE_KEY) === "true" || storage.get(MANUAL_OVERRIDE_KEY) === true;
    } catch {
      return false;
    }
  });

  const [language, setLanguageState] = useState(() => {
    // 1. First check if a saved language preference exists
    try {
      for (const k of LANGUAGE_STORAGE_KEYS) {
        const saved = storage.get(k);
        if (saved && typeof saved === "string") {
          const s = saved.toLowerCase().trim();
          if (s === "hi" || s === "hindi" || saved === "हिन्दी" || saved === "हि") return "hi";
          if (s === "te" || s === "telugu" || saved === "తెలుగు" || saved === "తె") return "te";
          if (s === "kn" || s === "kannada" || saved === "ಕನ್ನಡ" || saved === "ಕ") return "kn";
          if (s === "mr" || s === "marathi" || saved === "मराठी" || saved === "म") return "mr";
          if (s === "en" || s === "english") return "en";
        }
      }
    } catch {}

    // 2. If no saved preference exists, use English as standard default fallback
    try {
      const brokerSession = storage.get(APP_STORAGE_KEYS.BROKER_SESSION || "zd_brk");
      if (brokerSession?.state && storage.get(MANUAL_OVERRIDE_KEY)) {
        return getLanguageForState(brokerSession.state);
      }
      return "en"; // English is the primary ZapDocs dashboard interface default
    } catch {
      return "en";
    }
  });

  /**
   * Change language manually or programmatically.
   * When isManual is true, marks manual override to prevent state changes from overwriting it.
   */
  const setLanguage = (langCode, isManual = true) => {
    if (!langCode) return;
    const lower = String(langCode).toLowerCase().trim();
    let code = "en";

    if (lower === "hi" || lower === "hindi" || langCode === "हिन्दी" || langCode === "हि") {
      code = "hi";
    } else if (lower === "te" || lower === "telugu" || langCode === "తెలుగు" || langCode === "తె") {
      code = "te";
    } else if (lower === "kn" || lower === "kannada" || langCode === "ಕನ್ನಡ" || langCode === "ಕ") {
      code = "kn";
    } else if (lower === "mr" || lower === "marathi" || langCode === "मराठी" || langCode === "म") {
      code = "mr";
    } else {
      code = "en";
    }

    setLanguageState(code);

    try {
      LANGUAGE_STORAGE_KEYS.forEach((key) => {
        storage.set(key, code);
      });
      if (isManual) {
        storage.set(MANUAL_OVERRIDE_KEY, "true");
        setIsManualOverride(true);
      }
    } catch (e) {
      console.warn("Could not persist language to storage", e);
    }
  };

  /**
   * Associates broker with a jurisdiction state.
   * If broker has not manually chosen a language, automatically updates to the regional language.
   * If manual override exists, keeps user's choice and suggests regional language.
   */
  const setBrokerState = (newState) => {
    if (!newState || typeof newState !== "string") return;
    setBrokerStateInternal(newState);
    try {
      storage.set(BROKER_STATE_KEY, newState);
    } catch {}

    const hasManual = storage.get(MANUAL_OVERRIDE_KEY) === "true" || storage.get(MANUAL_OVERRIDE_KEY) === true;
    if (!hasManual) {
      const defaultLang = getLanguageForState(newState);
      setLanguage(defaultLang, false);
    }
  };

  /**
   * Suggest regional language for a state without overwriting manual preferences
   */
  const suggestLanguageForState = (stateName) => {
    if (!stateName) return language;
    const regionalLang = getLanguageForState(stateName);
    const hasManual = storage.get(MANUAL_OVERRIDE_KEY) === "true" || storage.get(MANUAL_OVERRIDE_KEY) === true;

    if (!hasManual) {
      setLanguage(regionalLang, false);
      return regionalLang;
    }
    return regionalLang;
  };

  const activeLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];
  const displayCode = activeLangObj?.displayCode || "EN";

  const t = (key, fallback) => {
    const dict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
    if (dict && dict[key] !== undefined) return dict[key];
    if (UI_TRANSLATIONS.en && UI_TRANSLATIONS.en[key] !== undefined) return UI_TRANSLATIONS.en[key];
    return fallback !== undefined ? fallback : key;
  };

  const getFaqs = () => {
    return FAQ_TRANSLATIONS[language] || FAQ_TRANSLATIONS.en;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        displayCode,
        availableLanguages,
        setLanguage,
        t,
        getFaqs,
        brokerState,
        setBrokerState,
        suggestLanguageForState,
        isManualOverride
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
