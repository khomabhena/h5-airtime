import React from 'react';
import BaseButton from './BaseButton';

const CardButton = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  loading = false,
  size = 'md',
  className = '',
  title,
  subtitle,
  price,
  description,
  icon,
  showSelectionIndicator = true,
  ...props
}) => {
  return (
    <BaseButton
      onClick={onClick}
      selected={selected}
      disabled={disabled}
      loading={loading}
      size={size}
      variant="primary"
      className={`border-2 rounded-xl p-3 text-left ${className}`}
      {...props}
    >
      <div className="w-full">
        {/* Header */}
        {(title || price) && (
          <div className="flex items-start justify-between mb-3">
            {title && (
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-bold truncate ${
                  selected ? 'text-white' : 'text-gray-800'
                }`}>{title}</h3>
              </div>
            )}
            {price && (
              <div className="text-right ml-2 flex-shrink-0">
                <div className={`text-base font-bold ${
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
            <div className={`text-lg font-bold mb-1 ${
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
            <span className="font-medium text-sm">Selected</span>
          </div>
        )}
      </div>
    </BaseButton>
  );
};

export default CardButton;
