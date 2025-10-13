import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === '/';
  const showBackButton = !isHomePage;

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
              className=" hidden flex items-center bg-red- justify-center w-10 h-10 rounded border-0 outline-none hover:bg-gray-50 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" style={{color: '#8dd000'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}
            
          {/* Logo - Centered or offset based on back button */}
          <div className={`flex items-center ${showBackButton ? 'ml-0' : 'mx-auto'}`}>
            <img 
              src="/tapseed-logo-full.png" 
              alt="TapSeed" 
              className="h-8 w-auto"
            />
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
