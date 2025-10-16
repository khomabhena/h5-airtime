/**
 * Payment Service Layer
 * Centralized service for managing SuperApp payments
 * Handles order creation, payment processing, and status tracking
 */

import SuperAppPayment from '../../h5-automation-api/superapp/SuperAppPayment';
import { webViewBridge } from '../utils/webViewBridge';

class PaymentService {
  constructor() {
    // Initialize SuperApp payment with configuration
    this.superApp = new SuperAppPayment({
      // Optional: Override default credentials if needed
      // merchantId: 'your-merchant-id',
      // appId: 'your-app-id',
      notifyUrl: window.location.origin + '/api/payment/notify',
      redirectUrl: window.location.origin + '/payment/success'
    });

    // Payment history for tracking
    this.paymentHistory = [];
    
    // Active payment tracking
    this.activePayment = null;
  }

  /**
   * Create and prepare a payment order
   * @param {Object} orderData - Payment order details
   * @param {number} orderData.amount - Amount in cents (e.g., 100 = $1.00)
   * @param {string} orderData.currency - Currency code (e.g., 'USD')
   * @param {string} orderData.description - Payment description
   * @param {string} orderData.callbackInfo - Optional callback information
   * @returns {Promise<Object>} Payment preparation result
   */
  async preparePayment(orderData) {
    try {
      // Validate input
      this.validateOrderData(orderData);

      // Generate unique order ID
      const outBizId = SuperAppPayment.generateOrderId('AIRTIME-');

      // Prepare payment with SuperApp
      const result = await this.superApp.preparePayment({
        ...orderData,
        outBizId,
        timeExpire: SuperAppPayment.calculateExpiryTime(30) // 30 minutes
      });

      // Track active payment
      this.activePayment = {
        outBizId: result.outBizId,
        prepayId: result.prepayId,
        amount: orderData.amount,
        currency: orderData.currency,
        description: orderData.description,
        status: 'prepared',
        createdAt: new Date().toISOString()
      };

      // Add to history
      this.paymentHistory.push({ ...this.activePayment });

      return {
        success: true,
        data: result,
        message: 'Payment prepared successfully'
      };
    } catch (error) {
      console.error('Payment preparation failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to prepare payment'
      };
    }
  }

  /**
   * Show the payment cashier to the user
   * @param {Object} paymentParams - Payment parameters from preparePayment
   * @returns {Promise<Object>} Cashier result
   */
  async showCashier(paymentParams) {
    try {
      // Update active payment status
      if (this.activePayment) {
        this.activePayment.status = 'processing';
      }

      // Try to show cashier using WebView bridge
      let result;
      
      try {
        // Try standard window.payment first
        if (window.payment?.payOrder) {
          console.log('🎯 Using window.payment.payOrder');
          result = await window.payment.payOrder(paymentParams);
        } else {
          // Try WebView bridge
          console.log('🌉 Using WebView bridge for payOrder');
          result = await webViewBridge.payOrder(paymentParams);
        }
      } catch (bridgeError) {
        console.error('Bridge error:', bridgeError);
        throw new Error(`Payment bridge failed: ${bridgeError.message}`);
      }

      // Update status based on result
      if (this.activePayment) {
        this.activePayment.status = result.success ? 'completed' : 'failed';
        this.activePayment.cashierResult = result;
      }

      return {
        success: true,
        data: result,
        message: 'Payment cashier opened successfully'
      };
    } catch (error) {
      console.error('Cashier failed:', error);
      
      if (this.activePayment) {
        this.activePayment.status = 'failed';
        this.activePayment.error = error.message;
      }

      return {
        success: false,
        error: error.message,
        message: 'Failed to open payment cashier'
      };
    }
  }

  /**
   * Complete payment flow (prepare + show cashier)
   * @param {Object} orderData - Payment order details
   * @returns {Promise<Object>} Complete payment result
   */
  async processPayment(orderData) {
    try {
      console.log('🚀 Starting payment process with data:', orderData);
      
      // Step 1: Prepare payment
      console.log('📝 Step 1: Preparing payment...');
      const prepareResult = await this.preparePayment(orderData);
      
      console.log('📝 Prepare result:', prepareResult);
      
      if (!prepareResult.success) {
        console.error('❌ Payment preparation failed:', prepareResult.error);
        throw new Error(prepareResult.error || 'Payment preparation failed');
      }

      console.log('✅ Payment prepared successfully');
      console.log('💳 Payment params:', prepareResult.data.paymentParams);

      // Step 2: Show cashier
      console.log('🏪 Step 2: Opening cashier...');
      const cashierResult = await this.showCashier(prepareResult.data.paymentParams);
      
      console.log('🏪 Cashier result:', cashierResult);
      
      if (!cashierResult.success) {
        console.error('❌ Cashier failed:', cashierResult.error);
        throw new Error(cashierResult.error || 'Failed to open payment cashier');
      }

      console.log('✅ Cashier opened successfully');

      // Step 3: Query payment status
      console.log('🔍 Step 3: Querying payment status...');
      const statusResult = await this.queryPaymentStatus(prepareResult.data.outBizId);
      
      console.log('🔍 Status result:', statusResult);

      console.log('✅ Payment process completed successfully!');

      return {
        success: true,
        data: {
          prepayId: prepareResult.data.prepayId,
          outBizId: prepareResult.data.outBizId,
          status: statusResult.data,
          paymentParams: prepareResult.data.paymentParams
        },
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      console.error('❌ Error stack:', error.stack);
      return {
        success: false,
        error: error.message,
        message: 'Payment processing failed',
        details: {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack
        }
      };
    }
  }

  /**
   * Query payment status
   * @param {string} outBizId - Order business ID
   * @returns {Promise<Object>} Payment status
   */
  async queryPaymentStatus(outBizId) {
    try {
      const result = await this.superApp.queryPaymentResult(outBizId);

      // Update active payment if it matches
      if (this.activePayment && this.activePayment.outBizId === outBizId) {
        this.activePayment.statusQuery = result;
        this.activePayment.queriedAt = new Date().toISOString();
      }

      return {
        success: true,
        data: result,
        message: 'Payment status retrieved successfully'
      };
    } catch (error) {
      console.error('Status query failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve payment status'
      };
    }
  }

  /**
   * Get authentication token from SuperApp
   * @returns {Promise<string>} Auth token
   */
  async getAuthToken() {
    try {
      let token;
      
      // Try standard window.payment first
      if (window.payment?.getAuthToken) {
        console.log('🎯 Using window.payment.getAuthToken');
        token = await window.payment.getAuthToken({ appId: this.superApp.appId });
      } else {
        // Try WebView bridge
        console.log('🌉 Using WebView bridge for getAuthToken');
        token = await webViewBridge.getAuthToken(this.superApp.appId);
      }
      
      return {
        success: true,
        data: token,
        message: 'Auth token retrieved successfully'
      };
    } catch (error) {
      console.error('Auth token retrieval failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve auth token'
      };
    }
  }

  /**
   * Get payment history
   * @returns {Array} Payment history
   */
  getPaymentHistory() {
    return [...this.paymentHistory];
  }

  /**
   * Get active payment
   * @returns {Object|null} Active payment
   */
  getActivePayment() {
    return this.activePayment ? { ...this.activePayment } : null;
  }

  /**
   * Clear active payment
   */
  clearActivePayment() {
    this.activePayment = null;
  }

  /**
   * Validate order data
   * @param {Object} orderData - Order data to validate
   * @throws {Error} If validation fails
   */
  validateOrderData(orderData) {
    if (!orderData) {
      throw new Error('Order data is required');
    }

    if (!orderData.amount || orderData.amount <= 0) {
      throw new Error('Valid amount is required');
    }

    if (!orderData.currency) {
      throw new Error('Currency is required');
    }

    if (!orderData.description) {
      throw new Error('Description is required');
    }

    // Validate currency format
    const validCurrencies = ['USD', 'EUR', 'GBP', 'ZWL'];
    if (!validCurrencies.includes(orderData.currency)) {
      throw new Error(`Invalid currency. Supported: ${validCurrencies.join(', ')}`);
    }

    return true;
  }

  /**
   * Check if SuperApp payment API is available
   * @returns {boolean} True if available
   */
  isPaymentAPIAvailable() {
    // Check for window object first
    if (typeof window === 'undefined') {
      return false;
    }

    // Check for standard window.payment first
    if (window.payment && typeof window.payment === 'object') {
      console.log('✅ SuperApp payment API detected (window.payment):', window.payment);
      return true;
    }

    // Check for WebView bridges
    const paymentBridge = webViewBridge.findPaymentBridge();
    if (paymentBridge) {
      console.log('✅ Payment bridge detected:', paymentBridge);
      return true;
    }

    // Debug: Log what's available
    console.log('❌ No payment API or bridge found');
    console.log('WebView debug info:', webViewBridge.getDebugInfo());
    
    return false;
  }

  /**
   * Get payment configuration
   * @returns {Object} Current configuration
   */
  getConfiguration() {
    return {
      merchantId: this.superApp.merchantId,
      appId: this.superApp.appId,
      baseUrl: this.superApp.baseUrl,
      notifyUrl: this.superApp.notifyUrl,
      redirectUrl: this.superApp.redirectUrl,
      apiAvailable: this.isPaymentAPIAvailable()
    };
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Export class for testing or multiple instances
export default PaymentService;

