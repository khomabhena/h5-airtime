/**
 * usePayment Hook
 * React hook for managing payment operations
 * Provides state management, error handling, and payment processing
 */

import { useState, useCallback, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { errorHandler, PaymentError } from '../services/errorHandler';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPaymentAPIAvailable, setIsPaymentAPIAvailable] = useState(false);

  // Check if payment API is available
  useEffect(() => {
    setIsPaymentAPIAvailable(paymentService.isPaymentAPIAvailable());
  }, []);

  /**
   * Process payment (complete flow)
   */
  const processPayment = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    setPaymentData(null);

    try {
      const result = await paymentService.processPayment(orderData);

      if (!result.success) {
        throw new PaymentError(result.error || 'Payment processing failed');
      }

      setPaymentData(result.data);
      setPaymentStatus('success');

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'usePayment.processPayment');
      setError(formattedError);
      setPaymentStatus('failed');

      return {
        success: false,
        error: formattedError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Prepare payment (without showing cashier)
   */
  const preparePayment = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.preparePayment(orderData);

      if (!result.success) {
        throw new PaymentError(result.error || 'Payment preparation failed');
      }

      setPaymentData(result.data);
      setPaymentStatus('prepared');

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'usePayment.preparePayment');
      setError(formattedError);

      return {
        success: false,
        error: formattedError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Show payment cashier
   */
  const showCashier = useCallback(async (paymentParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.showCashier(paymentParams);

      if (!result.success) {
        throw new PaymentError(result.error || 'Failed to show cashier');
      }

      setPaymentStatus('processing');

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'usePayment.showCashier');
      setError(formattedError);
      setPaymentStatus('failed');

      return {
        success: false,
        error: formattedError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Query payment status
   */
  const queryStatus = useCallback(async (outBizId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.queryPaymentStatus(outBizId);

      if (!result.success) {
        throw new PaymentError(result.error || 'Failed to query payment status');
      }

      setPaymentStatus(result.data.status || 'unknown');

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'usePayment.queryStatus');
      setError(formattedError);

      return {
        success: false,
        error: formattedError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get authentication token
   */
  const getAuthToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.getAuthToken();

      if (!result.success) {
        throw new PaymentError(result.error || 'Failed to get auth token');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'usePayment.getAuthToken');
      setError(formattedError);

      return {
        success: false,
        error: formattedError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset payment state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentData(null);
    setPaymentStatus(null);
    paymentService.clearActivePayment();
  }, []);

  /**
   * Get payment history
   */
  const getHistory = useCallback(() => {
    return paymentService.getPaymentHistory();
  }, []);

  /**
   * Get active payment
   */
  const getActivePayment = useCallback(() => {
    return paymentService.getActivePayment();
  }, []);

  return {
    // State
    loading,
    error,
    paymentData,
    paymentStatus,
    isPaymentAPIAvailable,

    // Actions
    processPayment,
    preparePayment,
    showCashier,
    queryStatus,
    getAuthToken,
    clearError,
    reset,
    getHistory,
    getActivePayment
  };
};

export default usePayment;

