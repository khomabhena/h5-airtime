import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../src/utils/uiUtils.jsx';
import Button from '../components/ButtonV2';

const ConfirmationV2 = ({ phoneData, selectedBundle, paymentData }) => {
  const navigate = useNavigate();

  const handleNewTopup = () => {
    navigate('/v2');
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
    <div className="flex flex-col min-h-screen">
      {/* Main Content - Full Length */}
      <div className="bg-white shadow-lg border border-gray-100 w-full flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#662d9120'}}>
              <svg className="w-10 h-10" style={{color: '#662d91'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">
              Top-up Successful!
            </p>
            <p className="text-xs text-gray-600">
              Your airtime has been delivered successfully
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-white text-black rounded-xl shadow-md p-4 border border-gray-100 mb-6">
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
                <span style={{color: '#662d91'}}>{formatCurrency(safeSelectedBundle.price || 0)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="rounded-lg p-3" style={{backgroundColor: '#662d9120', borderColor: '#662d91'}}>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#662d91'}}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{color: '#662d91'}}>Delivered Successfully</p>
                <p className="text-xs" style={{color: '#662d91'}}>
                  {safeSelectedBundle.amount || 'Airtime'} has been added to {displayPhoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationV2;
