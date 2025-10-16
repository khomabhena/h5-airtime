/**
 * Payment Debug Script
 * Paste this into browser console to diagnose payment issues
 */

console.log('=== PAYMENT DEBUG REPORT ===\n');

// 1. SDK Status
console.log('1️⃣ SDK STATUS:');
console.log('  window.payment exists:', !!window.payment);
if (window.payment) {
  console.log('  Methods available:', Object.keys(window.payment));
  console.log('  payOrder:', typeof window.payment.payOrder);
  console.log('  getAuthToken:', typeof window.payment.getAuthToken);
} else {
  console.error('  ❌ window.payment NOT FOUND!');
  console.log('  → SDK (js-sdk.js) may not be loaded');
  console.log('  → Check Network tab for /js-sdk.js');
}
console.log('');

// 2. Native Bridge
console.log('2️⃣ NATIVE BRIDGE:');
console.log('  AppNativeJsBridge exists:', !!window.AppNativeJsBridge);
if (window.AppNativeJsBridge) {
  console.log('  Methods:', Object.keys(window.AppNativeJsBridge));
} else {
  console.warn('  ⚠️ AppNativeJsBridge NOT FOUND!');
  console.log('  → Not in SuperApp or bridge not injected');
}
console.log('');

// 3. Callback System
console.log('3️⃣ CALLBACK SYSTEM:');
console.log('  AppNativeJsBridgeCallback exists:', !!window.AppNativeJsBridgeCallback);
if (window.AppNativeJsBridgeCallback) {
  console.log('  Callback ID:', window.AppNativeJsBridgeCallback.callbackId);
  console.log('  Active callbacks:', Object.keys(window.AppNativeJsBridgeCallback.callback).length);
} else {
  console.warn('  ⚠️ Callback system NOT FOUND!');
}
console.log('');

// 4. Environment Check
console.log('4️⃣ ENVIRONMENT:');
const userAgent = navigator.userAgent;
const hasCustomer = userAgent.includes('Customer');
const hasPartner = userAgent.includes('Partner');
const isSupported = (hasCustomer || hasPartner) && !!window.AppNativeJsBridge;

console.log('  User Agent:', userAgent);
console.log('  Has "Customer":', hasCustomer);
console.log('  Has "Partner":', hasPartner);
console.log('  Environment Supported:', isSupported ? '✅ YES' : '❌ NO');
console.log('');

// 5. WebView Bridge
console.log('5️⃣ WEBVIEW BRIDGE:');
console.log('  webViewBridge available:', typeof webViewBridge !== 'undefined');
if (typeof webViewBridge !== 'undefined') {
  const debugInfo = webViewBridge.getDebugInfo();
  console.log('  Platform:', debugInfo.platform);
  console.log('  Is WebView:', debugInfo.isWebView);
  console.log('  Bridges found:', debugInfo.bridges.length);
  console.log('  Payment bridge:', debugInfo.paymentBridge?.name || 'NONE');
}
console.log('');

// 6. Test Payment API
console.log('6️⃣ API TEST:');
if (window.payment && window.payment.getAuthToken) {
  console.log('  Testing getAuthToken...');
  window.payment.getAuthToken({ appId: 'AX35182510130000001000103500' })
    .then(result => {
      console.log('  ✅ Auth token SUCCESS:', result);
    })
    .catch(error => {
      console.error('  ❌ Auth token FAILED:', error);
      if (error.code === '1002') {
        console.log('  → Unsupported Environment');
      } else if (error.code === '1001') {
        console.log('  → Timeout - Native not responding');
      }
    });
} else {
  console.error('  ❌ Cannot test - window.payment not available');
}
console.log('');

// 7. Summary
console.log('=== SUMMARY ===');
if (!window.payment) {
  console.error('❌ PROBLEM: SDK not loaded');
  console.log('FIX: Hard refresh (Ctrl+Shift+R) or check /js-sdk.js in Network tab');
} else if (!window.AppNativeJsBridge) {
  console.error('❌ PROBLEM: Not in SuperApp or bridge not injected');
  console.log('FIX: Must open in actual SuperApp application');
} else if (!isSupported) {
  console.error('❌ PROBLEM: Environment check failed');
  console.log('FIX: User agent must contain "Customer" or "Partner"');
} else {
  console.log('✅ All checks passed - SDK should work!');
  console.log('If payment still fails, check Network tab for API errors');
}
console.log('');

console.log('=== END DEBUG REPORT ===');

