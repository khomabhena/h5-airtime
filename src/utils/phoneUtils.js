// Phone number utilities for H5 Airtime Application

import { detectCarrier, getCountryByCallingCode, carriersData } from '../data/carriers';
import { VALIDATION_RULES } from '../data/constants';

export const cleanPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters except +
  return phoneNumber.replace(/[^\d+]/g, '');
};

export const formatPhoneNumber = (phoneNumber, countryCode) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  // If it starts with country code, format it
  if (countryCode && cleaned.startsWith(countryCode)) {
    const number = cleaned.substring(countryCode.length);
    return `+${countryCode} ${number}`;
  }
  
  return cleaned;
};

export const validatePhoneNumber = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  if (!cleaned) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Length checks disabled - only check basic pattern
  if (!VALIDATION_RULES.PHONE_NUMBER.PATTERN.test(cleaned)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  return { isValid: true, error: null };
};

export const validatePhoneNumberLength = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  if (!cleaned) {
    return { isValid: false, error: 'Phone number is required', isComplete: false };
  }
  
  // Length validation disabled - always return valid
  return { 
    isValid: true, 
    error: null, 
    isComplete: true,
    expectedLength: null,
    currentLength: cleaned.length
  };
};

export const getExpectedPhoneLength = (country, localNumber) => {
  // Country-specific phone number length requirements
  const countryLengths = {
    'ZW': { min: 9, max: 9 }, // Zimbabwe: 9 digits
    'ZA': { min: 9, max: 9 }, // South Africa: 9 digits
    'NG': { min: 10, max: 10 }, // Nigeria: 10 digits
    'KE': { min: 9, max: 9 }, // Kenya: 9 digits
    'US': { min: 10, max: 10 }, // United States: 10 digits
    'GB': { min: 10, max: 10 }, // United Kingdom: 10 digits
    'DE': { min: 10, max: 12 }, // Germany: 10-12 digits
    'FR': { min: 9, max: 10 }, // France: 9-10 digits
    'CN': { min: 11, max: 11 }, // China: 11 digits
    'IN': { min: 10, max: 10 }, // India: 10 digits
    'JP': { min: 10, max: 11 }, // Japan: 10-11 digits
    'KR': { min: 10, max: 11 }, // South Korea: 10-11 digits
    'BR': { min: 10, max: 11 }, // Brazil: 10-11 digits
    'AR': { min: 10, max: 10 }, // Argentina: 10 digits
    'CL': { min: 8, max: 9 } // Chile: 8-9 digits
  };
  
  // Default to general range if country not found
  return countryLengths[country.countryCode] || { min: 7, max: 15 };
};

export const extractCountryCode = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  if (!cleaned.startsWith('+')) {
    return null;
  }
  
  // Try to find matching country code by checking all possible calling codes
  const countries = carriersData.countries;
  for (const country of countries) {
    if (cleaned.startsWith(country.callingCode)) {
      return country.callingCode;
    }
  }
  
  return null;
};

export const detectCarrierFromPhone = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  console.log('Cleaned phone number:', cleaned);
  
  const countryCode = extractCountryCode(cleaned);
  console.log('Extracted country code:', countryCode);
  
  if (!countryCode) {
    console.log('No country code found');
    return null;
  }
  
  const country = getCountryByCallingCode(countryCode);
  console.log('Found country:', country);
  
  if (!country) {
    console.log('Country not found for calling code:', countryCode);
    return null;
  }
  
  const result = detectCarrier(cleaned, country.countryCode);
  console.log('Carrier detection result:', result);
  
  return result;
};

export const getPhoneDisplayInfo = (phoneNumber, country) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  const formatted = formatPhoneNumber(cleaned, country?.callingCode);
  
  return {
    original: phoneNumber,
    cleaned,
    formatted,
    countryCode: country?.callingCode,
    countryName: country?.countryName,
    flag: country?.flag
  };
};
