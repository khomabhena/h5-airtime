/**
 * Bridge Status Indicator
 * Shows visual indicator of whether using real SuperApp bridge or mock
 * Displays at the top of the page
 */

import React, { useState, useEffect } from 'react';

const BridgeStatusIndicator = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const checkBridge = () => {
      const hasBridge = !!window.AppNativeJsBridge;
      const hasPayment = !!window.payment;
      const userAgent = navigator.userAgent;
      const hasCustomer = userAgent.includes('Customer');
      const hasPartner = userAgent.includes('Partner');
      
      // Check if it's the mock bridge
      const isMock = hasBridge && window.AppNativeJsBridge.postMessage.toString().includes('Mock');
      
      // Check if it's real SuperApp
      const isRealSuperApp = hasBridge && !isMock && (hasCustomer || hasPartner);
      
      setStatus({
        hasBridge,
        hasPayment,
        isMock,
        isRealSuperApp,
        hasCustomer,
        hasPartner,
        userAgent
      });
    };

    checkBridge();
    
    // Recheck every 2 seconds
    const interval = setInterval(checkBridge, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return null;
  }

  // Determine status type
  let statusType = 'browser'; // default: regular browser
  let statusColor = 'bg-gray-500';
  let statusIcon = '🌐';
  let statusText = 'Browser Mode';
  let statusDescription = 'No bridge detected';

  if (status.isRealSuperApp) {
    statusType = 'superapp';
    statusColor = 'bg-green-500';
    statusIcon = '✅';
    statusText = 'Real SuperApp';
    statusDescription = 'Using real SuperApp bridge';
  } else if (status.isMock) {
    statusType = 'mock';
    statusColor = 'bg-yellow-500';
    statusIcon = '🧪';
    statusText = 'Mock Mode';
    statusDescription = 'Using mock bridge for testing';
  }

  return (
    <div className={`fixed top-0 left-0 right-0 ${statusColor} text-white px-4 py-2 z-50 shadow-lg`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{statusIcon}</span>
          <div>
            <div className="font-bold text-sm">{statusText}</div>
            <div className="text-xs opacity-90">{statusDescription}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <span className={status.hasBridge ? '✅' : '❌'}></span>
            <span>Bridge</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={status.hasPayment ? '✅' : '❌'}></span>
            <span>Payment API</span>
          </div>
          {status.isMock && (
            <div className="bg-black bg-opacity-30 px-2 py-1 rounded text-xs">
              ⚠️ TEST DATA ONLY
            </div>
          )}
        </div>
      </div>
      
      {/* Details dropdown for development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer opacity-75 hover:opacity-100">
            🔍 Technical Details
          </summary>
          <div className="mt-2 bg-black bg-opacity-30 p-2 rounded font-mono space-y-1">
            <div>AppNativeJsBridge: {status.hasBridge ? '✅ Present' : '❌ Missing'}</div>
            <div>window.payment: {status.hasPayment ? '✅ Present' : '❌ Missing'}</div>
            <div>Bridge Type: {status.isMock ? '🧪 Mock' : status.isRealSuperApp ? '✅ Real' : '❌ None'}</div>
            <div>User Agent Has "Customer": {status.hasCustomer ? '✅' : '❌'}</div>
            <div>User Agent Has "Partner": {status.hasPartner ? '✅' : '❌'}</div>
            <div className="text-xs break-all opacity-75">
              UA: {status.userAgent.substring(0, 100)}...
            </div>
          </div>
        </details>
      )}
    </div>
  );
};

export default BridgeStatusIndicator;

