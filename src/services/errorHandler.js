/**
 * Error Handler Service
 * Centralized error handling for payment and API operations
 * Provides consistent error formatting and user-friendly messages
 */

// Error types
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  PAYMENT: 'PAYMENT_ERROR',
  AUTH: 'AUTH_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, severity = ErrorSeverity.MEDIUM, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/**
 * Payment-specific error class
 */
export class PaymentError extends AppError {
  constructor(message, details = null) {
    super(message, ErrorTypes.PAYMENT, ErrorSeverity.HIGH, details);
    this.name = 'PaymentError';
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, ErrorTypes.VALIDATION, ErrorSeverity.LOW, details);
    this.name = 'ValidationError';
  }
}

/**
 * API error class
 */
export class APIError extends AppError {
  constructor(message, details = null) {
    super(message, ErrorTypes.API, ErrorSeverity.MEDIUM, details);
    this.name = 'APIError';
  }
}

/**
 * Network error class
 */
export class NetworkError extends AppError {
  constructor(message, details = null) {
    super(message, ErrorTypes.NETWORK, ErrorSeverity.HIGH, details);
    this.name = 'NetworkError';
  }
}

/**
 * Error Handler Service
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.listeners = [];
  }

  /**
   * Handle and format errors
   * @param {Error} error - Error to handle
   * @param {string} context - Context where error occurred
   * @returns {Object} Formatted error
   */
  handle(error, context = 'Unknown') {
    const formattedError = this.formatError(error, context);
    
    // Log error
    this.logError(formattedError);
    
    // Notify listeners
    this.notifyListeners(formattedError);
    
    return formattedError;
  }

  /**
   * Format error into consistent structure
   * @param {Error} error - Error to format
   * @param {string} context - Context where error occurred
   * @returns {Object} Formatted error
   */
  formatError(error, context) {
    const formatted = {
      context,
      timestamp: new Date().toISOString(),
      message: this.getUserFriendlyMessage(error),
      technicalMessage: error.message,
      type: this.determineErrorType(error),
      severity: this.determineSeverity(error),
      details: error.details || null,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    };

    return formatted;
  }

  /**
   * Determine error type
   * @param {Error} error - Error to analyze
   * @returns {string} Error type
   */
  determineErrorType(error) {
    if (error instanceof AppError) {
      return error.type;
    }

    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return ErrorTypes.NETWORK;
    }

    if (message.includes('timeout')) {
      return ErrorTypes.TIMEOUT;
    }

    if (message.includes('payment') || message.includes('cashier')) {
      return ErrorTypes.PAYMENT;
    }

    if (message.includes('auth') || message.includes('token')) {
      return ErrorTypes.AUTH;
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorTypes.VALIDATION;
    }

    if (message.includes('api') || message.includes('http')) {
      return ErrorTypes.API;
    }

    return ErrorTypes.UNKNOWN;
  }

  /**
   * Determine error severity
   * @param {Error} error - Error to analyze
   * @returns {string} Error severity
   */
  determineSeverity(error) {
    if (error instanceof AppError) {
      return error.severity;
    }

    const type = this.determineErrorType(error);

    switch (type) {
      case ErrorTypes.PAYMENT:
      case ErrorTypes.NETWORK:
        return ErrorSeverity.HIGH;
      
      case ErrorTypes.API:
      case ErrorTypes.TIMEOUT:
        return ErrorSeverity.MEDIUM;
      
      case ErrorTypes.VALIDATION:
        return ErrorSeverity.LOW;
      
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  /**
   * Get user-friendly error message
   * @param {Error} error - Error to convert
   * @returns {string} User-friendly message
   */
  getUserFriendlyMessage(error) {
    const type = this.determineErrorType(error);

    const messages = {
      [ErrorTypes.NETWORK]: 'Unable to connect to the server. Please check your internet connection and try again.',
      [ErrorTypes.PAYMENT]: 'Payment processing failed. Please try again or contact support if the problem persists.',
      [ErrorTypes.API]: 'Service temporarily unavailable. Please try again in a moment.',
      [ErrorTypes.AUTH]: 'Authentication failed. Please log in again.',
      [ErrorTypes.TIMEOUT]: 'Request timed out. Please try again.',
      [ErrorTypes.VALIDATION]: error.message, // Show validation errors directly
      [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    };

    return messages[type] || messages[ErrorTypes.UNKNOWN];
  }

  /**
   * Log error to internal log
   * @param {Object} error - Formatted error
   */
  logError(error) {
    this.errorLog.unshift(error);
    
    // Maintain max log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.context}]`, error);
    }
  }

  /**
   * Add error listener
   * @param {Function} callback - Callback function
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove error listener
   * @param {Function} callback - Callback to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners
   * @param {Object} error - Formatted error
   */
  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  /**
   * Get error log
   * @param {number} limit - Maximum number of errors to return
   * @returns {Array} Error log
   */
  getErrorLog(limit = 10) {
    return this.errorLog.slice(0, limit);
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getStatistics() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      bySeverity: {},
      recent: this.errorLog.slice(0, 5)
    };

    this.errorLog.forEach(error => {
      // Count by type
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      
      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }

  /**
   * Retry failed operation
   * @param {Function} operation - Operation to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in ms
   * @returns {Promise} Operation result
   */
  async retry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Exponential backoff
        delay *= 2;
      }
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export class for testing
export default ErrorHandler;

