import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBundlesByType, bundleTypes } from '../data/bundles';
import { getBundleIcon } from '../utils/uiUtils.jsx';
import CustomAirtimeInput from './CustomAirtimeInput';
import Button from './Button';

const BundleSelection = ({ phoneData, selectedBundle, setSelectedBundle }) => {
  const navigate = useNavigate();
  const [bundleType, setBundleType] = useState('airtime');
  const [customBundle, setCustomBundle] = useState(null);
  const [clearCustomInput, setClearCustomInput] = useState(false);

  // Get bundles from data layer
  const bundles = getBundlesByType(bundleType);

  const handleBundleSelect = useCallback((bundle) => {
    setCustomBundle(null); // Clear custom bundle first
    setSelectedBundle(bundle); // Then set the predefined bundle
    // Only clear custom input if there was a custom bundle selected
    if (customBundle) {
      setClearCustomInput(true);
      // Reset the clear flag immediately to prevent re-triggering
      setTimeout(() => setClearCustomInput(false), 0);
    }
  }, [customBundle]);

  const handleCustomBundleChange = useCallback((customBundleData) => {
    setCustomBundle(customBundleData);
    if (customBundleData) {
      setSelectedBundle(customBundleData);
    } else {
      setSelectedBundle(null);
    }
  }, []);

  const handleContinue = () => {
    if (selectedBundle) {
      navigate('/payment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div 
            className="w-auto text-base h-12 rounded-lg px-4 flex items-center justify-center text-white font-bold shadow-lg"
            style={{ backgroundColor: phoneData.recipientCarrier?.carrier.logoColor }}
          >
            {phoneData.recipientCarrier?.carrier.logoText}
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-800">{phoneData.recipientCarrier?.carrier.name}</h2>
            <p className="text-sm text-gray-600">{phoneData.recipientNumber}</p>
          </div>
        </div>
        <p className="text-base font-bold text-gray-800 mb-2">
          Choose your bundle
        </p>
        <p className="text-xs text-gray-600">
          Select the perfect package for your needs
        </p>
      </div>

      {/* Bundle Type Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {Object.entries(bundleTypes).map(([key, type]) => (
            <button
              key={key}
              onClick={() => setBundleType(key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-xs transition-all ${
                bundleType === key
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {getBundleIcon(key)}
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bundle Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Custom Airtime Input - Only show for airtime bundle type, positioned at the top */}
        {bundleType === 'airtime' && (
          <div className={`${customBundle ? 'md:col-span-2' : ''}`}>
            <CustomAirtimeInput
              onCustomAmountChange={handleCustomBundleChange}
              minAmount={1}
              maxAmount={1000}
              clearInput={clearCustomInput}
            />
          </div>
        )}
        
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            onClick={() => handleBundleSelect(bundle)}
            className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-800">{bundle.name}</h3>
              <div className="text-right">
                <div className="text-base font-bold text-emerald-600">${bundle.price}</div>
                <div className="text-xs text-gray-500">USD</div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-lg font-bold text-gray-800 mb-1">
                {bundle.amount}
              </div>
              <p className="text-gray-600 text-xs">{bundle.description}</p>
            </div>

            {selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true && (
              <div className="flex items-center space-x-2 text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Selected</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      {selectedBundle && (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-xs">Order Summary</h3>
              <p className="text-gray-600 text-xs">
                {selectedBundle.isCustom 
                  ? `Custom airtime ($${selectedBundle.amount}) for ${phoneData.recipientNumber}`
                  : `${selectedBundle.name} for ${phoneData.recipientNumber}`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-emerald-600">${selectedBundle.price}</div>
              <div className="text-xs text-gray-500">USD</div>
            </div>
          </div>
          
          <Button
            onClick={handleContinue}
            className="w-full"
          >
            Continue to Payment
          </Button>
        </div>
      )}
    </div>
  );
};

export default BundleSelection;