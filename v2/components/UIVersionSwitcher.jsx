/**
 * UI Version Switcher
 * Allows switching between V1 (original) and V2 (SuperApp style) UI
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UIVersionSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isV2 = location.pathname.startsWith('/v2');
  const currentVersion = isV2 ? 'v2' : 'v1';

  const switchToV1 = () => {
    // Map V2 routes to V1 routes
    if (location.pathname.includes('/v2/bundles')) {
      navigate('/bundles');
    } else if (location.pathname.includes('/v2/payment')) {
      navigate('/payment');
    } else {
      navigate('/');
    }
  };

  const switchToV2 = () => {
    // Map V1 routes to V2 routes
    if (location.pathname.includes('/bundles')) {
      navigate('/v2/bundles');
    } else if (location.pathname.includes('/payment')) {
      navigate('/v2/payment');
    } else {
      navigate('/v2');
    }
  };

  // Only show in development or with ?switcher=true
  if (process.env.NODE_ENV !== 'development' && !location.search.includes('switcher=true')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="text-xs font-semibold text-gray-600 mb-2">UI Version</div>
        <div className="flex space-x-2">
          <button
            onClick={switchToV1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentVersion === 'v1'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            V1 Original
          </button>
          <button
            onClick={switchToV2}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentVersion === 'v2'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            V2 SuperApp
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Current: <span className="font-semibold">{currentVersion.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default UIVersionSwitcher;

