# WebView Bridge Integration Guide

## 🌉 What I've Added

You're absolutely right - if your app is running in a WebView, the native SuperApp needs to inject a JavaScript bridge for communication. I've now added comprehensive WebView bridge detection and support.

---

## 🔧 New Features

### 1. **WebView Bridge Utility** (`src/utils/webViewBridge.js`)

A smart bridge detector that finds and communicates with native apps through various methods:

#### Supported Bridge Types:
- ✅ **Standard** - `window.payment` (direct injection)
- ✅ **iOS WebKit** - `window.webkit.messageHandlers.*`
- ✅ **Android** - `window.Android`, `window.AndroidBridge`, etc.
- ✅ **React Native** - `window.ReactNativeWebView`
- ✅ **Flutter** - `window.flutter_inappwebview`

#### Key Methods:
```javascript
// Auto-detect and call payment methods
await webViewBridge.getAuthToken(appId);
await webViewBridge.payOrder(paymentParams);

// Get debug info
const info = webViewBridge.getDebugInfo();

// Find payment bridge
const bridge = webViewBridge.findPaymentBridge();
```

### 2. **Updated Payment Service** 

Now tries multiple methods to communicate with the native app:

1. Try `window.payment` directly
2. Fall back to WebView bridge detection
3. Auto-select the best available method

### 3. **Enhanced Debug Panel**

Now shows:
- 🌍 **Platform detection** (iOS, Android, Web)
- 🌉 **All detected bridges** with their methods
- 💳 **Active payment bridge** being used
- 🔍 **Bridge types** and capabilities

---

## 📱 How SuperApp WebView Integration Works

### For iOS (WebKit):

```javascript
// Native Swift code injects handler
webView.configuration.userContentController.add(self, name: "payment")

// JavaScript can then call:
window.webkit.messageHandlers.payment.postMessage({
  method: 'getAuthToken',
  params: { appId: 'xxx' },
  callbackId: 'callback_123'
});

// Native responds via:
webView.evaluateJavaScript("window.callback_123(result)")
```

### For Android:

```javascript
// Native Java/Kotlin adds interface
webView.addJavascriptInterface(new PaymentBridge(), "payment");

// JavaScript can then call:
window.payment.getAuthToken(appId)
window.payment.payOrder(params)
```

---

## 🔍 What The Debug Panel Will Show

### Example: iOS WebKit Bridge
```
Platform: ios (WebView Detected)

Detected Bridges:
  • webkit.messageHandlers.payment (ios-webkit)
    Methods: postMessage

💳 Active Payment Bridge:
  webkit.messageHandlers.payment
  Type: ios-webkit
  Payment Methods: getAuthToken, payOrder
```

### Example: Android Bridge  
```
Platform: android (WebView Detected)

Detected Bridges:
  • window.Android (android)
    Methods: getAuthToken, payOrder, closeWebView

💳 Active Payment Bridge:
  window.Android
  Type: android
  Payment Methods: getAuthToken, payOrder
```

### Example: Direct Injection
```
Platform: web

Detected Bridges:
  • window.payment (standard)
    Methods: getAuthToken, payOrder

💳 Active Payment Bridge:
  window.payment
  Type: standard
```

---

## 🎯 Common Bridge Names to Check

The debug panel automatically looks for:

### iOS:
- `window.webkit.messageHandlers.payment`
- `window.webkit.messageHandlers.Payment`
- `window.webkit.messageHandlers.superapp`

### Android:
- `window.payment`
- `window.Payment`
- `window.Android`
- `window.AndroidBridge`
- `window.NativeApp`
- `window.AppBridge`
- `window.JSBridge`
- `window.SuperApp`

### Cross-Platform:
- `window.ReactNativeWebView`
- `window.flutter_inappwebview`

---

## 📋 What To Tell Your Native App Developers

### Minimal Required Interface:

```javascript
// The native app should inject ONE of these:

// Option 1: Direct injection (simplest)
window.payment = {
  getAuthToken: function(params) {
    // Return promise or call callback
    return { authToken: "..." };
  },
  payOrder: function(params) {
    // Show native payment UI
    // Return result
    return { success: true, ... };
  }
};

// Option 2: iOS WebKit
window.webkit.messageHandlers.payment = {
  postMessage: function(message) {
    // message contains: { method, params, callbackId }
    // Native processes and calls: 
    // webView.evaluateJavaScript("window[callbackId](result)")
  }
};

// Option 3: Android Interface
@JavascriptInterface
public class PaymentBridge {
  public String getAuthToken(String appId) { ... }
  public String payOrder(String params) { ... }
}
webView.addJavascriptInterface(new PaymentBridge(), "payment");
```

---

## 🧪 Testing Steps

### Step 1: Check Debug Panel
Navigate to bundle selection and look for:
```
Platform: [ios/android/web]
WebView Detected: [yes/no]
```

### Step 2: Look for Bridges
Check "Detected Bridges" section:
- If bridges found → Great! Note the name
- If no bridges → Native app not injecting

### Step 3: Test the Bridge
Click "Test Auth Token" button to verify communication works

### Step 4: Check Console
Look for these logs:
```
✅ Payment bridge detected: {name, type, methods}
🌉 Using WebView bridge for getAuthToken
🎯 Using window.payment.payOrder
```

---

## 🔧 What If No Bridge Is Found?

### The debug panel will show:
```
Platform: web
Detected Bridges: (none)
❌ window.payment: NOT FOUND
```

### This means:
1. Not running in SuperApp WebView, OR
2. Native app hasn't injected the JavaScript bridge yet

### Solutions:
1. **Check URL** - Ensure you're accessing via SuperApp, not browser
2. **Wait for injection** - Bridge might load after page (debug panel auto-refreshes)
3. **Check native code** - Ensure WebView properly configured
4. **Add injection timing** - Native should inject BEFORE page loads

---

## 💡 How Our Code Adapts

### Auto-Detection Flow:
```
1. Check window.payment
   ↓ Not found
2. Scan for iOS webkit handlers
   ↓ Not found
3. Scan for Android bridges
   ↓ Not found
4. Check React Native bridge
   ↓ Not found
5. Check Flutter bridge
   ↓ Not found
6. Report: No bridge available
```

### When Bridge is Found:
```javascript
// Our code automatically uses the right method:

// If window.payment exists:
await window.payment.getAuthToken(...)

// If iOS WebKit:
await webViewBridge.callIOSBridge('payment', 'getAuthToken', ...)

// If Android:
await webViewBridge.callAndroidBridge('Android', 'getAuthToken', ...)
```

---

## 📊 Debug Panel Features

### Information Displayed:
- ✅ Platform detection (iOS/Android/Web)
- ✅ WebView detection
- ✅ All available bridges with methods
- ✅ Active payment bridge being used
- ✅ Window keys related to payment/bridge/native
- ✅ User agent string
- ✅ Current URL

### Interactive Tests:
- 🧪 **Test Auth Token** - Try calling native
- 📋 **Log to Console** - Dump all info
- 📄 **Copy Debug Info** - Share with developers

---

## 🎯 Next Steps

1. **Open your app in the SuperApp**
2. **Navigate to bundle selection page**
3. **Check the debug panel** at the bottom
4. **Share what you see:**
   - What platform is detected?
   - Are any bridges found?
   - What's in "Detected Bridges"?
   - What's in "Payment-related window keys"?

The debug panel will tell us exactly how the native app is exposing the payment API, and our code will automatically adapt!

---

## 🚀 Once We Know the Bridge Type

Based on what the debug panel shows, I can:
1. Optimize the bridge detection
2. Add any missing bridge types
3. Configure the exact method calls
4. Remove the temporary bypass

**Check the debug panel and let me know what it shows!** 🔍

