// ============================================================
// Language Configuration Service — Phase 1 Backend API Integration
// Renders language options dynamically from backend configuration.
// Multi-lingual support: English, Telugu, Kannada, Marathi.
// ============================================================
import { api } from "./client";
import { UI_TRANSLATIONS, AVAILABLE_LANGUAGES } from "../../constants/translations";

export { UI_TRANSLATIONS, AVAILABLE_LANGUAGES };

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const STATE_LANGUAGE_MAP = {
  Karnataka: AVAILABLE_LANGUAGES,
  Maharashtra: AVAILABLE_LANGUAGES,
  Telangana: AVAILABLE_LANGUAGES,
  National: AVAILABLE_LANGUAGES
};

let cachedLanguages = null;

export const languageService = {
  /**
   * Fetch supported interface languages from backend configuration.
   * Dynamically resolves based on active jurisdiction (Karnataka / National).
   */
  getSupportedLanguages: async (state = "Karnataka", forceRefresh = false) => {
    if (!forceRefresh && cachedLanguages) {
      return cachedLanguages;
    }

    try {
      if (!USE_MOCK) {
        const res = await api.get("/config/languages", { state });
        if (res && Array.isArray(res.languages)) {
          cachedLanguages = res.languages;
          return cachedLanguages;
        }
      }

      const languages = AVAILABLE_LANGUAGES;
      cachedLanguages = languages;
      return languages;
    } catch (err) {
      console.error("[LanguageService] Failed to fetch language configuration:", err);
      return AVAILABLE_LANGUAGES;
    }
  },

  clearCache: () => {
    cachedLanguages = null;
  }
};
