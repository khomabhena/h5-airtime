# Payment Error Troubleshooting Guide

## 🔍 How to Debug Payment Errors

### Step 1: Check Browser Console

1. **Open DevTools**
   - Press `F12` or right-click → Inspect
   - Go to "Console" tab

2. **Look for Error Logs**
   
   The payment process now has detailed emoji-based logs:

   ```
   🚀 Starting payment process with data: {...}
   📝 Step 1: Preparing payment...
   📝 Prepare result: {...}
   ✅ Payment prepared successfully
   💳 Payment params: {...}
   🏪 Step 2: Opening cashier...
   ```

3. **Find Where It Failed**
   
   Look for ❌ (red X) emoji to see where the error occurred:
   - `❌ Payment preparation failed` → API call to create order failed
   - `❌ Cashier failed` → SuperApp bridge/window.payment call failed
   - `❌ Payment processing failed` → General error

### Step 2: Check the Error Message

Common errors and their causes:

#### **"Payment preparation failed"**
**Possible Causes:**
- ✗ API endpoint not reachable
- ✗ Invalid credentials (merchantId, appId, serialNo)
- ✗ Signature generation failed
- ✗ Network connection issue

**Check Console For:**
```
❌ Payment preparation failed: [specific error]
```

#### **"Payment bridge failed: No payment bridge found"**
**Possible Causes:**
- ✗ Not running in SuperApp (no window.payment)
- ✗ No WebView bridge detected
- ✗ SuperApp hasn't injected payment API

**Check Debug Panel:**
- Is `window.payment` showing ❌?
- Are any bridges detected?
- What platform is detected?

#### **"Failed to open payment cashier"**
**Possible Causes:**
- ✗ window.payment.payOrder() call failed
- ✗ Invalid payment parameters
- ✗ SuperApp rejected the payment request

**Check Console For:**
```
🌉 Using WebView bridge for payOrder
❌ Bridge error: [specific error]
```

---

## 🔧 Quick Diagnostic Steps

### Test 1: Check API Availability
```javascript
// Open browser console and run:
console.log('window.payment:', window.payment);

// Should show object with getAuthToken and payOrder
// If undefined → not in SuperApp or bridge not injected
```

### Test 2: Check Debug Panel
Scroll to bottom of bundle selection page:
- Platform detected?
- Bridges found?
- Payment API available?

### Test 3: Test Bridge Manually
```javascript
// In console:
if (window.payment) {
  window.payment.getAuthToken({ appId: 'AX35182510130000001000103500' })
    .then(r => console.log('Token:', r))
    .catch(e => console.error('Failed:', e));
}
```

### Test 4: Check Network Tab
1. Open DevTools → Network tab
2. Try payment again
3. Look for API calls:
   - `/v1/pay/pre-transaction/order/place` → Should be 200 OK
   - If 400/401 → Auth/signature issue
   - If 500 → Server error
   - If failed → Network issue

---

## 📋 Common Error Patterns

### Pattern 1: Order Creation Fails
```
❌ Payment preparation failed: HTTP 401
```
**Solution:**
- Check credentials in h5-automation-api/superapp/SuperAppPayment.js
- Verify merchantId, appId, serialNo are correct
- Check private key is valid

### Pattern 2: Signature Invalid
```
❌ Payment preparation failed: Invalid signature
```
**Solution:**
- Ensure private key matches the one registered with Appleseed
- Check timestamp and nonce generation
- Verify message building format

### Pattern 3: Bridge Not Found
```
❌ Payment bridge failed: No payment bridge found
```
**Solution:**
- Confirm running in SuperApp WebView
- Check debug panel for available bridges
- Verify SuperApp has injected payment API
- Try refreshing the page

### Pattern 4: Amount Validation
```
❌ Payment preparation failed: Valid amount is required
```
**Solution:**
- Check bundle price is > 0
- Verify amount conversion to cents (price * 100)
- Ensure amount is a number, not string

---

## 🛠️ Debug Checklist

When error occurs, check:

- [ ] **Browser Console Logs** - What step failed?
- [ ] **Debug Panel** - Is payment API detected?
- [ ] **Network Tab** - Did API call succeed?
- [ ] **Error Message** - What's the specific error?
- [ ] **Payment Data** - Is orderData valid?
- [ ] **SuperApp Environment** - Running in WebView?
- [ ] **Internet Connection** - Network working?

---

## 💡 Getting More Information

### Enhanced Error Display

In development mode, the error message now shows:
- **User Message**: Friendly error description
- **Technical Message**: Actual error from system
- **Error Type**: Category of error
- **Context**: Where error occurred

### Console Logs

Every step of payment process logs:
```
🚀 Starting payment process
📝 Step 1: Preparing payment
✅ Payment prepared
💳 Payment params
🏪 Step 2: Opening cashier
✅ Cashier opened
🔍 Step 3: Querying status
✅ Payment completed!
```

Or on error:
```
❌ Payment preparation failed: [error]
❌ Error stack: [stack trace]
```

---

## 📞 What to Share When Reporting Issues

1. **Error message** from UI
2. **Console logs** (screenshot or copy)
3. **Debug panel info** (click "Copy Debug Info")
4. **Network tab** - status of API calls
5. **Steps to reproduce**

---

## 🔍 Specific Error Solutions

### "SuperApp payment API not available"
1. Not in SuperApp → Open in SuperApp
2. API not injected → Check with app developers
3. Wrong bridge → Check debug panel

### "HTTP 401: Unauthorized"
1. Invalid credentials
2. Wrong signature
3. Expired timestamp
4. Check merchantId, appId, serialNo

### "HTTP 400: Bad Request"
1. Invalid request data
2. Missing required fields
3. Check orderData format

### "HTTP 500: Server Error"
1. Appleseed API issue
2. Contact API support
3. Check API status

### "Network Error"
1. No internet connection
2. API endpoint unreachable
3. Firewall/CORS issue

---

## ✅ If Everything Looks Good But Still Failing

Try these:

1. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R)
   - Clear site data

2. **Check Environment**
   - Ensure in correct environment (UAT vs Production)
   - Verify API endpoint URL

3. **Test with Different Bundle**
   - Try different amount
   - Try different bundle type

4. **Contact Support**
   - Share all debug information
   - Include console logs
   - Provide debug panel snapshot

---

**The enhanced logging will help us identify exactly where and why the payment is failing!** 🔍

