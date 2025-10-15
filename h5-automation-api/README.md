# H5 Automation API - Production Ready

Clean, production-ready ES6 classes for React applications.

## 📁 Structure

```
h5-automation-api/
├── appletree/
│   ├── AppleTreeGateway.js    # AppleTree VAS service
│   └── index.js               # Exports + constants
└── superapp/
    ├── SuperAppPayment.js     # SuperApp payment processing
    └── index.js               # Exports + constants
```

## 🚀 Usage in React

### AppleTree Gateway

```jsx
import AppleTreeGateway, { Services } from './h5-automation-api/appletree';

function MyComponent() {
  // Uses default credentials (already included)
  const gateway = new AppleTreeGateway();
  
  // Or override if needed:
  // const gateway = new AppleTreeGateway({ merchantId: 'other-id' });

  useEffect(() => {
    const loadProducts = async () => {
      const products = await gateway.getProducts({
        countryCode: 'ZW',
        serviceId: Services.MOBILE_AIRTIME
      });
      setProducts(products);
    };
    loadProducts();
  }, []);
}
```

### SuperApp Payment

```jsx
import SuperAppPayment from './h5-automation-api/superapp';

function PaymentComponent() {
  // Uses default credentials (already included)
  const payment = new SuperAppPayment();
  
  // Or override if needed:
  // const payment = new SuperAppPayment({ merchantId: 'other-id', ... });

  const handlePayment = async () => {
    const result = await payment.preparePayment({
      amount: 100,
      currency: 'USD',
      description: 'Product Purchase'
    });
    
    // Show SuperApp cashier
    await window.payment.payOrder(result.paymentParams);
  };
}
```

## 📦 Features

- ✅ ES6 modules (import/export)
- ✅ Async/await
- ✅ Promise-based
- ✅ TypeScript-ready
- ✅ React compatible
- ✅ No dependencies
- ✅ Production optimized
- ✅ Clean code only

## 🔒 Credentials

**Default credentials are included** in the classes for immediate use.

### AppleTree
- Merchant ID: `23de4621-ea24-433f-9b45-dc1e383d8c2b`

### SuperApp
- Merchant ID: `MG3518zo1Wd0XlXZzn`
- App ID: `AX35182510130000001000103500`
- Serial No: `ms8I46zJeW`
- Private Key: ✅ Included

You can override these by passing config to constructor if needed.

## 📝 API Reference

### AppleTree Gateway

```javascript
getCountries()
getServices()
getServiceProviders({ countryCode?, serviceId? })
getProducts({ countryCode, serviceId })
getProductById(productId)
validatePayment(paymentData)
postPayment(paymentData)
getPaymentStatus(requestId)
reversePayment(requestId)
getProductCatalog(countryCode, serviceId)
ping()

// Static methods
AppleTreeGateway.generateRequestId()
```

### SuperApp Payment

```javascript
createOrder(orderData)
preparePayment(orderData)
generatePaymentSignature(prepayId)
queryPaymentResult(outBizId)
getAuthToken()
showPaymentCashier(paymentParams)

// Static methods
SuperAppPayment.generateOrderId(prefix?)
SuperAppPayment.calculateExpiryTime(minutes?)
```

## 🎯 Production Ready

- No test files
- No examples
- No extra dependencies
- Just the classes you need
- Ready to import in React

---

**Copy this folder to your React project and start using!**

