/**
 * 
 * import AppleTreeGateway from './AppleTreeGateway';
 * 
 * const gateway = new AppleTreeGateway({ merchantId: 'your-id' });
 * const products = await gateway.getProducts({ countryCode: 'ZW', serviceId: 1 });
 */

export default class AppleTreeGateway {
  constructor(config = {}) {
    // Default credentials (can be overridden)
    this.merchantId = config.merchantId || '23de4621-ea24-433f-9b45-dc1e383d8c2b';
    this.baseUrl = config.baseUrl || 'https://sandbox-dev.appletreepayments.com';
    this.apiVersion = config.apiVersion || 'V2';
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}/vas/${this.apiVersion}/${endpoint}`;
    
    const options = {
      method: method.toUpperCase(),
      headers: {
        'MerchantId': this.merchantId,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && method.toUpperCase() !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const responseText = await response.text();
    
    if (!response.ok) {
      const errorJson = JSON.parse(responseText);
      throw new Error(errorJson.ResultMessage || `HTTP ${response.status}`);
    }

    const result = JSON.parse(responseText);
    
    if (result.Status === 'ERROR' || result.Status === 'NOTFOUND') {
      throw new Error(result.ResultMessage || 'API request failed');
    }

    return result;
  }

  async getCountries() {
    const response = await this.request('GET', 'Countries');
    return response.Countries || [];
  }

  async getServices() {
    const response = await this.request('GET', 'Services');
    return response.Services || [];
  }

  async getServiceProviders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.countryCode) params.append('countryCode', filters.countryCode);
    if (filters.serviceId) params.append('service', filters.serviceId);
    
    const endpoint = params.toString() ? `ServiceProviders?${params}` : 'ServiceProviders';
    const response = await this.request('GET', endpoint);
    return response.ServiceProviders || [];
  }

  async getProducts(filters) {
    if (!filters.countryCode || !filters.serviceId) {
      throw new Error('countryCode and serviceId are required');
    }

    const params = new URLSearchParams({
      countryCode: filters.countryCode,
      service: filters.serviceId
    });

    if (filters.serviceProviderId) {
      params.append('serviceProviderId', filters.serviceProviderId);
    }

    const response = await this.request('GET', `Products?${params}`);
    return response.Products || [];
  }

  async getProductById(productId) {
    if (!productId) throw new Error('productId is required');
    const response = await this.request('GET', `Product?id=${productId}`);
    return response.ServiceProduct || null;
  }

  async validatePayment(paymentData) {
    this.validatePaymentData(paymentData);
    return await this.request('POST', 'ValidatePayment', paymentData);
  }

  async postPayment(paymentData) {
    this.validatePaymentData(paymentData);
    return await this.request('POST', 'PostPayment', paymentData);
  }

  async getPaymentStatus(requestId) {
    if (!requestId) throw new Error('requestId is required');
    return await this.request('GET', `PaymentStatus?requestId=${requestId}`);
  }

  async reversePayment(requestId) {
    if (!requestId) throw new Error('requestId is required');
    return await this.request('GET', `ReversePayment?requestId=${requestId}`);
  }

  async getLastToken(data) {
    if (!data.ProductId || !data.CreditPartyIdentifiers) {
      throw new Error('ProductId and CreditPartyIdentifiers are required');
    }
    return await this.request('POST', 'GetLastToken', data);
  }

  async ping() {
    return await this.request('GET', 'Connect');
  }

  async getProductCatalog(countryCode, serviceId) {
    const [services, products] = await Promise.all([
      this.getServices(),
      this.getProducts({ countryCode, serviceId })
    ]);

    return {
      countryCode,
      service: services.find(s => s.Id === serviceId),
      products,
      totalProducts: products.length
    };
  }

  validatePaymentData(paymentData) {
    const required = ['RequestId', 'ProductId', 'Currency', 'CustomerDetails'];
    
    for (const field of required) {
      if (!paymentData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    if (paymentData.Amount === undefined || paymentData.Amount === null) {
      throw new Error('Amount is required');
    }
  }

  static generateRequestId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Service ID constants
export const Services = {
  MOBILE_AIRTIME: 1,
  MOBILE_DATA: 2,
  MOBILE_BUNDLES: 3,
  INTERNET_BROADBAND: 5,
  ELECTRICITY: 6,
  GAS: 8,
  EDUCATION: 9,
  INSURANCE: 10,
  PHONE: 12,
  TELEVISION: 13,
  LOCAL_AUTHORITIES: 17,
  RETAIL_SHOPS: 18
};

