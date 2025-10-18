import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBundlesByType, bundleTypes } from '../../src/data/bundles';
import { getBundleIcon } from '../../src/utils/uiUtils.jsx';
import CustomAirtimeInput from '../../src/components/CustomAirtimeInput';
import Button from '../components/ButtonV2';
import { ReusableButton } from '../../src/components/buttons';
import { colorsV2 as colors } from '../data/colorsV2';

const BundleSelectionV2 = ({ phoneData, selectedBundle, setSelectedBundle }) => {
  const navigate = useNavigate();
  const [bundleType, setBundleType] = useState('airtime');
  const [customBundle, setCustomBundle] = useState(null);
  const [clearCustomInput, setClearCustomInput] = useState(false);
  
  const paymentLoading = false;
  const paymentError = null;
  const isPaymentAPIAvailable = false;

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
  }, [customBundle, setSelectedBundle]);

  const handleCustomBundleChange = useCallback((customBundleData) => {
    setCustomBundle(customBundleData);
    if (customBundleData) {
      setSelectedBundle(customBundleData);
    } else {
      setSelectedBundle(null);
    }
  }, [setSelectedBundle]);

  const handleContinue = () => {
    if (selectedBundle) {
      navigate('/v2/payment');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content - Full Length */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div 
                className="w-auto text-base h-12 rounded-lg px-4 flex items-center justify-center text-white font-bold shadow-lg"
                style={{ backgroundColor: phoneData.recipientCarrier?.carrier.logoColor }}
              >
                {phoneData.recipientCarrier?.carrier.logoText}
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold text-gray-800">{phoneData.recipientCarrier?.carrier.name}</h2>
                <p className="text-xs text-gray-600">{phoneData.recipientNumber}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 mb-2">
              Choose your bundle
            </p>
            <p className="text-xs text-gray-600">
              Select the perfect package for your needs
            </p>
          </div>

          {/* Bundle Type Selector - Mobile Optimized */}
          <div className="bg-white rounded-xl shadow-md p-3 border border-gray-100 mb-6">
            <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl">
              {Object.entries(bundleTypes).map(([key, type]) => (
                <ReusableButton
                  key={key}
                  onClick={() => setBundleType(key)}
                  selected={bundleType === key}
                  variant="selection"
                  size="sm"
                  customColors={colors}
                  className="py-2 px-2 text-xs font-medium"
                  icon={<span className="text-sm">{getBundleIcon(key)}</span>}
                >
                  {type.name}
                </ReusableButton>
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
            <ReusableButton
              key={bundle.id}
              onClick={() => handleBundleSelect(bundle)}
              selected={selectedBundle?.id === bundle.id && selectedBundle?.isCustom !== true}
              variant="card"
              customColors={colors}
              title={bundle.name}
              price={bundle.price}
              description={bundle.description}
            >
              {bundle.amount}
            </ReusableButton>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button - Fixed at Bottom Inside Card */}
        {selectedBundle && (
          <div className="p-6 border-t border-gray-100">
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
    </div>
  );
};

export default BundleSelectionV2;
