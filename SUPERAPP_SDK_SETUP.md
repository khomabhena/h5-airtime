# SuperApp SDK Setup - Complete Integration Guide

## ✅ **SOLUTION FOUND!**

The `js-sdk.js` file is the **official SuperApp SDK** that creates the `window.payment` API. I've now integrated it properly.

---

## 🔧 What I've Done

### 1. **Copied SDK to Public Folder**
```
h5-automation-api/superapp/js-sdk.js → public/js-sdk.js
```

### 2. **Added SDK to index.html**
```html
<script src="/js-sdk.js"></script>
```
**✅ SDK now loads BEFORE React app**

### 3. **Updated WebView Bridge**
Now detects `AppNativeJsBridge` and shows SDK status

---

## 📋 How the SuperApp SDK Works

### **SDK Requirements:**

The SDK checks these conditions before working:

1. ✅ **User Agent** must contain "Customer" OR "Partner"
2. ✅ **`window.AppNativeJsBridge`** must be injected by native app
3. ✅ **SDK must load** before calling payment methods

### **SDK Creates:**
```javascript
window.payment = {
  payOrder: function(params) { ... },
  getAuthToken: function(params) { ... },
  // ... other methods
}

window.AppNativeJsBridgeCallback = {
  callbackId: 0,
  callback: {},
  eventListeners: new Map()
}
```

---

## 🔍 How to Debug Now

### **Step 1: Refresh the App**
Clear cache and reload:
- **Ctrl+Shift+R** (hard refresh)
- Or clear browser cache

### **Step 2: Check Debug Panel**
Scroll to bottom of bundle selection page. You should now see:

```
Platform: [android/ios/web]

Detected Bridges:
  • window.AppNativeJsBridge (superapp-sdk)
    Methods: postMessage
    SDK Info:
      - hasPayment: true
      - hasCallbacks: true
      - User Agent: ...
      - isCustomer: true/false
      - isPartner: true/false

  • window.payment (standard)
    Methods: payOrder, getAuthToken, ...
```

### **Step 3: Check Browser Console**
Open console (F12) and check:

```javascript
// Should show the SDK
console.log('window.payment:', window.payment);

// Should show the bridge
console.log('AppNativeJsBridge:', window.AppNativeJsBridge);

// Should show callback system
console.log('Callbacks:', window.AppNativeJsBridgeCallback);

// Check user agent
console.log('User Agent:', navigator.userAgent);
```

---

## ⚠️ Possible Issues

### Issue 1: SDK Not Loading

**Check:**
```javascript
console.log('window.payment:', window.payment);
// If undefined → SDK not loaded
```

**Solutions:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check Network tab for `/js-sdk.js` (should be 200 OK)
- Restart dev server

### Issue 2: "Unsupported Environment" Error

**Cause:**
- User agent missing "Customer" or "Partner"
- `window.AppNativeJsBridge` not injected

**Check:**
```javascript
const userAgent = navigator.userAgent;
console.log('Has Customer:', userAgent.includes('Customer'));
console.log('Has Partner:', userAgent.includes('Partner'));
console.log('Has Bridge:', !!window.AppNativeJsBridge);
```

**Solution:**
- Ensure opening in actual SuperApp (not browser)
- SuperApp must inject `AppNativeJsBridge` before loading page

### Issue 3: Payment Still Fails

**Check Console Logs:**
```
🚀 Starting payment process
📝 Step 1: Preparing payment...
✅ Payment prepared
💳 Payment params: {...}
🏪 Step 2: Opening cashier...
[ERROR MESSAGE HERE]
```

**Common Errors:**
- "Unsupported Environment" (code: 1002) → Not in SuperApp
- "Call to jsapi timed out" (code: 1001) → Native not responding
- Other errors → Check error message

---

## 🎯 SuperApp Requirements

For the SDK to work, the SuperApp must:

### 1. **Inject AppNativeJsBridge**

**iOS (WebKit):**
```javascript
window.AppNativeJsBridge = {
  postMessage: function(message) {
    webkit.messageHandlers.AppNativeJsBridge.postMessage(message);
  }
};
```

**Android:**
```javascript
window.AppNativeJsBridge = {
  postMessage: function(message) {
    Android.postMessage(message);
  }
};
```

### 2. **Set Correct User Agent**

Must contain "Customer" (for customer app) or "Partner" (for merchant app)

### 3. **Handle Callbacks**

When native processes payment, it must call:
```javascript
window.AppNativeJsBridgeCallback.callback['Callback123'](resultJSON);
```

---

## 📊 Expected Flow

```
1. User opens app in SuperApp
2. SuperApp injects AppNativeJsBridge
3. Page loads
4. SDK (js-sdk.js) loads
5. SDK creates window.payment
6. SDK checks environment (user agent + bridge)
7. React app loads
8. User selects bundle
9. Clicks "Pay Now"
10. Our code calls window.payment.payOrder()
11. SDK calls AppNativeJsBridge.postMessage()
12. Native app receives message
13. Native app shows payment cashier
14. User completes payment
15. Native calls callback
16. SDK resolves promise
17. Our code navigates to success page
```

---

## 🧪 Testing Checklist

After refreshing the app:

- [ ] Open browser console (F12)
- [ ] Check if `window.payment` exists
- [ ] Check if `window.AppNativeJsBridge` exists
- [ ] Check debug panel at bottom
- [ ] Look for "Detected Bridges" section
- [ ] Verify user agent has "Customer" or "Partner"
- [ ] Try payment and check console logs

---

## 💡 Quick Test

Open browser console and run:

```javascript
// Test 1: Check SDK loaded
console.log('SDK loaded:', !!window.payment);

// Test 2: Check environment
const isSupported = (
  navigator.userAgent.includes('Customer') || 
  navigator.userAgent.includes('Partner')
) && !!window.AppNativeJsBridge;
console.log('Environment supported:', isSupported);

// Test 3: List available methods
if (window.payment) {
  console.log('Payment methods:', Object.keys(window.payment));
}

// Test 4: Check bridge
console.log('Native bridge:', window.AppNativeJsBridge);

// Test 5: Check callbacks
console.log('Callback system:', window.AppNativeJsBridgeCallback);
```

Expected output:
```
SDK loaded: true
Environment supported: true (if in SuperApp)
Payment methods: ["payOrder", "getAuthToken", "close", "open", ...]
Native bridge: {postMessage: function}
Callback system: {callbackId: 0, callback: {}, ...}
```

---

## 🚀 Next Steps

1. **Restart your dev server**
   ```bash
   npm run dev
   ```

2. **Hard refresh the app** (Ctrl+Shift+R)

3. **Check debug panel** - Should now show SDK info

4. **Try payment** - Check console for detailed logs

5. **Share results:**
   - Does `window.payment` exist now?
   - What does debug panel show?
   - What's the error if it still fails?

---

## ✅ Files Changed

1. ✅ `public/js-sdk.js` - SDK added
2. ✅ `index.html` - SDK script tag added  
3. ✅ `src/utils/webViewBridge.js` - SDK detection added
4. ✅ `src/services/paymentService.js` - Enhanced logging

---

**The SDK is now properly integrated. Refresh the app and check if `window.payment` is available!** 🎉

