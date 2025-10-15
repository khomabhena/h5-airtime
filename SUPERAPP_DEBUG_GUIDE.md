# SuperApp Integration Debug Guide

## 🔧 Issue: "Payment API Not Detected" in SuperApp

### What I've Added:

#### 1. **Enhanced Payment API Detection** (`src/services/paymentService.js`)
- Added detailed logging to show what's available on the window object
- Console logs will show:
  - ✅ if `window.payment` is detected
  - ❌ if not found, with list of payment-related keys

#### 2. **SuperApp Debug Panel** (`src/components/SuperAppDebug.jsx`)
- **Location**: Bottom of the screen on bundle selection page
- **Shows**:
  - Payment API status (✅ or ❌)
  - Available payment methods
  - SuperApp APIs availability
  - User agent and URL info
  
**Features:**
- 🧪 **Test Auth Token** - Try to call `window.payment.getAuthToken()`
- 📋 **Log to Console** - Dump all info to browser console
- 📄 **Copy Debug Info** - Copy debug data to clipboard

#### 3. **Temporary Bypass** (`src/components/BundleSelection.jsx`)
- Added `forcePaymentFlow = true` to allow payment testing
- Payment will proceed even if API not detected
- This helps us debug the actual payment flow

---

## 🔍 How to Debug:

### Step 1: Check the Debug Panel
1. Navigate to bundle selection page
2. Scroll to the bottom to see the debug panel
3. Look for the **window.payment** status

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for these logs:
   ```
   ✅ SuperApp payment API detected: {getAuthToken: f, payOrder: f}
   ```
   OR
   ```
   ❌ SuperApp payment API not found
   Available on window: [...payment-related keys...]
   ```

### Step 3: Test the API
Click "Test Auth Token" button in debug panel to see if the API responds.

### Step 4: Check What's Actually Available

The SuperApp might expose the payment API under a different name. Common variations:

- `window.payment` ✅ Standard
- `window.Payment`
- `window.superapp`
- `window.webkit.messageHandlers.payment`
- `window.android.payment`
- `window.jsBridge`

The debug panel will show all payment-related window keys.

---

## 🎯 Expected Behavior:

### If SuperApp API is Available:
```javascript
window.payment = {
  getAuthToken: function() { ... },
  payOrder: function() { ... }
}
```

### Debug Panel Should Show:
```
✅ window.payment: AVAILABLE
Payment Methods:
  • getAuthToken
  • payOrder
```

---

## 🔧 Quick Fixes:

### Fix 1: Check SuperApp Version
Make sure you're using the latest SuperApp version that includes the payment API.

### Fix 2: Wait for API to Load
The SuperApp might inject the API after page load. The debug panel auto-refreshes every 2 seconds.

### Fix 3: Check URL Parameters
Add your token to the URL if required:
```
http://your-app.com/?token=your-token-here
```

### Fix 4: Manual API Test
Open browser console and run:
```javascript
// Check if payment API exists
console.log('window.payment:', window.payment);

// Try to get auth token
if (window.payment && window.payment.getAuthToken) {
  window.payment.getAuthToken().then(result => {
    console.log('Auth token result:', result);
  });
}
```

---

## 📱 SuperApp Requirements:

For the payment API to work, the SuperApp must:

1. ✅ Inject `window.payment` object
2. ✅ Provide `getAuthToken()` method
3. ✅ Provide `payOrder()` method
4. ✅ Load the API before React app initializes

---

## 🧪 Testing Flow:

### Current Setup (Temporary):
```
forcePaymentFlow = true
```
This means payment will proceed even if API not detected, allowing you to:
1. See the order creation request
2. Check signature generation
3. Test the full flow
4. Debug any API errors

### Once API is Detected:
Set `forcePaymentFlow = false` to enforce API requirement.

---

## 📊 What to Share for Support:

If you need help, share these from the debug panel:

1. **Payment API Status**: ✅ or ❌
2. **Payment Methods**: List of available methods
3. **User Agent**: Browser/app info
4. **Window Keys**: Payment-related keys found
5. **Console Logs**: Any error messages

Click "Copy Debug Info" to get all this in one click.

---

## 🔍 Common Issues & Solutions:

### Issue 1: API Loads After React
**Solution**: Debug panel auto-refreshes every 2 seconds

### Issue 2: Different API Name
**Solution**: Check "Payment-related window keys" in debug panel

### Issue 3: iOS vs Android
**Solution**: Check User Agent and look for platform-specific APIs:
- iOS: `window.webkit.messageHandlers`
- Android: `window.android`

### Issue 4: Token Required First
**Solution**: Some SuperApps require getting a token from URL first:
```javascript
// Extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
```

---

## 🎨 Debug Panel Controls:

### Show/Hide:
- **Show**: Automatically visible on bundle selection page
- **Hide**: Click the ✕ button
- **Force Show**: Add `?debug=true` to URL

### In Production:
The debug panel only shows:
- In development mode (`NODE_ENV=development`)
- OR when `?debug=true` is in URL

---

## 📝 Next Steps:

1. **Check the debug panel** when you open the bundle selection
2. **Look at browser console** for detailed logs
3. **Click "Test Auth Token"** to verify API works
4. **Share the results** so we can identify the exact issue

The debug panel will tell us exactly what's available in your SuperApp environment! 🔍

---

## 🚀 Once API is Detected:

When we confirm the API is working:

1. Remove `forcePaymentFlow = true`
2. Remove or hide the debug panel
3. Deploy to production

---

**The debug panel is now active. Check it out and let me know what it shows!** 🎉

