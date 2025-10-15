/**
 * AppleTree Service Layer
 * Centralized service for managing VAS products (airtime, bundles, utilities)
 * Handles product catalog, payment validation, and transaction processing
 */

import AppleTreeGateway, { Services } from '../../h5-automation-api/appletree';

class AppleTreeService {
  constructor() {
    // Initialize AppleTree gateway with configuration
    this.gateway = new AppleTreeGateway({
      // Optional: Override default credentials if needed
      // merchantId: 'your-merchant-id',
      baseUrl: 'https://sandbox-dev.appletreepayments.com'
    });

    // Cache for products and services
    this.cache = {
      countries: null,
      services: null,
      products: new Map(),
      lastUpdate: null
    };

    // Cache duration (5 minutes)
    this.cacheDuration = 5 * 60 * 1000;
  }

  /**
   * Get all available countries
   * @param {boolean} useCache - Use cached data if available
   * @returns {Promise<Object>} Countries list
   */
  async getCountries(useCache = true) {
    try {
      // Check cache
      if (useCache && this.cache.countries && this.isCacheValid()) {
        return {
          success: true,
          data: this.cache.countries,
          source: 'cache'
        };
      }

      // Fetch from API
      const countries = await this.gateway.getCountries();
      
      // Update cache
      this.cache.countries = countries;
      this.cache.lastUpdate = Date.now();

      return {
        success: true,
        data: countries,
        source: 'api'
      };
    } catch (error) {
      console.error('Failed to get countries:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get all available services
   * @param {boolean} useCache - Use cached data if available
   * @returns {Promise<Object>} Services list
   */
  async getServices(useCache = true) {
    try {
      // Check cache
      if (useCache && this.cache.services && this.isCacheValid()) {
        return {
          success: true,
          data: this.cache.services,
          source: 'cache'
        };
      }

      // Fetch from API
      const services = await this.gateway.getServices();
      
      // Update cache
      this.cache.services = services;
      this.cache.lastUpdate = Date.now();

      return {
        success: true,
        data: services,
        source: 'api'
      };
    } catch (error) {
      console.error('Failed to get services:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get products for a specific country and service
   * @param {Object} filters - Product filters
   * @param {string} filters.countryCode - Country code (e.g., 'ZW')
   * @param {number} filters.serviceId - Service ID
   * @param {number} filters.serviceProviderId - Optional provider ID
   * @param {boolean} useCache - Use cached data if available
   * @returns {Promise<Object>} Products list
   */
  async getProducts(filters, useCache = true) {
    try {
      const cacheKey = `${filters.countryCode}_${filters.serviceId}_${filters.serviceProviderId || 'all'}`;

      // Check cache
      if (useCache && this.cache.products.has(cacheKey) && this.isCacheValid()) {
        return {
          success: true,
          data: this.cache.products.get(cacheKey),
          source: 'cache'
        };
      }

      // Fetch from API
      const products = await this.gateway.getProducts(filters);
      
      // Update cache
      this.cache.products.set(cacheKey, products);
      this.cache.lastUpdate = Date.now();

      return {
        success: true,
        data: products,
        source: 'api'
      };
    } catch (error) {
      console.error('Failed to get products:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get airtime products for a country
   * @param {string} countryCode - Country code (e.g., 'ZW')
   * @returns {Promise<Object>} Airtime products
   */
  async getAirtimeProducts(countryCode) {
    return this.getProducts({
      countryCode,
      serviceId: Services.MOBILE_AIRTIME
    });
  }

  /**
   * Get data bundle products for a country
   * @param {string} countryCode - Country code (e.g., 'ZW')
   * @returns {Promise<Object>} Data bundle products
   */
  async getDataBundles(countryCode) {
    return this.getProducts({
      countryCode,
      serviceId: Services.MOBILE_DATA
    });
  }

  /**
   * Get mobile bundle products for a country
   * @param {string} countryCode - Country code (e.g., 'ZW')
   * @returns {Promise<Object>} Mobile bundle products
   */
  async getMobileBundles(countryCode) {
    return this.getProducts({
      countryCode,
      serviceId: Services.MOBILE_BUNDLES
    });
  }

  /**
   * Get a specific product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProductById(productId) {
    try {
      const product = await this.gateway.getProductById(productId);
      
      return {
        success: true,
        data: product
      };
    } catch (error) {
      console.error('Failed to get product:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Get service providers for a country
   * @param {Object} filters - Provider filters
   * @param {string} filters.countryCode - Country code
   * @param {number} filters.serviceId - Service ID
   * @returns {Promise<Object>} Service providers
   */
  async getServiceProviders(filters) {
    try {
      const providers = await this.gateway.getServiceProviders(filters);
      
      return {
        success: true,
        data: providers
      };
    } catch (error) {
      console.error('Failed to get service providers:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Validate a payment before processing
   * @param {Object} paymentData - Payment data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validatePayment(paymentData) {
    try {
      const result = await this.gateway.validatePayment(paymentData);
      
      return {
        success: true,
        data: result,
        message: 'Payment validation successful'
      };
    } catch (error) {
      console.error('Payment validation failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Payment validation failed'
      };
    }
  }

  /**
   * Post a payment transaction
   * @param {Object} paymentData - Payment transaction data
   * @returns {Promise<Object>} Payment result
   */
  async postPayment(paymentData) {
    try {
      // Validate first
      const validation = await this.validatePayment(paymentData);
      
      if (!validation.success) {
        throw new Error('Payment validation failed: ' + validation.error);
      }

      // Process payment
      const result = await this.gateway.postPayment(paymentData);
      
      return {
        success: true,
        data: result,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Payment processing failed'
      };
    }
  }

  /**
   * Get payment status
   * @param {string} requestId - Payment request ID
   * @returns {Promise<Object>} Payment status
   */
  async getPaymentStatus(requestId) {
    try {
      const result = await this.gateway.getPaymentStatus(requestId);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Reverse a payment
   * @param {string} requestId - Payment request ID to reverse
   * @returns {Promise<Object>} Reversal result
   */
  async reversePayment(requestId) {
    try {
      const result = await this.gateway.reversePayment(requestId);
      
      return {
        success: true,
        data: result,
        message: 'Payment reversed successfully'
      };
    } catch (error) {
      console.error('Payment reversal failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Payment reversal failed'
      };
    }
  }

  /**
   * Get complete product catalog
   * @param {string} countryCode - Country code
   * @param {number} serviceId - Service ID
   * @returns {Promise<Object>} Complete catalog
   */
  async getProductCatalog(countryCode, serviceId) {
    try {
      const catalog = await this.gateway.getProductCatalog(countryCode, serviceId);
      
      return {
        success: true,
        data: catalog
      };
    } catch (error) {
      console.error('Failed to get product catalog:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Ping the AppleTree API
   * @returns {Promise<Object>} Connection status
   */
  async ping() {
    try {
      const result = await this.gateway.ping();
      
      return {
        success: true,
        data: result,
        message: 'Connection successful'
      };
    } catch (error) {
      console.error('Connection failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Connection failed'
      };
    }
  }

  /**
   * Build payment data object
   * @param {Object} options - Payment options
   * @returns {Object} Formatted payment data
   */
  buildPaymentData(options) {
    return {
      RequestId: options.requestId || AppleTreeGateway.generateRequestId(),
      ProductId: options.productId,
      Amount: options.amount,
      Currency: options.currency || 'USD',
      CustomerDetails: options.customerDetails || {},
      CreditPartyIdentifiers: options.creditPartyIdentifiers || [],
      DebitPartyIdentifiers: options.debitPartyIdentifiers || []
    };
  }

  /**
   * Check if cache is still valid
   * @returns {boolean} True if cache is valid
   */
  isCacheValid() {
    if (!this.cache.lastUpdate) return false;
    return (Date.now() - this.cache.lastUpdate) < this.cacheDuration;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {
      countries: null,
      services: null,
      products: new Map(),
      lastUpdate: null
    };
  }

  /**
   * Get configuration
   * @returns {Object} Current configuration
   */
  getConfiguration() {
    return {
      merchantId: this.gateway.merchantId,
      baseUrl: this.gateway.baseUrl,
      apiVersion: this.gateway.apiVersion
    };
  }
}

// Export singleton instance
export const appleTreeService = new AppleTreeService();

// Export Services constants
export { Services };

// Export class for testing or multiple instances
export default AppleTreeService;

