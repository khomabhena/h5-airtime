import React from 'react';
import { colors } from '../../data/colors';

/**
 * ReusableButton - A single, comprehensive button component for all button types
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.selected - Whether button is in selected state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {'selection'|'card'|'action'|'outline'|'ghost'|'danger'|'success'} props.variant - Button variant
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Button size
 * @param {string} props.className - Additional CSS classes
 * @param {'button'|'submit'|'reset'} props.type - HTML button type
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Title for card variant
 * @param {string|number} props.price - Price for card variant
 * @param {string} props.subtitle - Subtitle for card variant
 * @param {string} props.description - Description for card variant
 * @param {boolean} props.showSelectionIndicator - Show selection indicator for card variant
 * @param {Object} props.customColors - Custom color scheme (overrides default colors)
 * @param {...Object} props.rest - Additional props passed to button element
 */
const ReusableButton = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  loading = false,
  variant = 'action',
  size = 'md',
  className = '',
  type = 'button',
  icon,
  // Card-specific props
  title,
  price,
  subtitle,
  description,
  showSelectionIndicator = true,
  // Custom colors prop
  customColors,
  ...rest
}) => {
  // Use custom colors if provided, otherwise use default colors
  const buttonColors = customColors || colors;
  const baseClasses = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  // Variant-specific styling
  const getVariantClasses = () => {
    const isSelected = selected;
    
    switch (variant) {
      case 'selection':
        return isSelected 
          ? `border-2 border-[${buttonColors.app.primary}] bg-[${buttonColors.app.primary}] text-white`
          : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50';
      
      case 'card':
        return isSelected 
          ? `border-2 border-[${buttonColors.app.primary}] bg-[${buttonColors.app.primary}] text-white rounded-xl`
          : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-xl';
      
      case 'action':
        return isSelected 
          ? `border-[${buttonColors.app.primary}] bg-[${buttonColors.app.primary}] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-[${buttonColors.app.primaryDark}]`
          : `bg-[${buttonColors.app.primary}] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-[${buttonColors.app.primaryDark}]`;
      
      case 'outline':
        return isSelected
          ? `border-2 border-[${buttonColors.app.primary}] bg-[${buttonColors.app.primary}] text-white`
          : `border-2 border-[${buttonColors.app.primary}] bg-transparent text-[${buttonColors.app.primary}] hover:bg-[${buttonColors.app.primary}] hover:text-white`;
      
      case 'ghost':
        return isSelected
          ? `bg-[${buttonColors.app.primary}] text-white`
          : 'bg-transparent text-gray-700 hover:bg-gray-100';
      
      case 'danger':
        return isSelected
          ? 'border-2 border-red-500 bg-red-500 text-white'
          : 'border-2 border-red-300 bg-white text-red-600 hover:border-red-400 hover:bg-red-50';
      
      case 'success':
        return isSelected
          ? 'border-2 border-green-500 bg-green-500 text-white'
          : 'border-2 border-green-300 bg-white text-green-600 hover:border-green-400 hover:bg-green-50';
      
      default:
        return `bg-[${buttonColors.app.primary}] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5`;
    }
  };
  
  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-2 px-3 text-xs rounded-lg';
      case 'md': return 'py-3 px-4 text-sm rounded-lg';
      case 'lg': return 'py-4 px-6 text-base rounded-xl';
      case 'xl': return 'py-5 px-8 text-lg rounded-2xl';
      default: return 'py-3 px-4 text-sm rounded-lg';
    }
  };
  
  // Disabled classes
  const disabledClasses = disabled || loading 
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed transform-none shadow-none hover:shadow-none border-gray-300' 
    : '';
  
  // Focus classes
  const getFocusClasses = () => {
    if (disabled || loading) return '';
    
    switch (variant) {
      case 'danger': return 'focus:ring-red-500';
      case 'success': return 'focus:ring-green-500';
      default: return `focus:ring-[${buttonColors.app.primary}]`;
    }
  };

  // Render content based on variant
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      );
    }

    // Card variant with rich content
    if (variant === 'card') {
      return (
        <div className="w-full text-left">
          {/* Header */}
          {(title || price) && (
            <div className="flex items-start justify-between mb-3">
              {title && (
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs font-bold truncate ${
                    selected ? 'text-white' : 'text-gray-800'
                  }`}>{title}</h3>
                </div>
              )}
              {price && (
                <div className="text-right ml-2 flex-shrink-0">
                  <div className={`text-sm font-bold ${
                    selected ? 'text-white' : 'text-emerald-600'
                  }`}>${price}</div>
                  <div className={`text-xs ${
                    selected ? 'text-white' : 'text-gray-500'
                  }`}>USD</div>
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="mb-3">
            {children && (
              <div className={`text-sm font-bold mb-1 ${
                selected ? 'text-white' : 'text-gray-800'
              }`}>
                {children}
              </div>
            )}
            {description && (
              <p className={`text-xs leading-relaxed ${
                selected ? 'text-white' : 'text-gray-600'
              }`}>{description}</p>
            )}
          </div>

          {/* Selection Indicator */}
          {selected && showSelectionIndicator && (
            <div className="flex items-center space-x-2 text-white">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-xs">Selected</span>
            </div>
          )}
        </div>
      );
    }

    // Selection variant with icon
    if (variant === 'selection' && icon) {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center">
            {icon}
          </div>
          <span className="text-xs font-medium">{children}</span>
        </div>
      );
    }

    // Default content
    return children;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabledClasses}
        ${getFocusClasses()}
        ${className}
      `}
      {...rest}
    >
      {renderContent()}
    </button>
  );
};

export default ReusableButton;
