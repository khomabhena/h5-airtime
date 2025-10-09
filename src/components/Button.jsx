import React from 'react';

const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
  };
  
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm rounded-lg',
    md: 'py-3 px-4 text-base rounded-lg',
    lg: 'py-4 px-6 text-lg rounded-xl'
  };
  
  const disabledClasses = disabled || loading 
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed transform-none shadow-none hover:shadow-none' 
    : '';
  
  const focusClasses = {
    primary: 'focus:ring-emerald-500',
    secondary: 'focus:ring-gray-500',
    danger: 'focus:ring-red-500',
    success: 'focus:ring-green-500',
    ghost: 'focus:ring-emerald-500'
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

export default Button;
