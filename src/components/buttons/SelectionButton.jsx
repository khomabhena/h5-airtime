import React from 'react';
import BaseButton from './BaseButton';

const SelectionButton = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  loading = false,
  size = 'md',
  className = '',
  icon,
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
      className={`border-2 ${className}`}
      {...props}
    >
      <div className="flex flex-col items-center space-y-2">
        {icon && (
          <div className="flex items-center justify-center">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium">{children}</span>
      </div>
    </BaseButton>
  );
};

export default SelectionButton;
