# JS-SDK Analysis - SuperApp Payment Integration

## 🎯 KEY DISCOVERY

The `js-sdk.js` file is the **official SuperApp SDK** that creates the `window.payment` API!

---

## 📋 How It Works

### 1. **SDK Initialization** (Line 380-383)
```javascript
window.AppNativeJsBridgeCallback = { 
  eventListeners: new Map(), 
  callbackId: 0, 
  handleId: 0, 
  callback: {} 
}

window.payment = J  // J is the combined API object
```

**This tells us:**
- The SDK creates `window.payment` automatically
- It uses `window.AppNativeJsBridge` to communicate with native app
- Uses callback pattern for async operations

### 2. **Environment Check** (Line 207-209)
```javascript
var s = function () {
  return (f.includes('Customer') || f.includes('Partner')) && !!window.AppNativeJsBridge
}
```

**Critical Info:**
- ✅ User agent must contain "Customer" OR "Partner"
- ✅ `window.AppNativeJsBridge` must exist
- ❌ If either is missing → SDK won't work

### 3. **Payment API Methods**

The SDK exposes these payment-related methods:

#### **`payOrder`** (Line 314-324)
```javascript
function k(e) {
  return new Promise(function (n, t) {
    l('payOrder', e)
      .then(function (e) { n(e) })
      .catch(function (e) { t(e) })
  })
}
```
**Exposed as:** `window.payment.payOrder(params)`

#### **`getAuthToken`** (Line 347-357)
```javascript
var A = d(function (e) {
  return new Promise(function (n, t) {
    l('getAuthToken', e)
      .then(function (e) { n(e) })
      .catch(function (e) { t(e) })
  })
}, u)
```
**Exposed as:** `window.payment.getAuthToken(params)`

### 4. **Communication Flow** (Line 210-226)
```javascript
function l(e, n) {
  console.log('call js api '.concat(e))
  return new Promise(function (t, r) {
    if (!s()) return r(a)  // Check environment
    
    var o = 'Callback' + window.AppNativeJsBridgeCallback.callbackId++
    window.AppNativeJsBridgeCallback.callback[o] = function (n) {
      delete window.AppNativeJsBridgeCallback.callback[o]
      console.log('call js api '.concat(e, ' result'), n)
      n = JSON.parse(n)
      n.code && '0' === n.code ? t(n.data) : r(n)
    }
    
    var i = { api: e, data: null != n ? n : {}, callback: o }
    var u = JSON.stringify(i)
    window.AppNativeJsBridge && window.AppNativeJsBridge.postMessage(u)
  })
}
```

**Flow:**
1. Generate unique callback ID
2. Register callback function
3. Call `window.AppNativeJsBridge.postMessage()` with:
   - `api`: method name (e.g., "payOrder")
   - `data`: parameters
   - `callback`: callback function name
4. Native app processes and calls callback
5. SDK parses result and resolves/rejects promise

---

## 🔍 What This Means for Our Integration

### **Problem Identified:**

Our code expects `window.payment` to exist, but the SDK needs:

1. ✅ **User Agent** must contain "Customer" or "Partner"
2. ✅ **`window.AppNativeJsBridge`** must be injected by native app
3. ✅ **SDK must be loaded** before our React app

### **Current Status:**

If you're getting errors, one of these is likely missing:
- User agent doesn't have "Customer" or "Partner"
- `window.AppNativeJsBridge` not injected
- SDK not loaded properly

---

## 🛠️ Required Setup

### **1. Include SDK in HTML**

The SDK needs to be loaded in your `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="/js-sdk.js"></script>  <!-- Load SDK first -->
</head>
<body>
  <div id="root"></div>
  <!-- React app loads after -->
</body>
</html>
```

### **2. Native App Must Inject Bridge**

The SuperApp native code must inject:

```javascript
// iOS (WebKit)
window.AppNativeJsBridge = {
  postMessage: function(message) {
    // Send to native via webkit.messageHandlers
    webkit.messageHandlers.AppNativeJsBridge.postMessage(message);
  }
};

// Android
window.AppNativeJsBridge = {
  postMessage: function(message) {
    // Call native method
    Android.postMessage(message);
  }
};
```

### **3. User Agent Must Be Correct**

Check if user agent contains:
- "Customer" (for customer app)
- OR "Partner" (for partner/merchant app)

---

## ✅ Correct Payment Call

Based on the SDK, here's the proper way to call payment:

```javascript
// The SDK creates window.payment automatically
// Just call it directly:

window.payment.payOrder({
  rawData: "...",
  paySign: "...",
  signType: "SHA256withRSA"
})
.then(result => {
  console.log('Payment success:', result);
})
.catch(error => {
  console.error('Payment failed:', error);
  // error.code: '1001' = timeout
  // error.code: '1002' = unsupported environment
});
```

---

## 🔍 Debugging Checklist

To debug why payment isn't working:

### 1. Check if SDK is loaded:
```javascript
console.log('window.payment:', window.payment);
// Should show object with payOrder, getAuthToken, etc.
```

### 2. Check if bridge exists:
```javascript
console.log('AppNativeJsBridge:', window.AppNativeJsBridge);
// Should exist if in SuperApp
```

### 3. Check user agent:
```javascript
console.log('User Agent:', navigator.userAgent);
// Should contain "Customer" or "Partner"
```

### 4. Check callback system:
```javascript
console.log('Callbacks:', window.AppNativeJsBridgeCallback);
// Should show { callbackId, handleId, callback, eventListeners }
```

### 5. Test environment check:
```javascript
// From SDK (line 207-209)
const isSupported = (navigator.userAgent.includes('Customer') || 
                     navigator.userAgent.includes('Partner')) && 
                     !!window.AppNativeJsBridge;
console.log('Environment supported:', isSupported);
```

---

## 🎯 Action Items

1. **Copy SDK to public folder:**
   ```bash
   cp h5-automation-api/superapp/js-sdk.js public/js-sdk.js
   ```

2. **Add to index.html:**
   ```html
   <script src="%PUBLIC_URL%/js-sdk.js"></script>
   ```

3. **Update WebView bridge detector** to check for `AppNativeJsBridge`

4. **Verify SuperApp environment** with proper user agent

---

## 📊 Expected Flow

```
1. SuperApp loads WebView
2. SuperApp injects AppNativeJsBridge
3. SDK (js-sdk.js) loads
4. SDK creates window.payment
5. SDK checks environment (user agent + bridge)
6. React app loads
7. Our code calls window.payment.payOrder()
8. SDK calls AppNativeJsBridge.postMessage()
9. Native app shows cashier
10. Native calls callback
11. SDK resolves promise
12. Our code handles result
```

---

## 🚨 Common Issues

### Issue 1: "Unsupported Environment" (code: 1002)
**Cause:** User agent missing "Customer"/"Partner" OR `AppNativeJsBridge` missing
**Fix:** Ensure running in SuperApp with correct setup

### Issue 2: "Call to jsapi timed out" (code: 1001)
**Cause:** Native app not responding to postMessage
**Fix:** Check native app bridge implementation

### Issue 3: `window.payment` is undefined
**Cause:** SDK not loaded
**Fix:** Add `<script src="/js-sdk.js"></script>` to index.html

---

This is the official SDK - we need to ensure it's properly loaded and the environment is correctly set up!

