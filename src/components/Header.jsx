import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [fullUrl, setFullUrl] = useState('');
  
  const isHomePage = location.pathname === '/';
  const showBackButton = !isHomePage;

  // Extract token from URL parameters and store full URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
    
    // Store the full URL
    setFullUrl(window.location.href);
  }, [location.search, location.pathname]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button - Only show on non-home pages */}
          {showBackButton && (
            <div
              onClick={handleBackClick}
              className=" invisible flex items-center bg-red- justify-center w-10 h-10 rounded border-0 outline-none hover:bg-gray-50 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" style={{color: '#8dd000'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}
            
          {/* Logo - Centered or offset based on back button */}
          <div className={`flex flex-col items-center ${showBackButton ? 'ml-0' : 'mx-auto'}`}>
            <img 
              src="/tapseed-logo-full.png" 
              alt="TapSeed" 
              className="h-8 w-auto"
            />
            {/* Display URL and token if available */}
            <div className="mt-1 space-y-1">
              {/* Full URL */}
              <div className="px-2 py-1 bg-blue-50 rounded text-xs text-blue-700 font-mono break-all">
                {/* <span className="font-semibold">URL:</span> {fullUrl} */}
              </div>
              
              {/* Token */}
              {token && (
                <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                  {/* <span className="font-semibold">Token:</span> {token} */}
                </div>
              )}
            </div>
          </div>
          
          {/* Spacer for back button alignment */}
          {showBackButton && (
            <div className="w-10"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
