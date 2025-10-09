// Constants and configuration for H5 Airtime Application

export const APP_CONFIG = {
  name: 'AirTime',
  version: '1.0.0',
  description: 'Send airtime to 180+ countries worldwide',
  currency: 'USD',
  supportedCountries: 180,
  features: [
    'Instant Delivery',
    'Secure Payment', 
    'Global Coverage'
  ]
};

export const ROUTES = {
  HOME: '/',
  BUNDLES: '/bundles',
  PAYMENT: '/payment',
  CONFIRMATION: '/confirmation'
};

export const BUNDLE_TYPES = {
  AIRTIME: 'airtime',
  DATA: 'data',
  SMS: 'sms'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed'
};

export const CARRIER_DETECTION = {
  USE_STATIC_PREFIXES: false, // Set to true for countries without MNP
  USE_REAL_TIME_LOOKUP: true, // Set to true for countries with MNP
  FALLBACK_TO_STATIC: true    // Fallback to static if real-time fails
};

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  LOADING_TIMEOUT: 10000,
  MAX_PHONE_LENGTH: 15,
  MIN_PHONE_LENGTH: 7
};

export const VALIDATION_RULES = {
  PHONE_NUMBER: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 15,
    PATTERN: /^\+?[1-9]\d{1,14}$/
  },
  CARD_NUMBER: {
    MIN_LENGTH: 16,
    MAX_LENGTH: 19,
    PATTERN: /^\d{13,19}$/
  },
  CVV: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 4,
    PATTERN: /^\d{3,4}$/
  }
};

export const ERROR_MESSAGES = {
  INVALID_PHONE: 'Please enter a valid phone number',
  CARRIER_NOT_FOUND: 'Unable to detect carrier for this number',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CARD: 'Please enter valid card details',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction'
};

export const SUCCESS_MESSAGES = {
  CARRIER_DETECTED: 'Carrier detected successfully',
  PAYMENT_SUCCESS: 'Payment processed successfully',
  TOPUP_DELIVERED: 'Airtime delivered successfully'
};
