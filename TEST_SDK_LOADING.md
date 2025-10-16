# Test SDK Loading

## 🔍 The Error: "Payment bridge failed: undefined"

This means `window.payment.payOrder` is being called but something is wrong with the SDK or the call itself.

---

## ✅ Step-by-Step Debug

### Step 1: Check if SDK File Loads

1. **Open DevTools** (F12)
2. Go to **Network** tab
3. **Reload the page** (Ctrl+R)
4. **Search for "js-sdk"**
5. You should see:
   ```
   js-sdk.js    200 OK    [size]
   ```

**If you see 404** → SDK file not found, fix the path
**If you don't see it at all** → SDK not being requested

---

### Step 2: Check Console Immediately After Page Load

Look for:
```javascript
// Should show from SDK
call js api checkJsApi
```

If you DON'T see this, the SDK didn't initialize.

---

### Step 3: Run This in Console Right Now

```javascript
console.log('=== SDK CHECK ===');
console.log('1. window.payment:', window.payment);
console.log('2. Has payOrder:', typeof window.payment?.payOrder);
console.log('3. AppNativeJsBridge:', window.AppNativeJsBridge);
console.log('4. AppNativeJsBridgeCallback:', window.AppNativeJsBridgeCallback);

// If window.payment exists, test it
if (window.payment && window.payment.payOrder) {
  console.log('✅ SDK is loaded and payOrder exists');
  console.log('All payment methods:', Object.keys(window.payment));
} else if (window.payment) {
  console.error('❌ window.payment exists but payOrder is missing!');
  console.log('Available methods:', Object.keys(window.payment));
} else {
  console.error('❌ window.payment does NOT exist - SDK not loaded!');
}
```

---

### Step 4: Look at Payment Preparation Logs

When you click "Pay Now", look for these new detailed logs:

```
🔍 Checking payment API availability...
  window.payment exists: true/false
  window.payment.payOrder exists: true/false
  AppNativeJsBridge exists: true/false
```

**Share what these show!**

---

## 🎯 Likely Causes

### Cause 1: SDK File Not Loading (Most Likely)
**Symptoms:**
- `window.payment exists: false`
- No "call js api" messages in console
- js-sdk.js shows 404 in Network tab

**Fix:**
```bash
# Check if file exists
ls public/js-sdk.js

# If missing, copy it again
cp h5-automation-api/superapp/js-sdk.js public/js-sdk.js

# Restart dev server
npm run dev
```

### Cause 2: SDK Loaded But payOrder Missing
**Symptoms:**
- `window.payment exists: true`
- `window.payment.payOrder exists: false`

**Fix:**
- Check what methods ARE available: `Object.keys(window.payment)`
- SDK might be wrong version

### Cause 3: Not in SuperApp Environment
**Symptoms:**
- `window.payment exists: true`
- `window.payment.payOrder exists: true`
- `AppNativeJsBridge exists: false`
- Error code: 1002 (Unsupported Environment)

**Fix:**
- Must open in actual SuperApp
- User agent must have "Customer" or "Partner"

### Cause 4: SDK Error Code 1001
**Symptoms:**
- Everything exists
- But get error code: 1001 (Timeout)

**Fix:**
- Native app not responding
- Check native bridge implementation

---

## 📋 What to Share

**Run the Step 3 script above and tell me:**

1. **Does `window.payment` exist?** (object or undefined?)
2. **Does `window.payment.payOrder` exist?** (function or undefined?)
3. **What do you see in Network tab** for js-sdk.js?
4. **What are the new detailed logs** showing when you click Pay Now?

---

## 🔧 Quick Fix to Try

### Hard Refresh Everything:
```bash
1. Stop dev server (Ctrl+C)
2. Clear browser cache completely
3. Restart dev server: npm run dev
4. Hard refresh browser: Ctrl+Shift+R
5. Check console for "call js api" messages
```

---

## 💡 Expected Behavior

When SDK loads properly, you should see:

```javascript
// In console
window.payment = {
  payOrder: ƒ k(e),
  getAuthToken: ƒ A(e),
  close: ƒ b(),
  open: ƒ g(e),
  // ... more methods
}

// All these should log 'function'
typeof window.payment.payOrder    // "function"
typeof window.payment.getAuthToken // "function"
```

**Run the SDK CHECK script and share the output!** 🔍

