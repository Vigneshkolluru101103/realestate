// ============================================================
// Location Configuration Service — Phase 1 Backend API Integration
// Single source of truth for supported states & location reference data.
// Karnataka is the ONLY active jurisdiction in Phase 1.
// ============================================================
import { jurisdictionService } from "./services";
import { api } from "./client";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// In-memory query cache for location configuration
let cachedActiveStates = null;
let cachedReferenceLocations = null;

// Reference districts for supported jurisdictions
export const KARNATAKA_DISTRICTS = [
  "Bengaluru Urban",
  "Bengaluru Rural",
  "Mysuru",
  "Mangaluru (Dakshina Kannada)",
  "Belagavi",
  "Hubballi-Dharwad",
  "Tumakuru",
  "Shivamogga",
  "Ballari",
  "Udupi",
  "Kalaburagi",
  "Davangere",
  "Hassan",
  "Kolar",
  "Mandya",
  "Chikkamagaluru"
];

export const MAHARASHTRA_DISTRICTS = [
  "Mumbai City",
  "Mumbai Suburban",
  "Pune",
  "Thane",
  "Nagpur",
  "Nashik",
  "Chhatrapati Sambhajinagar",
  "Solapur",
  "Kolhapur"
];

export const TELANGANA_DISTRICTS = [
  "Hyderabad",
  "Ranga Reddy",
  "Medchal-Malkajgiri",
  "Sangareddy",
  "Warangal",
  "Nizamabad",
  "Karimnagar",
  "Khammam"
];

export const locationService = {
  /**
   * Fetch list of active jurisdictions supported in Phase 1.
   * Only states with enabled === true && status === 'active' are returned.
   */
  getSupportedStates: async (forceRefresh = false) => {
    if (!forceRefresh && cachedActiveStates) {
      return cachedActiveStates;
    }

    try {
      if (!USE_MOCK) {
        const response = await api.get("/config/locations/supported-states");
        if (response && Array.isArray(response.states)) {
          cachedActiveStates = response.states;
          return cachedActiveStates;
        }
      }

      // Fetch from jurisdiction service
      const jurisdictions = await jurisdictionService.list();
      const activeStates = jurisdictions
        .filter((j) => j.enabled && j.status === "active")
        .map((j) => ({
          code: j.code,
          name: j.state,
          id: j.id,
          enabled: true,
          status: "active",
          ruleVersion: j.ruleVersion,
          requiresRegistration: j.requiresRegistration,
          stampActReference: j.stampActReference
        }));

      cachedActiveStates = activeStates;
      return activeStates;
    } catch (err) {
      console.error("[LocationService] Failed to fetch supported states from API:", err);
      // Fallback: Supported jurisdictions
      return [
        {
          code: "KA",
          name: "Karnataka",
          id: "jur_KA",
          enabled: true,
          status: "active"
        },
        {
          code: "MH",
          name: "Maharashtra",
          id: "jur_MH",
          enabled: true,
          status: "active"
        },
        {
          code: "TG",
          name: "Telangana",
          id: "jur_TG",
          enabled: true,
          status: "active"
        }
      ];
    }
  },

  /**
   * Validate whether a state is legally active in the current deployment.
   */
  validateState: async (stateName) => {
    const supported = await locationService.getSupportedStates();
    const isSupported = supported.some(
      (s) => s.name.toLowerCase() === (stateName || "").trim().toLowerCase()
    );

    if (!isSupported) {
      return {
        valid: false,
        message: "Only Karnataka, Maharashtra, and Telangana are supported jurisdictions."
      };
    }
    return { valid: true };
  },

  /**
   * Get reference district list for an active state
   */
  getDistrictsForState: (stateName) => {
    const s = (stateName || "").toLowerCase();
    if (s === "karnataka") {
      return KARNATAKA_DISTRICTS;
    }
    if (s === "maharashtra") {
      return MAHARASHTRA_DISTRICTS;
    }
    if (s === "telangana") {
      return TELANGANA_DISTRICTS;
    }
    return [];
  },

  /**
   * Clear in-memory cache (e.g. on logout or administrative changes)
   */
  clearCache: () => {
    cachedActiveStates = null;
    cachedReferenceLocations = null;
  }
};
