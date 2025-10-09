// Custom hook for phone number validation and carrier detection

import { useState, useEffect, useCallback } from 'react';
import { validatePhoneNumber, validatePhoneNumberLength, detectCarrierFromPhone } from '../utils/phoneUtils';
import { debounce } from '../utils/uiUtils.jsx';

export const usePhoneValidation = (phoneNumber) => {
  const [validation, setValidation] = useState({
    isValid: false,
    error: null,
    carrier: null,
    loading: false,
    isComplete: false,
    expectedLength: null,
    currentLength: 0
  });

  // Auto-add plus sign if missing
  const formatPhoneNumber = (number) => {
    if (!number) return '';
    
    // Remove any existing plus sign and spaces
    const cleanNumber = number.replace(/[\s+]/g, '');
    
    // If it doesn't start with +, add it
    if (cleanNumber && !number.startsWith('+')) {
      return '+' + cleanNumber;
    }
    
    return number;
  };

  const debouncedValidation = useCallback(
    debounce(async (number) => {
      setValidation(prev => ({ ...prev, loading: true }));

      const formattedNumber = formatPhoneNumber(number);
      const phoneValidation = validatePhoneNumber(formattedNumber);
      
      if (!phoneValidation.isValid) {
        setValidation({
          isValid: false,
          error: phoneValidation.error,
          carrier: null,
          loading: false,
          isComplete: false,
          expectedLength: null,
          currentLength: 0
        });
        return;
      }

      // Check phone number length for the specific country
      const lengthValidation = validatePhoneNumberLength(formattedNumber);
      
      if (!lengthValidation.isValid) {
        setValidation({
          isValid: false,
          error: lengthValidation.error,
          carrier: null,
          loading: false,
          isComplete: lengthValidation.isComplete,
          expectedLength: lengthValidation.expectedLength,
          currentLength: lengthValidation.currentLength || 0
        });
        return;
      }

      try {
        const carrier = detectCarrierFromPhone(formattedNumber);
        setValidation({
          isValid: !!carrier, // Always show carrier if detected, regardless of length
          error: carrier ? null : 'Unable to detect carrier for this number',
          carrier,
          loading: false,
          isComplete: lengthValidation.isComplete,
          expectedLength: lengthValidation.expectedLength,
          currentLength: lengthValidation.currentLength
        });
      } catch (error) {
        setValidation({
          isValid: false,
          error: 'Error detecting carrier',
          carrier: null,
          loading: false,
          isComplete: false,
          expectedLength: null,
          currentLength: 0
        });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (phoneNumber && phoneNumber.length > 3) {
      debouncedValidation(phoneNumber);
    } else {
      setValidation({
        isValid: false,
        error: null,
        carrier: null,
        loading: false,
        isComplete: false,
        expectedLength: null,
        currentLength: 0
      });
    }
  }, [phoneNumber, debouncedValidation]);

  return {
    ...validation,
    formattedNumber: formatPhoneNumber(phoneNumber)
  };
};
