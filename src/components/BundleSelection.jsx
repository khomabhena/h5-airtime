import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBundlesByType, bundleTypes } from '../data/bundles';
import { getBundleIcon } from '../utils/uiUtils.jsx';
import CustomAirtimeInput from './CustomAirtimeInput';
import Button from './Button';
import { ReusableButton } from './buttons';
import { colors } from '../data/colors';
import { usePayment } from '../hooks/usePayment';
import SuperAppDebug from './SuperAppDebug';

const BundleSelection = ({ phoneData, selectedBundle, setSelectedBundle }) => {
  const navigate = useNavigate();
  const [bundleType, setBundleType] = useState('airtime');
  const [customBundle, setCustomBundle] = useState(null);
  const [clearCustomInput, setClearCustomInput] = useState(false);
  
  // Payment hook
  const { 
    loading: paymentLoading, 
    error: paymentError, 
    processPayment, 
    clearError,
    isPaymentAPIAvailable
  } = usePayment();

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

  const handleContinue = async () => {
    if (!selectedBundle) return;

    // Clear any previous errors
    clearError();

    // Log payment API status
    console.log('🔍 Payment API Available:', isPaymentAPIAvailable);
    console.log('🔍 window.payment:', window.payment);

    // TEMPORARY: Allow payment to proceed even if API not detected for debugging
    // Comment this out once SuperApp API is properly detected
    const forcePaymentFlow = true;

    // If payment API is not available and not forcing, navigate to payment page
    if (!isPaymentAPIAvailable && !forcePaymentFlow) {
      console.warn('Payment API not available, navigating to payment page');
      navigate('/payment');
      return;
    }

    try {
      // Prepare payment data
      const orderData = {
        amount: Math.round(selectedBundle.price * 100), // Convert to cents
        currency: 'USD',
        description: selectedBundle.isCustom 
          ? `Custom airtime $${selectedBundle.amount} for ${phoneData.recipientNumber}`
          : `${selectedBundle.name} for ${phoneData.recipientNumber}`,
        callbackInfo: JSON.stringify({
          bundleId: selectedBundle.id,
          bundleName: selectedBundle.name,
          phoneNumber: phoneData.recipientNumber,
          carrier: phoneData.recipientCarrier?.carrier.name
        })
      };

      // Process payment
      const result = await processPayment(orderData);

      if (result.success) {
        // Navigate to success page or show success message
        navigate('/payment-success', { 
          state: { 
            paymentData: result.data,
            bundle: selectedBundle,
            phoneData: phoneData
          } 
        });
      } else {
        // Error is already handled by the hook, just log it
        console.error('Payment failed:', result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
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
      <div className="bg-white rounded-xl shadow-md p-3 border border-gray-100">
        <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl">
          {Object.entries(bundleTypes).map(([key, type]) => (
            <ReusableButton
              key={key}
              onClick={() => setBundleType(key)}
              selected={bundleType === key}
              variant="selection"
              size="sm"
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
              title={bundle.name}
              price={bundle.price}
              description={bundle.description}
            >
              {bundle.amount}
            </ReusableButton>
          ))}
        </div>
      </div>

      {/* Payment Error Display */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800">Payment Error</h4>
              <p className="text-xs text-red-600 mt-1">{paymentError.message}</p>
              
              {/* Technical Details in Development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                  {paymentError.technicalMessage && (
                    <p className="text-red-700 font-mono mb-1">
                      <strong>Technical:</strong> {paymentError.technicalMessage}
                    </p>
                  )}
                  {paymentError.type && (
                    <p className="text-red-700">
                      <strong>Type:</strong> {paymentError.type}
                    </p>
                  )}
                  {paymentError.context && (
                    <p className="text-red-700">
                      <strong>Context:</strong> {paymentError.context}
                    </p>
                  )}
                  <p className="text-red-600 mt-1 text-xs">
                    💡 Check browser console (F12) for detailed logs
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
          
          {/* Payment API Availability Warning */}
          {!isPaymentAPIAvailable && (
            <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-yellow-800">
                    SuperApp Payment API Not Detected
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Check the debug panel below for details. The payment will proceed in test mode.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={handleContinue}
            loading={paymentLoading}
            disabled={paymentLoading}
            className="w-full py-3 text-base font-semibold"
          >
            {paymentLoading ? 'Processing Payment...' : isPaymentAPIAvailable ? 'Pay Now' : 'Continue to Payment'}
          </Button>
        </div>
      )}

      {/* SuperApp Debug Panel */}
      <SuperAppDebug />
    </div>
  );
};

export default BundleSelection;