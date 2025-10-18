import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment } from '../data/payment';
import { formatCurrency } from '../utils/uiUtils.jsx';
import Button from './Button';

const PaymentFlow = ({ phoneData, selectedBundle, setPaymentData }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);


  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const paymentData = {
        method: 'superapp',
        amount: selectedBundle.price
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
            <span style={{color: '#8dd000'}}>{formatCurrency(selectedBundle?.price || 0)}</span>
          </div>
        </div>
      </div>


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