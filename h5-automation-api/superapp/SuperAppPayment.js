/**
 * SuperApp Payment - Production Ready
 * For React/ES6 applications
 * 
 * @example
 * import SuperAppPayment from './SuperAppPayment';
 * 
 * const payment = new SuperAppPayment({ 
 *   merchantId, appId, serialNo, merchantPrivateKey 
 * });
 * const result = await payment.preparePayment({ amount: 100, currency: 'USD' });
 */

export default class SuperAppPayment {
  constructor(config = {}) {
    // Default credentials (can be overridden)
    this.merchantId = config.merchantId || 'MG3518zo1Wd0XlXZzn';
    this.appId = config.appId || 'AX35182510130000001000103500';
    this.serialNo = config.serialNo || 'ms8I46zJeW';
    this.merchantPrivateKey = config.merchantPrivateKey || `-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`;
    
    this.baseUrl = config.baseUrl || 'https://appleseed-uat-api.joypaydev.com';
    this.notifyUrl = config.notifyUrl;
    this.redirectUrl = config.redirectUrl;
  }

  generateNonce(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  generateTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  buildMessage(method, url, timestamp, nonceStr, body) {
    const urlObj = new URL(url);
    const canonicalUrl = urlObj.pathname + (urlObj.search || '');
    return `${method}\n${canonicalUrl}\n${timestamp}\n${nonceStr}\n${body}\n`;
  }

  pemToArrayBuffer(pem) {
    const pemContents = pem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');
    
    const binaryString = atob(pemContents);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async signRSA(message) {
    const keyData = this.pemToArrayBuffer(this.merchantPrivateKey);
    
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      keyData,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, data);
    
    const signatureArray = new Uint8Array(signature);
    let binary = '';
    for (let i = 0; i < signatureArray.length; i++) {
      binary += String.fromCharCode(signatureArray[i]);
    }
    return btoa(binary);
  }

  async buildAuthorizationHeader(method, url, body) {
    const nonceStr = this.generateNonce();
    const timestamp = this.generateTimestamp();
    const message = this.buildMessage(method, url, timestamp, nonceStr, body);
    const signature = await this.signRSA(message);

    return `SHA256withRSA mchid="${this.merchantId}",` +
           `serial_no="${this.serialNo}",` +
           `nonce_str="${nonceStr}",` +
           `timestamp="${timestamp}",` +
           `signature="${signature}"`;
  }

  async generatePaymentSignature(prepayId) {
    const nonce = this.generateNonce();
    const timestamp = this.generateTimestamp();
    const baseString = `${this.merchantId}\n${this.appId}\n${nonce}\n${timestamp}\n${this.serialNo}\n${prepayId}\n`;
    const signature = await this.signRSA(baseString);

    return {
      rawData: encodeURIComponent(baseString),
      paySign: signature,
      signType: 'SHA256withRSA'
    };
  }

  async createOrder(orderData) {
    const url = `${this.baseUrl}/v1/pay/pre-transaction/order/place`;
    
    const requestBody = {
      mchId: this.merchantId,
      appId: this.appId,
      outBizId: orderData.outBizId || SuperAppPayment.generateOrderId(),
      amount: orderData.amount,
      currency: orderData.currency,
      description: orderData.description || '',
      timeExpire: orderData.timeExpire || SuperAppPayment.calculateExpiryTime(30),
      callbackInfo: orderData.callbackInfo || '',
      paymentProduct: 'InAppH5'
    };

    if (orderData.notifyUrl || this.notifyUrl) {
      requestBody.notifyUrl = orderData.notifyUrl || this.notifyUrl;
    }
    if (orderData.redirectUrl || this.redirectUrl) {
      requestBody.redirectUrl = orderData.redirectUrl || this.redirectUrl;
    }

    const body = JSON.stringify(requestBody);
    const authHeader = await this.buildAuthorizationHeader('POST', url, body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    
    return {
      prepayId: result.prepayId,
      outBizId: requestBody.outBizId,
      orderData: requestBody
    };
  }

  async preparePayment(orderData) {
    const order = await this.createOrder(orderData);
    const paymentParams = await this.generatePaymentSignature(order.prepayId);
    
    return {
      prepayId: order.prepayId,
      outBizId: order.outBizId,
      paymentParams,
      orderData: order.orderData
    };
  }

  async queryPaymentResult(outBizId) {
    if (!outBizId) throw new Error('outBizId is required');
    
    const url = `${this.baseUrl}/v1/pay/transaction/result`;
    const body = JSON.stringify({ outBizId });
    const authHeader = await this.buildAuthorizationHeader('POST', url, body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  async getAuthToken() {
    if (!window.payment) {
      throw new Error('window.payment API not available');
    }
    const result = await window.payment.getAuthToken({ appId: this.appId });
    return result.authToken;
  }

  async showPaymentCashier(paymentParams) {
    if (!window.payment) {
      throw new Error('window.payment API not available');
    }
    return await window.payment.payOrder(paymentParams);
  }

  static generateOrderId(prefix = 'ORDER-') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${prefix}${timestamp}${random}`;
  }

  static calculateExpiryTime(minutes = 30) {
    return Date.now() + (minutes * 60 * 1000);
  }
}

