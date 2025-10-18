// Color definitions for H5 Airtime App V2
// Purple theme for V2 experimental version

export const colorsV2 = {
  // App primary colors - Purple theme
  app: {
    primary: '#662d91',        // Main purple
    primaryLight: '#662d9120', // Light purple with opacity
    primaryDark: '#4d2270',    // Darker purple
  },

  // Text colors
  text: {
    primary: '#1f2937',    // Dark gray text
    secondary: '#6b7280',  // Medium gray text
    tertiary: '#9ca3af',   // Light gray text
    inverse: '#ffffff',    // White text
    black: '#000000',      // Black text
  },

  // Background colors
  background: {
    primary: '#ffffff',    // White background
    gray: {
      50: '#f9fafb',       // Very light gray
      100: '#f3f4f6',      // Light gray
    },
    gradient: {
      blue: 'from-blue-50 to-indigo-50',      // Blue gradient
      purple: 'from-purple-50 to-indigo-50',  // Purple gradient
    }
  },

  // Border colors
  border: {
    primary: '#e5e7eb',    // Light gray border
    secondary: '#d1d5db',  // Medium gray border
    accent: '#662d91',     // Purple border
    focus: '#662d91',      // Purple focus
    error: '#fca5a5',      // Light red border (red-300)
    blue: '#bfdbfe',       // Blue border (blue-200)
    purple: '#e9d5ff',     // Purple border (purple-200)
  },

  // State colors
  state: {
    success: '#10b981',    // Green for success
    error: '#ef4444',      // Red for error
    warning: '#f59e0b',    // Amber for warning
    info: '#3b82f6',       // Blue for info
    // Lighter versions
    successLight: '#86efac',  // green-400
    errorLight: '#fca5a5',    // red-300
  },

  // Ring/Focus colors
  ring: {
    primary: '#662d91',    // Purple focus ring
    error: '#ef4444',      // Red focus ring
  }
};

// Export default
export default colorsV2;

