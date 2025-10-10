import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCountries } from '../data/carriers';
import { usePhoneValidation } from '../hooks/usePhoneValidation';
import InputField from './InputField';
import Button from './Button';

const PhoneInput = ({ phoneData, setPhoneData }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(phoneData.phoneNumber);
  const [selectedCountry, setSelectedCountry] = useState(phoneData.country);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  
  const countries = getAllCountries();
  const validation = usePhoneValidation(phoneNumber);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    // Auto-detect country from phone number
    if (value.startsWith('+')) {
      const country = countries.find(c => value.startsWith(c.callingCode));
      if (country) {
        setSelectedCountry(country);
      }
    }
  };

  // Use formatted number for display and validation
  const displayNumber = validation.formattedNumber || phoneNumber;

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
  };

  const handleContinue = () => {
    if (validation.isValid && validation.carrier && validation.isComplete) {
      setPhoneData({
        phoneNumber: displayNumber,
        country: selectedCountry,
        carrier: validation.carrier
      });
      navigate('/recipient');
    } else if (validation.carrier && !validation.isComplete) {
      // Show alert for incomplete length
      const remaining = validation.expectedLength.max - validation.currentLength;
      alert(`Please complete the phone number. You need ${remaining} more digit${remaining > 1 ? 's' : ''}.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Top-up Card - Similar to ding */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="text-center mb-6">
          <p className="text-lg font-bold text-gray-800 mb-2">
            Your Mobile Number
          </p>
          <p className="text-sm text-gray-600">
            Enter your phone number
          </p>
        </div>

        {/* Phone Input Section */}
        <div className="space-y-4">
          {/* Phone Number Input */}
          <InputField
            type="tel"
            label="Your Phone Number"
            value={displayNumber}
            onChange={handlePhoneChange}
            placeholder="+263 77 123 4567"
            error={validation.error}
            loading={validation.loading}
            showCountryMap={validation.carrier ? true : false}
            countryData={validation.carrier ? {
              flag: validation.carrier.country.flag,
              countryName: validation.carrier.country.countryName,
              callingCode: validation.carrier.country.callingCode,
              carrier: validation.carrier.carrier
            } : null}
            icon={
              validation.carrier ? (
                <div className="text-2xl leading-none" title={validation.carrier.country.countryName} style={{fontSize: '24px'}}>
                  {validation.carrier.country.flag}
                </div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )
            }
            rightIcon={
              validation.loading ? (
                <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : validation.isValid && !validation.loading ? (
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : null
            }
          />

          {/* Phone Number Length Progress */}
          {validation.expectedLength && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Phone number length</span>
                <span>{validation.currentLength}/{validation.expectedLength.max} digits</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    validation.isComplete ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${Math.min((validation.currentLength / validation.expectedLength.max) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              {!validation.isComplete && validation.currentLength > 0 && (
                <p className="text-xs text-blue-600">
                  {validation.expectedLength.min === validation.expectedLength.max 
                    ? `Enter ${validation.expectedLength.max - validation.currentLength} more digits`
                    : `Enter ${validation.expectedLength.min - validation.currentLength} to ${validation.expectedLength.max - validation.currentLength} more digits`
                  }
                </p>
              )}
            </div>
          )}

          {/* Start Top-up Button - Similar to ding */}
          <Button
            onClick={handleContinue}
            disabled={!validation.isValid}
            loading={validation.loading}
            className="w-full"
          >
            {validation.isValid && validation.isComplete 
              ? 'Start top-up' 
              : validation.isValid && !validation.isComplete
                ? 'Complete phone number'
                : 'Enter a valid phone number'
            }
          </Button>
        </div>
      </div>

      
    </div>
  );
};

export default PhoneInput;