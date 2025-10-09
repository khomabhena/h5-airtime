import React from 'react';

const InputField = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  loading = false,
  icon,
  rightIcon,
  className = '',
  disabled = false,
  required = false,
  showCountryMap = false,
  countryData = null,
  showCardType = false,
  cardTypeData = null,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full border-2 border-emerald-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base transition-all duration-200 ${
            icon ? 'pl-12' : 'pl-4'
          } ${rightIcon ? 'pr-12' : 'pr-4'} ${
            error ? 'border-red-300 focus:ring-red-500' : ''
          } ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } py-3`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {rightIcon}
          </div>
        )}
        
        {/* Card Type Detection Display */}
        {showCardType && cardTypeData && cardTypeData.cardType !== 'unknown' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <div 
              className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs"
              style={{ backgroundColor: cardTypeData.cardTypeColor + '20' }}
            >
              <span 
                className="font-medium"
                style={{ color: cardTypeData.cardTypeColor }}
              >
                {cardTypeData.cardTypeName}
              </span>
              <span className="text-sm">💳</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Country Map Display Section */}
      {showCountryMap && countryData && (
        <div className="mt-3 space-y-2">
          {/* Country Information */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="text-2xl" style={{fontSize: '24px'}}>{countryData.flag}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm">{countryData.countryName}</h4>
                <p className="text-xs text-gray-600">Calling Code: {countryData.callingCode}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Network Coverage</div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-600 ml-1">Good</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carrier Information */}
          {countryData.carrier && (
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md"
                  style={{ backgroundColor: countryData.carrier.logoColor }}
                >
                  {countryData.carrier.logoText}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm">{countryData.carrier.name}</h4>
                  <p className="text-xs text-emerald-600">Network: {countryData.carrier.networkType}</p>
                  <p className="text-xs text-gray-600">Coverage: {countryData.carrier.coverage}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Services</div>
                  <div className="text-xs text-gray-600">
                    {countryData.carrier.services.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputField;
