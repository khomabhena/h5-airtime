import React from 'react';
import { colors } from '../../data/colors';

const BaseButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  selected = false,
  ...props
}) => {
  const baseClasses = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  const variantClasses = {
    primary: selected 
      ? `border-[${colors.app.primary}] bg-[${colors.app.primary}] text-white`
      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
    secondary: selected
      ? `border-[${colors.app.primary}] bg-[${colors.app.primary}] text-white`
      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
    outline: selected
      ? `border-[${colors.app.primary}] bg-[${colors.app.primary}] text-white`
      : `border-[${colors.app.primary}] bg-transparent text-[${colors.app.primary}] hover:bg-[${colors.app.primary}] hover:text-white`,
    ghost: selected
      ? `bg-[${colors.app.primary}] text-white`
      : 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: selected
      ? 'border-red-500 bg-red-500 text-white'
      : 'border-red-300 bg-white text-red-600 hover:border-red-400 hover:bg-red-50',
    success: selected
      ? 'border-green-500 bg-green-500 text-white'
      : 'border-green-300 bg-white text-green-600 hover:border-green-400 hover:bg-green-50'
  };
  
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm rounded-lg',
    md: 'py-3 px-4 text-base rounded-lg',
    lg: 'py-4 px-6 text-lg rounded-xl',
    xl: 'py-5 px-8 text-xl rounded-2xl'
  };
  
  const disabledClasses = disabled || loading 
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed transform-none shadow-none hover:shadow-none border-gray-300' 
    : '';
  
  const focusClasses = {
    primary: `focus:ring-[${colors.app.primary}]`,
    secondary: `focus:ring-[${colors.app.primary}]`,
    outline: `focus:ring-[${colors.app.primary}]`,
    ghost: `focus:ring-[${colors.app.primary}]`,
    danger: 'focus:ring-red-500',
    success: 'focus:ring-green-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${!disabled && !loading ? focusClasses[variant] : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default BaseButton;
