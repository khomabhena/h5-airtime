// Color definitions for H5 Airtime App
// Centralized color management for consistent theming

export const colors = {
  

  // Custom app colors
  app: {
    primary: '#8dd000',      // Main app green
    primaryLight: '#8dd00020', // Light version with opacity
    primaryDark: '#6ba300',   // Darker version
    accent: '#10b981',       // Emerald accent
    success: '#10b981',       // Success color
    warning: '#f59e0b',       // Warning color
    error: '#ef4444',         // Error color
    info: '#3b82f6',          // Info color
  },

  // Neutral colors
  neutral: {
    50: '#fafafa',    // Very light gray
    100: '#f5f5f5',   // Light gray
    200: '#e5e5e5',   // Light gray
    300: '#d4d4d4',   // Medium light gray
    400: '#a3a3a3',   // Medium gray
    500: '#737373',   // Gray
    600: '#525252',   // Dark gray
    700: '#404040',   // Darker gray
    800: '#262626',   // Very dark gray
    900: '#171717',   // Darkest gray
  },

  // Semantic colors
  semantic: {
    success: '#10b981',       // Success green
    warning: '#f59e0b',       // Warning amber
    error: '#ef4444',         // Error red
    info: '#3b82f6',          // Info blue
    successLight: '#d1fae5',  // Light success
    warningLight: '#fef3c7',  // Light warning
    errorLight: '#fee2e2',   // Light error
    infoLight: '#dbeafe',    // Light info
  },

  // Background colors
  background: {
    primary: '#ffffff',       // White background
    secondary: '#f8fafc',    // Light gray background
    tertiary: '#f1f5f9',     // Very light gray background
    dark: '#1a1a1a',         // Dark background
    card: '#ffffff',         // Card background
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },

  // Text colors
  text: {
    primary: '#1f2937',       // Dark gray text
    secondary: '#6b7280',    // Medium gray text
    tertiary: '#9ca3af',     // Light gray text
    inverse: '#ffffff',      // White text
    muted: '#6b7280',        // Muted text
    disabled: '#9ca3af',     // Disabled text
  },

  // Border colors
  border: {
    primary: '#e5e7eb',       // Light gray border
    secondary: '#d1d5db',     // Medium gray border
    accent: '#8dd000',        // Primary green border
    focus: '#8dd000',         // Focus border
    error: '#ef4444',         // Error border
    success: '#10b981',       // Success border
  },

  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
    colored: 'rgba(141, 208, 0, 0.2)',
  }
};

// Tailwind color mappings for easy reference
export const tailwindColors = {
  emerald: colors.primary,
  green: colors.green,
  gray: colors.neutral,
  red: {
    500: colors.semantic.error,
    100: colors.semantic.errorLight,
  },
  blue: {
    500: colors.semantic.info,
    100: colors.semantic.infoLight,
  },
  amber: {
    500: colors.semantic.warning,
    100: colors.semantic.warningLight,
  },
};

// Button color schemes
export const buttonColors = {
  primary: {
    background: colors.app.primary,
    backgroundHover: colors.app.primaryDark,
    text: colors.text.inverse,
    border: colors.app.primary,
  },
  secondary: {
    background: colors.background.primary,
    backgroundHover: colors.primary[50],
    text: colors.text.primary,
    border: colors.border.primary,
  },
  success: {
    background: colors.semantic.success,
    backgroundHover: colors.primary[700],
    text: colors.text.inverse,
    border: colors.semantic.success,
  },
  outline: {
    background: 'transparent',
    backgroundHover: colors.primary[50],
    text: colors.app.primary,
    border: colors.app.primary,
  },
};

// Status colors for different states
export const statusColors = {
  active: colors.semantic.success,
  inactive: colors.neutral[400],
  pending: colors.semantic.warning,
  error: colors.semantic.error,
  loading: colors.semantic.info,
};

// Export default colors object
export default colors;
