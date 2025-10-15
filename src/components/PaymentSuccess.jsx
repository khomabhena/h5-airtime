/**
 * Payment Success Component
 * Displays payment confirmation and order details
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentData, bundle, phoneData } = location.state || {};

  useEffect(() => {
    // If no payment data, redirect to home
    if (!paymentData) {
      navigate('/');
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return null;
  }

  const handleNewTransaction = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6 py-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your transaction has been processed</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Transaction Details</h2>
          
          <div className="space-y-3">
            {/* Amount */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Amount</span>
              <span className="text-lg font-bold text-green-600">${bundle?.price || '0.00'}</span>
            </div>

            {/* Bundle/Product */}
            {bundle && (
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-600">Product</span>
                <span className="text-right font-medium text-gray-800">
                  {bundle.isCustom ? `Custom Airtime $${bundle.amount}` : bundle.name}
                </span>
              </div>
            )}

            {/* Recipient */}
            {phoneData && (
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-600">Recipient</span>
                <div className="text-right">
                  <div className="font-medium text-gray-800">{phoneData.recipientNumber}</div>
                  {phoneData.recipientCarrier && (
                    <div className="text-sm text-gray-500">{phoneData.recipientCarrier.carrier.name}</div>
                  )}
                </div>
              </div>
            )}

            {/* Transaction ID */}
            {paymentData.prepayId && (
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-sm font-mono text-gray-800">{paymentData.prepayId}</span>
              </div>
            )}

            {/* Order ID */}
            {paymentData.outBizId && (
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-gray-600">Order ID</span>
                <span className="text-sm font-mono text-gray-800">{paymentData.outBizId}</span>
              </div>
            )}

            {/* Status */}
            <div className="flex justify-between items-center pb-3">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-800">What's Next?</h3>
              <p className="text-xs text-blue-700 mt-1">
                The {bundle?.isCustom ? 'airtime' : 'bundle'} will be delivered to {phoneData?.recipientNumber} within a few minutes. 
                You'll receive a confirmation message once the transaction is complete.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleNewTransaction}
            className="w-full py-3 text-base font-semibold"
          >
            Make Another Purchase
          </Button>
          
          <button
            onClick={() => window.print()}
            className="w-full py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Print Receipt
          </button>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && paymentData && (
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Debug Info</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(paymentData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

