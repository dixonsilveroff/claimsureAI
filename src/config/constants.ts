/**
 * ClaimSure Configuration Constants
 * Centralized configuration for all business rules, thresholds, and magic numbers
 */

// Risk Score Thresholds
export const RISK_THRESHOLDS = {
   LOW_MAX: 39,
   MEDIUM_MAX: 69,
   HIGH_MIN: 70,
} as const;

// Completeness Score Thresholds
export const COMPLETENESS_THRESHOLDS = {
   EXCELLENT: 90,
   GOOD: 80,
   FAIR: 60,
   POOR: 0,
} as const;

// Queue Routing Rules
export const QUEUE_RULES = {
   FAST_TRACK_MIN_COMPLETENESS: 80,
   FAST_TRACK_MAX_RISK: RISK_THRESHOLDS.LOW_MAX,
   INVESTIGATION_MIN_RISK: 65,
   STANDARD_MIN_COMPLETENESS: 60,
} as const;

// Risk Score Adjustments
export const RISK_ADJUSTMENTS = {
   // NLP/Narrative Analysis
   CASH_CLAIM: 30,
   VAGUE_DETAILS: 15,
   HIGH_RISK_HOURS: 10,
   URGENCY_PRESSURE: 5,
   SUSPICIOUS_KEYWORDS: 20,
   INCONSISTENT_NARRATIVE: 25,
   EMOTIONAL_LANGUAGE: 10,

   // Document Analysis
   NO_DOCUMENTS: 20,
   SINGLE_DOCUMENT: 5,
   WRONG_DOCUMENT_TYPE: 15,
   GENERIC_FILENAMES: 10,

   // Temporal Analysis
   DELAYED_REPORTING_30_DAYS: 25,
   DELAYED_REPORTING_60_DAYS: 35,
   DELAYED_REPORTING_90_DAYS: 45,
   SAME_DAY_HIGH_VALUE: 10,

   // Location Analysis
   VAGUE_LOCATION: 15,
   HIGH_RISK_LOCATION: 20,
   MISSING_LOCATION: 10,

   // Claim History Simulation
   REPEAT_CLAIMANT: 20,
   NEW_POLICY: 15,
   FREQUENT_CLAIMS: 25,

   // Claim Amount (implied from description)
   HIGH_VALUE_CLAIM: 20,
   TOTAL_LOSS_CLAIM: 15,
} as const;

// Completeness Deductions
export const COMPLETENESS_DEDUCTIONS = {
   SHORT_DESCRIPTION: 20,
   VERY_SHORT_DESCRIPTION: 30,
   NO_DOCUMENTS: 40,
   SINGLE_DOCUMENT: 10,
   MISSING_LOCATION: 15,
   VAGUE_LOCATION: 10,
   MISSING_DATE: 20,
   INCOMPLETE_NARRATIVE: 15,
} as const;

// File Upload Configuration
export const FILE_UPLOAD = {
   MAX_SIZE_MB: 10,
   MAX_SIZE_BYTES: 10 * 1024 * 1024,
   MAX_FILES: 10,
   ALLOWED_TYPES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
   ],
   ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
} as const;

// Date Validation
export const DATE_VALIDATION = {
   MAX_DAYS_PAST: 365, // Claims older than 1 year are suspicious
   MIN_DAYS_PAST: 0,   // No future dates
   DELAYED_REPORTING_THRESHOLD: 30, // Days
} as const;

// Description Validation
export const DESCRIPTION_VALIDATION = {
   MIN_LENGTH: 50,
   RECOMMENDED_LENGTH: 100,
   MAX_LENGTH: 2000,
   VERY_SHORT_THRESHOLD: 30,
} as const;

// High-Risk Keywords
export const HIGH_RISK_KEYWORDS = {
   CASH_RELATED: ['cash', 'money', 'currency', 'bills', 'wallet full'],
   VAGUE_DETAILS: ['unknown', "don't know", "can't remember", 'not sure', 'maybe', 'possibly'],
   HIGH_RISK_TIMES: ['night', '2am', '3am', '4am', 'late night', 'midnight'],
   URGENCY_INDICATORS: ['immediately', 'urgent', 'need money now', 'asap'],
   SUSPICIOUS_PATTERNS: ['stolen', 'lost', 'disappeared', 'vanished', 'nowhere to be found'],
   HIGH_VALUE: ['total loss', 'completely destroyed', 'totaled', 'brand new', 'expensive'],
   EMOTIONAL: ['devastated', 'desperate', 'emergency'],
   VAGUE_LOCATIONS: ['downtown', 'near', 'around', 'somewhere', 'parking lot', 'alley'],
} as const;

// Claim Type Specific Rules
export const CLAIM_TYPE_RULES = {
   AUTO: {
      REQUIRED_KEYWORDS: ['vehicle', 'car', 'truck', 'auto', 'driving'],
      PREFERRED_DOCUMENTS: ['police report', 'accident report', 'photos'],
      MIN_DOCUMENTS: 2,
   },
   HOME: {
      REQUIRED_KEYWORDS: ['house', 'home', 'property', 'residence'],
      PREFERRED_DOCUMENTS: ['photos', 'receipt', 'estimate'],
      MIN_DOCUMENTS: 2,
   },
   GADGET: {
      REQUIRED_KEYWORDS: ['phone', 'laptop', 'tablet', 'device', 'electronics'],
      PREFERRED_DOCUMENTS: ['receipt', 'photos', 'proof of purchase'],
      MIN_DOCUMENTS: 1,
   },
   TRAVEL: {
      REQUIRED_KEYWORDS: ['flight', 'trip', 'travel', 'vacation', 'luggage'],
      PREFERRED_DOCUMENTS: ['ticket', 'booking', 'photos'],
      MIN_DOCUMENTS: 1,
   },
} as const;

// Animation Durations (ms)
export const ANIMATION = {
   PROCESSING_SIMULATION: 2000,
   AUTO_SWITCH_DELAY: 1500,
   NOTIFICATION_DURATION: 3000,
   SCORE_COUNT_UP: 1000,
   TOAST_DURATION: 3000,
} as const;

// UI Constants
export const UI = {
   MAX_CLAIM_ID_DISPLAY_LENGTH: 8,
   CLAIMS_PER_PAGE: 20,
   DASHBOARD_REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// Mock Data Generation
export const MOCK_DATA = {
   CLAIMANT_NAMES: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'],
   POLICY_PREFIX: 'POL-',
   CLAIM_PREFIX: 'CL-',
} as const;
