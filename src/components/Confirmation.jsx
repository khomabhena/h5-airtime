import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/uiUtils.jsx';
import Button from './Button';

const Confirmation = ({ phoneData, selectedBundle, paymentData }) => {
  const navigate = useNavigate();

  const handleNewTopup = () => {
    navigate('/');
  };

  // Fallback data when props are missing
  const safePhoneData = phoneData || {};
  const safeSelectedBundle = selectedBundle || {};
  const safePaymentData = paymentData || {};

  // Generate fallback transaction ID if missing
  const transactionId = safePaymentData.transactionId || `TXN${Date.now()}`;
  
  // Format phone number for display
  const displayPhoneNumber = safePhoneData.recipientNumber || safePhoneData.phoneNumber || 'N/A';
  
  // Get carrier name safely
  const carrierName = safePhoneData.recipientCarrier?.name || 
                     safePhoneData.carrier?.name || 
                     safePhoneData.carrier?.carrier?.name || 
                     'Unknown Carrier';

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-bold text-gray-800 mb-2">
          Top-up Successful!
        </p>
        <p className="text-sm text-gray-600">
          Your airtime has been delivered successfully
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-white text-black rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Transaction Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-mono text-xs">{transactionId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Recipient</span>
            <span className="font-medium">{displayPhoneNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carrier</span>
            <span className="font-medium">{carrierName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bundle</span>
            <span className="font-medium">{safeSelectedBundle.name || 'Standard Airtime'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">{safeSelectedBundle.amount || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium capitalize">{safePaymentData.method || 'Card'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between text-base font-bold">
            <span>Total Paid</span>
            <span className="text-emerald-600">{formatCurrency(safeSelectedBundle.price || 0)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Status */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Delivered Successfully</p>
            <p className="text-xs text-emerald-600">
              {safeSelectedBundle.amount || 'Airtime'} has been added to {displayPhoneNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleNewTopup}
          size="sm"
          className="w-full"
        >
          Send Another
        </Button>
        <Button
          onClick={() => window.print()}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          Print Receipt
        </Button>
      </div>

      {/* Share Success */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <div>
            <p className="font-medium text-blue-800 text-sm">Share the love!</p>
            <p className="text-xs text-blue-600">
              Let others know about our fast and secure airtime service
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="text-center">
        <p className="text-gray-600 mb-2 text-sm">Need help?</p>
        <div className="flex justify-center space-x-3">
          <button className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">
            Contact Support
          </button>
          <button className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">
            View Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;