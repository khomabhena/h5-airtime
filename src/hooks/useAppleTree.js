/**
 * useAppleTree Hook
 * React hook for managing AppleTree VAS operations
 * Provides state management for products, services, and transactions
 */

import { useState, useCallback, useEffect } from 'react';
import { appleTreeService, Services } from '../services/appleTreeService';
import { errorHandler, APIError } from '../services/errorHandler';

export const useAppleTree = (defaultCountry = 'ZW') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /**
   * Load countries on mount
   */
  useEffect(() => {
    loadCountries();
  }, []);

  /**
   * Load all countries
   */
  const loadCountries = useCallback(async (useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.getCountries(useCache);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load countries');
      }

      setCountries(result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.loadCountries');
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
   * Load all services
   */
  const loadServices = useCallback(async (useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.getServices(useCache);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load services');
      }

      setServices(result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.loadServices');
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
   * Load products
   */
  const loadProducts = useCallback(async (filters, useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.getProducts(filters, useCache);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to load products');
      }

      setProducts(result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.loadProducts');
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
   * Load airtime products
   */
  const loadAirtimeProducts = useCallback(async (countryCode = defaultCountry) => {
    return loadProducts({
      countryCode,
      serviceId: Services.MOBILE_AIRTIME
    });
  }, [defaultCountry, loadProducts]);

  /**
   * Load data bundles
   */
  const loadDataBundles = useCallback(async (countryCode = defaultCountry) => {
    return loadProducts({
      countryCode,
      serviceId: Services.MOBILE_DATA
    });
  }, [defaultCountry, loadProducts]);

  /**
   * Load mobile bundles
   */
  const loadMobileBundles = useCallback(async (countryCode = defaultCountry) => {
    return loadProducts({
      countryCode,
      serviceId: Services.MOBILE_BUNDLES
    });
  }, [defaultCountry, loadProducts]);

  /**
   * Get product by ID
   */
  const getProductById = useCallback(async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.getProductById(productId);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get product');
      }

      setSelectedProduct(result.data);

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.getProductById');
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
   * Validate payment
   */
  const validatePayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.validatePayment(paymentData);

      if (!result.success) {
        throw new APIError(result.error || 'Payment validation failed');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.validatePayment');
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
   * Process payment
   */
  const processPayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.postPayment(paymentData);

      if (!result.success) {
        throw new APIError(result.error || 'Payment processing failed');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.processPayment');
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
   * Get payment status
   */
  const getPaymentStatus = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.getPaymentStatus(requestId);

      if (!result.success) {
        throw new APIError(result.error || 'Failed to get payment status');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.getPaymentStatus');
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
   * Test connection
   */
  const ping = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await appleTreeService.ping();

      if (!result.success) {
        throw new APIError(result.error || 'Connection test failed');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (err) {
      const formattedError = errorHandler.handle(err, 'useAppleTree.ping');
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
   * Reset state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setProducts([]);
    setSelectedProduct(null);
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    appleTreeService.clearCache();
  }, []);

  return {
    // State
    loading,
    error,
    countries,
    services,
    products,
    selectedProduct,

    // Actions
    loadCountries,
    loadServices,
    loadProducts,
    loadAirtimeProducts,
    loadDataBundles,
    loadMobileBundles,
    getProductById,
    validatePayment,
    processPayment,
    getPaymentStatus,
    ping,
    clearError,
    reset,
    clearCache,

    // Constants
    Services
  };
};

export default useAppleTree;

