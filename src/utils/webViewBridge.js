/**
 * WebView Bridge Utility
 * Detects and provides interface to native app communication
 * Supports iOS (webkit), Android, and custom bridges
 */

class WebViewBridge {
  constructor() {
    this.platform = this.detectPlatform();
    this.bridge = this.detectBridge();
  }

  /**
   * Detect platform (iOS, Android, Web)
   */
  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }
    
    return 'web';
  }

  /**
   * Detect available bridge
   */
  detectBridge() {
    const bridges = [];

    // Standard window.payment
    if (window.payment && typeof window.payment === 'object') {
      bridges.push({
        name: 'window.payment',
        type: 'standard',
        api: window.payment,
        methods: Object.keys(window.payment)
      });
    }

    // iOS WebKit bridge
    if (window.webkit?.messageHandlers) {
      const handlers = Object.keys(window.webkit.messageHandlers);
      handlers.forEach(handler => {
        bridges.push({
          name: `webkit.messageHandlers.${handler}`,
          type: 'ios-webkit',
          api: window.webkit.messageHandlers[handler],
          methods: ['postMessage']
        });
      });
    }

    // Android bridge (common patterns)
    const androidBridges = [
      'Android',
      'AndroidBridge', 
      'NativeApp',
      'AppBridge',
      'JSBridge',
      'SuperApp'
    ];

    androidBridges.forEach(bridgeName => {
      if (window[bridgeName]) {
        bridges.push({
          name: `window.${bridgeName}`,
          type: 'android',
          api: window[bridgeName],
          methods: typeof window[bridgeName] === 'object' ? Object.keys(window[bridgeName]) : []
        });
      }
    });

    // React Native bridge
    if (window.ReactNativeWebView) {
      bridges.push({
        name: 'ReactNativeWebView',
        type: 'react-native',
        api: window.ReactNativeWebView,
        methods: ['postMessage']
      });
    }

    // Flutter bridge
    if (window.flutter_inappwebview) {
      bridges.push({
        name: 'flutter_inappwebview',
        type: 'flutter',
        api: window.flutter_inappwebview,
        methods: Object.keys(window.flutter_inappwebview)
      });
    }

    return bridges;
  }

  /**
   * Get all detected bridges
   */
  getAllBridges() {
    return this.bridge;
  }

  /**
   * Find payment-related bridge
   */
  findPaymentBridge() {
    // Check standard first
    const standardBridge = this.bridge.find(b => b.name === 'window.payment');
    if (standardBridge) {
      return standardBridge;
    }

    // Check for payment-related methods in other bridges
    for (const bridge of this.bridge) {
      const paymentMethods = bridge.methods.filter(m => 
        m.toLowerCase().includes('pay') || 
        m.toLowerCase().includes('auth') ||
        m.toLowerCase().includes('token')
      );

      if (paymentMethods.length > 0) {
        return {
          ...bridge,
          paymentMethods
        };
      }
    }

    return null;
  }

  /**
   * iOS: Call native method via webkit messageHandlers
   */
  async callIOSBridge(handlerName, methodName, params = {}) {
    if (!window.webkit?.messageHandlers?.[handlerName]) {
      throw new Error(`iOS handler ${handlerName} not found`);
    }

    return new Promise((resolve, reject) => {
      // Generate callback ID
      const callbackId = `callback_${Date.now()}_${Math.random()}`;
      
      // Setup callback handler
      window[callbackId] = (response) => {
        delete window[callbackId];
        resolve(response);
      };

      // Call native handler
      window.webkit.messageHandlers[handlerName].postMessage({
        method: methodName,
        params: params,
        callbackId: callbackId
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (window[callbackId]) {
          delete window[callbackId];
          reject(new Error('iOS bridge call timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Android: Call native method
   */
  async callAndroidBridge(bridgeName, methodName, ...args) {
    if (!window[bridgeName]) {
      throw new Error(`Android bridge ${bridgeName} not found`);
    }

    const bridge = window[bridgeName];
    
    if (typeof bridge[methodName] !== 'function') {
      throw new Error(`Method ${methodName} not found on ${bridgeName}`);
    }

    return bridge[methodName](...args);
  }

  /**
   * React Native: Post message
   */
  async callReactNativeBridge(message) {
    if (!window.ReactNativeWebView) {
      throw new Error('ReactNativeWebView not found');
    }

    return new Promise((resolve, reject) => {
      const callbackId = `callback_${Date.now()}`;
      
      window[callbackId] = (response) => {
        delete window[callbackId];
        resolve(response);
      };

      window.ReactNativeWebView.postMessage(JSON.stringify({
        ...message,
        callbackId
      }));

      setTimeout(() => {
        if (window[callbackId]) {
          delete window[callbackId];
          reject(new Error('React Native bridge timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Generic bridge call - tries to find the right method
   */
  async call(method, params = {}) {
    const paymentBridge = this.findPaymentBridge();
    
    if (!paymentBridge) {
      throw new Error('No payment bridge found');
    }

    console.log(`🌉 Calling bridge: ${paymentBridge.name}.${method}`, params);

    // If it's standard window.payment
    if (paymentBridge.type === 'standard') {
      if (typeof paymentBridge.api[method] === 'function') {
        return await paymentBridge.api[method](params);
      }
      throw new Error(`Method ${method} not found on payment API`);
    }

    // iOS WebKit
    if (paymentBridge.type === 'ios-webkit') {
      const handlerName = paymentBridge.name.split('.').pop();
      return await this.callIOSBridge(handlerName, method, params);
    }

    // Android
    if (paymentBridge.type === 'android') {
      const bridgeName = paymentBridge.name.replace('window.', '');
      return await this.callAndroidBridge(bridgeName, method, params);
    }

    // React Native
    if (paymentBridge.type === 'react-native') {
      return await this.callReactNativeBridge({ method, params });
    }

    throw new Error('Unsupported bridge type');
  }

  /**
   * Get auth token from native app
   */
  async getAuthToken(appId) {
    try {
      // Try standard API first
      if (window.payment?.getAuthToken) {
        return await window.payment.getAuthToken({ appId });
      }

      // Try bridge
      return await this.call('getAuthToken', { appId });
    } catch (error) {
      console.error('Failed to get auth token:', error);
      throw error;
    }
  }

  /**
   * Show payment order
   */
  async payOrder(paymentParams) {
    try {
      // Try standard API first
      if (window.payment?.payOrder) {
        return await window.payment.payOrder(paymentParams);
      }

      // Try bridge
      return await this.call('payOrder', paymentParams);
    } catch (error) {
      console.error('Failed to show payment order:', error);
      throw error;
    }
  }

  /**
   * Check if running in WebView
   */
  isWebView() {
    return this.platform !== 'web' || this.bridge.length > 0;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      platform: this.platform,
      isWebView: this.isWebView(),
      bridges: this.bridge,
      paymentBridge: this.findPaymentBridge(),
      userAgent: navigator.userAgent,
      windowKeys: Object.keys(window).filter(k => 
        k.toLowerCase().includes('pay') || 
        k.toLowerCase().includes('bridge') ||
        k.toLowerCase().includes('webkit') ||
        k.toLowerCase().includes('android') ||
        k.toLowerCase().includes('native')
      )
    };
  }
}

// Create singleton instance
export const webViewBridge = new WebViewBridge();

// Export class for testing
export default WebViewBridge;

