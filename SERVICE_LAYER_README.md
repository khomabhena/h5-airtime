# Service Layer Documentation

## 📁 Architecture Overview

This project implements a complete, production-ready service layer for payment processing and VAS (Value-Added Services) management.

```
src/
├── services/
│   ├── paymentService.js       # SuperApp payment processing
│   ├── appleTreeService.js     # AppleTree VAS integration
│   ├── errorHandler.js         # Centralized error handling
│   └── index.js                # Services export
├── hooks/
│   ├── usePayment.js           # Payment operations hook
│   ├── useAppleTree.js         # AppleTree operations hook
│   └── index.js                # Hooks export
└── components/
    ├── BundleSelection.jsx     # Integrated with payment
    ├── PaymentSuccess.jsx      # Payment confirmation
    └── ...
```

---

## 🚀 Quick Start

### 1. Payment Processing

```jsx
import { usePayment } from '../hooks/usePayment';

function MyComponent() {
  const { processPayment, loading, error } = usePayment();

  const handlePay = async () => {
    const result = await processPayment({
      amount: 1000, // cents
      currency: 'USD',
      description: 'Airtime purchase'
    });

    if (result.success) {
      console.log('Payment successful!', result.data);
    }
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

### 2. AppleTree VAS Products

```jsx
import { useAppleTree } from '../hooks/useAppleTree';

function ProductList() {
  const { loadAirtimeProducts, products, loading } = useAppleTree();

  useEffect(() => {
    loadAirtimeProducts('ZW'); // Zimbabwe
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.Id}>{product.Name}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Service Layer API

### PaymentService

#### Methods

**`preparePayment(orderData)`**
- Prepares a payment order
- Returns: `{ success, data: { prepayId, outBizId, paymentParams }, message }`

**`showCashier(paymentParams)`**
- Opens SuperApp payment cashier
- Returns: `{ success, data, message }`

**`processPayment(orderData)`**
- Complete flow: prepare + show cashier + query status
- Returns: `{ success, data: { prepayId, outBizId, status }, message }`

**`queryPaymentStatus(outBizId)`**
- Query payment status by order ID
- Returns: `{ success, data, message }`

**`getAuthToken()`**
- Get SuperApp auth token
- Returns: `{ success, data: token, message }`

**`isPaymentAPIAvailable()`**
- Check if payment API is available
- Returns: `boolean`

#### Order Data Format

```javascript
{
  amount: 1000,              // Required: Amount in cents
  currency: 'USD',           // Required: Currency code
  description: 'Purchase',   // Required: Description
  callbackInfo: 'metadata'   // Optional: Callback information
}
```

---

### AppleTreeService

#### Methods

**`getCountries(useCache = true)`**
- Get all available countries
- Returns: `{ success, data: countries[], source: 'api'|'cache' }`

**`getServices(useCache = true)`**
- Get all available services
- Returns: `{ success, data: services[] }`

**`getProducts(filters, useCache = true)`**
- Get products by country and service
- Returns: `{ success, data: products[] }`

**`getAirtimeProducts(countryCode)`**
- Get airtime products for a country
- Returns: `{ success, data: products[] }`

**`getDataBundles(countryCode)`**
- Get data bundle products
- Returns: `{ success, data: products[] }`

**`getMobileBundles(countryCode)`**
- Get mobile bundle products
- Returns: `{ success, data: products[] }`

**`validatePayment(paymentData)`**
- Validate payment before processing
- Returns: `{ success, data, message }`

**`postPayment(paymentData)`**
- Process payment transaction
- Returns: `{ success, data, message }`

**`getPaymentStatus(requestId)`**
- Get payment status
- Returns: `{ success, data }`

#### Service IDs

```javascript
import { Services } from '../services/appleTreeService';

Services.MOBILE_AIRTIME    // 1
Services.MOBILE_DATA       // 2
Services.MOBILE_BUNDLES    // 3
Services.ELECTRICITY       // 6
Services.TELEVISION        // 13
// ... and more
```

---

### ErrorHandler

#### Custom Error Classes

```javascript
import { PaymentError, ValidationError, APIError } from '../services/errorHandler';

// Payment-specific errors
throw new PaymentError('Payment failed', { transactionId: '123' });

// Validation errors
throw new ValidationError('Invalid amount', { amount: -100 });

// API errors
throw new APIError('API unavailable', { statusCode: 503 });
```

#### Error Handling

```javascript
import { errorHandler } from '../services/errorHandler';

try {
  await riskyOperation();
} catch (error) {
  const formattedError = errorHandler.handle(error, 'ComponentName');
  console.log(formattedError.message); // User-friendly message
}
```

#### Error Types

- `NETWORK_ERROR` - Network/connectivity issues
- `API_ERROR` - API failures
- `VALIDATION_ERROR` - Data validation failures
- `PAYMENT_ERROR` - Payment processing errors
- `AUTH_ERROR` - Authentication failures
- `TIMEOUT_ERROR` - Request timeouts
- `UNKNOWN_ERROR` - Unexpected errors

---

## 🎣 React Hooks

### usePayment

```jsx
const {
  // State
  loading,                // boolean
  error,                  // Error object or null
  paymentData,            // Payment result data
  paymentStatus,          // 'prepared' | 'processing' | 'completed' | 'failed'
  isPaymentAPIAvailable,  // boolean
  
  // Actions
  processPayment,         // (orderData) => Promise
  preparePayment,         // (orderData) => Promise
  showCashier,            // (paymentParams) => Promise
  queryStatus,            // (outBizId) => Promise
  getAuthToken,           // () => Promise
  clearError,             // () => void
  reset,                  // () => void
  getHistory,             // () => Array
  getActivePayment        // () => Object | null
} = usePayment();
```

### useAppleTree

```jsx
const {
  // State
  loading,              // boolean
  error,                // Error object or null
  countries,            // Country[] array
  services,             // Service[] array
  products,             // Product[] array
  selectedProduct,      // Product or null
  
  // Actions
  loadCountries,        // (useCache?) => Promise
  loadServices,         // (useCache?) => Promise
  loadProducts,         // (filters, useCache?) => Promise
  loadAirtimeProducts,  // (countryCode) => Promise
  loadDataBundles,      // (countryCode) => Promise
  loadMobileBundles,    // (countryCode) => Promise
  getProductById,       // (productId) => Promise
  validatePayment,      // (paymentData) => Promise
  processPayment,       // (paymentData) => Promise
  getPaymentStatus,     // (requestId) => Promise
  ping,                 // () => Promise
  clearError,           // () => void
  reset,                // () => void
  clearCache,           // () => void
  
  // Constants
  Services              // Service ID constants
} = useAppleTree('ZW'); // Default country
```

---

## 🔧 Integration Examples

### Complete Payment Flow

```jsx
import React from 'react';
import { usePayment } from '../hooks/usePayment';

function BundlePurchase({ bundle, phoneNumber }) {
  const { 
    processPayment, 
    loading, 
    error, 
    isPaymentAPIAvailable 
  } = usePayment();

  const handlePurchase = async () => {
    const orderData = {
      amount: Math.round(bundle.price * 100),
      currency: 'USD',
      description: `${bundle.name} for ${phoneNumber}`
    };

    const result = await processPayment(orderData);

    if (result.success) {
      // Navigate to success page
      navigate('/success', { state: result.data });
    }
  };

  return (
    <div>
      {error && (
        <div className="error">
          <p>{error.message}</p>
        </div>
      )}

      {!isPaymentAPIAvailable && (
        <div className="warning">
          Open in SuperApp for payment features
        </div>
      )}

      <button 
        onClick={handlePurchase} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
```

### Product Catalog with Caching

```jsx
import React, { useEffect } from 'react';
import { useAppleTree } from '../hooks/useAppleTree';

function ProductCatalog() {
  const { 
    loadAirtimeProducts, 
    products, 
    loading, 
    error 
  } = useAppleTree('ZW');

  useEffect(() => {
    // Loads from cache if available
    loadAirtimeProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard 
          key={product.Id} 
          product={product} 
        />
      ))}
    </div>
  );
}
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Optional: Override default URLs
REACT_APP_APPLESEED_BASE_URL=https://appleseed-uat-api.joypaydev.com
REACT_APP_APPLETREE_BASE_URL=https://sandbox-dev.appletreepayments.com

# Optional: Enable debug logging
REACT_APP_DEBUG_PAYMENTS=true
```

### Default Credentials

All credentials are pre-configured in the h5-automation-api folder:

**SuperApp (Appleseed)**
- Merchant ID: `MG3518zo1Wd0XlXZzn`
- App ID: `AX35182510130000001000103500`
- Serial No: `ms8I46zJeW`
- Private Key: ✅ Included

**AppleTree**
- Merchant ID: `23de4621-ea24-433f-9b45-dc1e383d8c2b`

---

## 🧪 Testing

### Test Payment API Availability

```jsx
import { paymentService } from '../services/paymentService';

const isAvailable = paymentService.isPaymentAPIAvailable();
console.log('Payment API Available:', isAvailable);
```

### Test AppleTree Connection

```jsx
import { useAppleTree } from '../hooks/useAppleTree';

function TestConnection() {
  const { ping } = useAppleTree();

  const test = async () => {
    const result = await ping();
    console.log('Connection:', result.success ? 'OK' : 'Failed');
  };

  return <button onClick={test}>Test Connection</button>;
}
```

---

## 🔒 Security Features

### Automatic Signature Generation
- RSA-SHA256 signing for all API requests
- Browser-compatible using Web Crypto API
- No external crypto dependencies

### Error Sanitization
- User-friendly messages for production
- Detailed technical info in development
- Sensitive data filtering

### Request Validation
- Input validation before API calls
- Currency and amount validation
- Phone number validation

---

## 📊 Monitoring & Debugging

### Error Logs

```javascript
import { errorHandler } from '../services/errorHandler';

// Get recent errors
const recentErrors = errorHandler.getErrorLog(10);

// Get error statistics
const stats = errorHandler.getStatistics();
console.log('Total errors:', stats.total);
console.log('By type:', stats.byType);
console.log('By severity:', stats.bySeverity);

// Clear log
errorHandler.clearErrorLog();
```

### Payment History

```javascript
import { paymentService } from '../services/paymentService';

// Get payment history
const history = paymentService.getPaymentHistory();

// Get active payment
const active = paymentService.getActivePayment();
```

---

## 🚨 Error Handling Best Practices

### Component Level

```jsx
const { processPayment, error, clearError } = usePayment();

// Display error
{error && (
  <div className="error-banner">
    <p>{error.message}</p>
    <button onClick={clearError}>Dismiss</button>
  </div>
)}
```

### Service Level

```javascript
try {
  const result = await paymentService.processPayment(orderData);
  if (!result.success) {
    // Handle business logic errors
    showNotification(result.message);
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
}
```

---

## 📱 SuperApp Integration

### Required Environment

The payment cashier requires the SuperApp environment:

```javascript
// Check availability
if (window.payment) {
  // SuperApp available
  await processPayment(orderData);
} else {
  // Fallback behavior
  navigate('/payment-form');
}
```

### Payment API Methods

```javascript
// Get auth token
const token = await window.payment.getAuthToken({ appId });

// Show cashier
const result = await window.payment.payOrder({
  rawData,
  paySign,
  signType
});
```

---

## 🎯 Next Steps

1. **Add Route for Payment Success**
   ```jsx
   <Route path="/payment-success" element={<PaymentSuccess />} />
   ```

2. **Test in SuperApp Environment**
   - Open app in SuperApp
   - Test payment flow
   - Verify cashier integration

3. **Customize Error Messages**
   - Update `errorHandler.getUserFriendlyMessage()`
   - Add translations if needed

4. **Monitor Transactions**
   - Use payment history
   - Track error rates
   - Analyze user flow

---

## 💡 Tips & Tricks

### Caching Strategy
```javascript
// Force fresh data
await loadProducts(filters, false);

// Use cached data (default)
await loadProducts(filters, true);

// Clear all caches
clearCache();
```

### Retry Failed Requests
```javascript
import { errorHandler } from '../services/errorHandler';

const result = await errorHandler.retry(
  () => processPayment(orderData),
  3,      // max retries
  1000    // initial delay (ms)
);
```

### Custom Error Handling
```javascript
errorHandler.addListener((error) => {
  // Send to analytics
  analytics.track('error', error);
  
  // Send to error reporting
  Sentry.captureException(error);
});
```

---

## 📞 Support

For issues or questions:
1. Check error logs: `errorHandler.getErrorLog()`
2. Test connections: `ping()` methods
3. Verify configuration: `getConfiguration()` methods
4. Review this documentation

---

**Built with ❤️ for production use**

