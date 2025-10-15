/**
 * SuperApp Debug Component
 * Displays available SuperApp APIs and environment info
 * Only shows in development mode
 */

import React, { useState, useEffect } from 'react';
import { webViewBridge } from '../utils/webViewBridge';

const SuperAppDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const checkSuperApp = () => {
      const bridgeInfo = webViewBridge.getDebugInfo();
      
      const info = {
        hasWindow: typeof window !== 'undefined',
        hasPayment: typeof window !== 'undefined' && !!window.payment,
        paymentMethods: [],
        windowKeys: [],
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
        url: typeof window !== 'undefined' ? window.location.href : 'N/A',
        // WebView bridge info
        platform: bridgeInfo.platform,
        isWebView: bridgeInfo.isWebView,
        bridges: bridgeInfo.bridges,
        paymentBridge: bridgeInfo.paymentBridge
      };

      if (typeof window !== 'undefined') {
        // Find all payment-related keys
        info.windowKeys = Object.keys(window).filter(k => 
          k.toLowerCase().includes('pay') || 
          k.toLowerCase().includes('super') ||
          k.toLowerCase().includes('app') ||
          k.toLowerCase().includes('bridge') ||
          k.toLowerCase().includes('webkit') ||
          k.toLowerCase().includes('android') ||
          k.toLowerCase().includes('native')
        );

        // Check payment object
        if (window.payment) {
          info.paymentMethods = Object.keys(window.payment);
          info.paymentType = typeof window.payment;
        }

        // Check for common SuperApp APIs
        info.apis = {
          payment: !!window.payment,
          getAuthToken: !!(window.payment?.getAuthToken),
          payOrder: !!(window.payment?.payOrder),
          webkit: !!window.webkit,
          android: !!window.android,
          superapp: !!window.superapp,
          ReactNativeWebView: !!window.ReactNativeWebView
        };
      }

      setDebugInfo(info);
    };

    checkSuperApp();

    // Recheck every 2 seconds in case API loads later
    const interval = setInterval(checkSuperApp, 2000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' && !window.location.search.includes('debug=true')) {
    return null;
  }

  if (!debugInfo) {
    return <div className="p-4 bg-gray-100">Loading debug info...</div>;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 text-white p-4 text-xs font-mono max-h-64 overflow-auto z-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm">🔧 SuperApp Debug Panel</h3>
        <button
          onClick={() => {
            const elem = document.getElementById('superapp-debug');
            if (elem) elem.style.display = 'none';
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {/* Payment API Status */}
        <div className="flex items-center space-x-2">
          <span className={debugInfo.hasPayment ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.hasPayment ? '✅' : '❌'}
          </span>
          <span className="font-semibold">window.payment:</span>
          <span className={debugInfo.hasPayment ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.hasPayment ? 'AVAILABLE' : 'NOT FOUND'}
          </span>
        </div>

        {/* Payment Methods */}
        {debugInfo.hasPayment && debugInfo.paymentMethods.length > 0 && (
          <div>
            <span className="text-blue-400">Payment Methods:</span>
            <div className="ml-4 text-green-400">
              {debugInfo.paymentMethods.map(method => (
                <div key={method}>• {method}</div>
              ))}
            </div>
          </div>
        )}

        {/* Platform & WebView Info */}
        <div>
          <span className="text-blue-400">Platform:</span>
          <span className="ml-2 text-yellow-400">{debugInfo.platform || 'unknown'}</span>
          {debugInfo.isWebView && <span className="ml-2 text-green-400">(WebView Detected)</span>}
        </div>

        {/* WebView Bridges */}
        {debugInfo.bridges && debugInfo.bridges.length > 0 && (
          <div>
            <span className="text-blue-400">Detected Bridges:</span>
            <div className="ml-4">
              {debugInfo.bridges.map((bridge, idx) => (
                <div key={idx} className="text-green-400 text-xs">
                  • {bridge.name} ({bridge.type})
                  {bridge.methods && bridge.methods.length > 0 && (
                    <div className="ml-4 text-gray-400">
                      Methods: {bridge.methods.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Bridge */}
        {debugInfo.paymentBridge && (
          <div className="bg-green-900 bg-opacity-30 p-2 rounded">
            <span className="text-green-400">💳 Active Payment Bridge:</span>
            <div className="ml-4 text-xs">
              <div className="text-white">{debugInfo.paymentBridge.name}</div>
              <div className="text-gray-400">Type: {debugInfo.paymentBridge.type}</div>
              {debugInfo.paymentBridge.paymentMethods && (
                <div className="text-yellow-400">
                  Payment Methods: {debugInfo.paymentBridge.paymentMethods.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available APIs */}
        <div>
          <span className="text-blue-400">SuperApp APIs:</span>
          <div className="ml-4 grid grid-cols-2 gap-1">
            {Object.entries(debugInfo.apis || {}).map(([api, available]) => (
              <div key={api}>
                <span className={available ? 'text-green-400' : 'text-gray-500'}>
                  {available ? '✓' : '✗'}
                </span>
                {' '}{api}
              </div>
            ))}
          </div>
        </div>

        {/* Window Keys */}
        {debugInfo.windowKeys && debugInfo.windowKeys.length > 0 && (
          <div>
            <span className="text-blue-400">Payment-related window keys:</span>
            <div className="ml-4 text-yellow-400">
              {debugInfo.windowKeys.join(', ') || 'None found'}
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="text-gray-400">User Agent:</div>
          <div className="ml-4 text-xs break-all">{debugInfo.userAgent}</div>
          <div className="text-gray-400 mt-1">URL:</div>
          <div className="ml-4 text-xs break-all">{debugInfo.url}</div>
        </div>

        {/* Test Buttons */}
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="text-blue-400 mb-1">Quick Tests:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={async () => {
                try {
                  if (window.payment?.getAuthToken) {
                    const result = await window.payment.getAuthToken();
                    alert('✅ Auth Token: ' + JSON.stringify(result, null, 2));
                  } else {
                    alert('❌ getAuthToken not available');
                  }
                } catch (err) {
                  alert('❌ Error: ' + err.message);
                }
              }}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
              disabled={!debugInfo.hasPayment}
            >
              Test Auth Token
            </button>
            
            <button
              onClick={() => {
                console.log('=== SuperApp Debug Info ===');
                console.log('window.payment:', window.payment);
                console.log('Full debug info:', debugInfo);
                alert('Check browser console for details');
              }}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
            >
              Log to Console
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
                alert('Debug info copied to clipboard!');
              }}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
            >
              Copy Debug Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAppDebug;

