import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhoneValidation } from '../../src/hooks/usePhoneValidation';
import InputField from '../../src/components/InputField';
import Button from '../components/ButtonV2';

const RecipientInputV2 = ({ phoneData, setPhoneData }) => {
  const navigate = useNavigate();
  const [recipientNumber, setRecipientNumber] = useState(phoneData.recipientNumber || '');
  
  const validation = usePhoneValidation(recipientNumber);

  const handleRecipientChange = (e) => {
    const value = e.target.value;
    setRecipientNumber(value);
    setPhoneData(prev => ({
      ...prev,
      recipientNumber: value,
      recipientCarrier: null
    }));
  };

  // Use formatted number for display and validation
  const displayNumber = validation.formattedNumber || recipientNumber;

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = () => {
    if (validation.isValid && validation.carrier && validation.isComplete) {
      setPhoneData(prev => ({
        ...prev,
        recipientNumber: displayNumber,
        recipientCarrier: validation.carrier
      }));
      navigate('/v2/bundles');
    } else if (validation.carrier && !validation.isComplete) {
      // Show error message instead of alert
      const remaining = validation.expectedLength.max - validation.currentLength;
      setErrorMessage(`Please complete the phone number. You need ${remaining} more digit${remaining > 1 ? 's' : ''}.`);
      setShowError(true);
      // Auto-hide error after 3 seconds
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleBack = () => {
    navigate('/v2');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Recipient Input Card - Full Length */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full flex-1 flex flex-col">
        <div className="p-6 flex-1">
          <div className="text-center mb-6">
            <p className="text-base font-bold text-gray-800 mb-2">
              Recipient Phone Number!
            </p>
            <p className="text-xs text-gray-600">
              Enter the recipient's phone number
            </p>
          </div>

          {/* Recipient Phone Input Section */}
          <div className="space-y-4">
            {/* Recipient Phone Number Input */}
            <InputField
              type="tel"
              label="Recipient Phone Number"
              value={displayNumber}
              onChange={handleRecipientChange}
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

            {/* Error Message */}
            {showError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button at Bottom - Inside Card */}
        <div className="p-6">
          <Button
            onClick={handleContinue}
            disabled={!validation.isValid}
            loading={validation.loading}
            className="w-full"
          >
            {validation.isValid && validation.isComplete 
              ? 'Continue to bundles' 
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

export default RecipientInputV2;
