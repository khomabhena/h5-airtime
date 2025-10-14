import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBundlesByType, bundleTypes } from '../data/bundles';
import { getBundleIcon } from '../utils/uiUtils.jsx';
import CustomAirtimeInput from './CustomAirtimeInput';
import Button from './Button';
import { colors } from '../data/colors';

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

      {/* Bundle Type Selector - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-md p-3 border border-gray-100">
        <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl">
          {Object.entries(bundleTypes).map(([key, type]) => (
            <button
              key={key}
              onClick={() => setBundleType(key)}
              className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg font-medium text-xs transition-all ${
                bundleType === key
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-sm">{getBundleIcon(key)}</span>
              <span className="truncate">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bundle Grid - Mobile Optimized */}
      <div className="space-y-3">
        {/* Custom Airtime Input - Only show for airtime bundle type, positioned at the top */}
        {bundleType === 'airtime' && (
          <div>
            <CustomAirtimeInput
              onCustomAmountChange={handleCustomBundleChange}
              minAmount={1}
              maxAmount={1000}
              clearInput={clearCustomInput}
            />
          </div>
        )}
        
        {/* Bundle Cards - Mobile First Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              onClick={() => handleBundleSelect(bundle)}
              className={`rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                  ? `border-[${colors.app.primary}] bg-[${colors.app.primary}] text-white`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* Mobile Optimized Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-bold truncate ${
                    selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>{bundle.name}</h3>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className={`text-base font-bold ${
                    selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                      ? 'text-white'
                      : 'text-emerald-600'
                  }`}>${bundle.price}</div>
                  <div className={`text-xs ${
                    selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}>USD</div>
                </div>
              </div>
              
              {/* Mobile Optimized Content */}
              <div className="mb-3">
                <div className={`text-lg font-bold mb-1 ${
                  selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                    ? 'text-white'
                    : 'text-gray-800'
                }`}>
                  {bundle.amount}
                </div>
                <p className={`text-xs leading-relaxed ${
                  selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true
                    ? 'text-white'
                    : 'text-gray-600'
                }`}>{bundle.description}</p>
              </div>

              {/* Selection Indicator */}
              {selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true && (
                <div className="flex items-center space-x-2 text-white">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium text-sm">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button - Mobile Optimized */}
      {selectedBundle && (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 text-sm mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-sm font-medium truncate">
                    {selectedBundle.isCustom 
                      ? `Custom airtime ($${selectedBundle.amount})`
                      : selectedBundle.name
                    }
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {phoneData.recipientNumber}
                  </p>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-lg font-bold text-emerald-600">${selectedBundle.price}</div>
                  <div className="text-xs text-gray-500">USD</div>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleContinue}
            className="w-full py-3 text-base font-semibold"
          >
            Continue to Payment
          </Button>
        </div>
      )}
    </div>
  );
};

export default BundleSelection;