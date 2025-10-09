import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnabledPaymentMethods, validateCardDetails, processPayment } from '../data/payment';
import { formatCurrency } from '../utils/uiUtils.jsx';
import { detectCardType, getCardTypeName, getCardTypeColor, formatCardNumber } from '../utils/cardUtils';
import InputField from './InputField';
import Button from './Button';

const PaymentFlow = ({ phoneData, selectedBundle, setPaymentData }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCardType, setDetectedCardType] = useState(null);

  const paymentMethods = getEnabledPaymentMethods();

  const handleCardNumberChange = (value) => {
    // Detect card type as user types
    const cardType = detectCardType(value);
    setDetectedCardType(cardType);
    
    // Format the card number
    const formattedNumber = formatCardNumber(value);
    
    setCardDetails(prev => ({
      ...prev,
      number: formattedNumber
    }));
  };

  const handleExpiryChange = (value) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Format as MM/YY
    let formattedValue = cleanValue;
    if (cleanValue.length >= 2) {
      formattedValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      expiry: formattedValue
    }));
  };

  const handleCVVChange = (value) => {
    // Remove all non-digit characters and limit to 4 digits
    const cleanValue = value.replace(/\D/g, '').substring(0, 4);
    
    setCardDetails(prev => ({
      ...prev,
      cvv: cleanValue
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const paymentData = {
        method: paymentMethod,
        amount: selectedBundle.price,
        cardDetails: paymentMethod === 'card' ? cardDetails : null
      };
      
      const result = await processPayment(paymentData);
      
      if (result.success) {
        setPaymentData(result);
        navigate('/confirmation');
      } else {
        // Handle payment failure
        console.error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800 mb-2">
          Complete Payment
        </p>
        <p className="text-sm text-gray-600">
          Secure payment for your airtime top-up
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Order Summary</h3>
        <div className="space-y-2 text-gray-950">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Recipient</span>
            <span className="font-medium">{phoneData?.recipientNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carrier</span>
            <span className="font-medium">
              {phoneData?.recipientCarrier?.name || 
               phoneData?.recipientCarrier?.carrier?.name || 
               'Unknown Carrier'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bundle</span>
            <span className="font-medium">{selectedBundle?.name || 'Standard Airtime'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">{selectedBundle?.amount || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Country</span>
            <span className="font-medium">{phoneData?.recipientCarrier?.country?.countryName || phoneData?.country?.countryName || 'N/A'}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-emerald-600">{formatCurrency(selectedBundle?.price || 0)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                paymentMethod === method.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span className="text-lg">{method.icon}</span>
              <span className="font-medium text-sm">{method.name}</span>
              {paymentMethod === method.id && (
                <svg className="w-4 h-4 text-emerald-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Details (if card selected) */}
      {paymentMethod === 'card' && (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Card Details</h3>
          <div className="space-y-3">
            <InputField
              type="text"
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
              showCardType={true}
              cardTypeData={detectedCardType ? {
                cardType: detectedCardType,
                cardTypeName: getCardTypeName(detectedCardType),
                cardTypeColor: getCardTypeColor(detectedCardType)
              } : null}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <InputField
                type="text"
                label="Expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                maxLength={5}
              />
              <InputField
                type="text"
                label="CVV"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleCVVChange(e.target.value)}
                maxLength={4}
              />
            </div>
            
            <InputField
              type="text"
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-medium text-blue-800 text-sm">Secure Payment</p>
            <p className="text-xs text-blue-600">Your payment is encrypted and secure</p>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        loading={isProcessing}
        className="w-full"
      >
        Pay {formatCurrency(selectedBundle?.price)}
      </Button>
    </div>
  );
};

export default PaymentFlow;