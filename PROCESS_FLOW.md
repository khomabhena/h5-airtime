# 📱 H5 Airtime App - Process Flow Documentation

## 🎯 Overview

Complete user journey and technical flow for the H5 Airtime application with both V1 (Original) and V2 (SuperApp Style) interfaces.

---

## 🔄 V1 Process Flow (Original UI)

### **User Journey Steps**

```
1. PhoneInput (/) 
   ↓ [Continue Button]
2. RecipientInput (/recipient) [ONLY if "For Someone Else"]
   ↓ [Continue Button]
3. BundleSelection (/bundles)
   ↓ [Select Bundle + Continue]
4. PaymentFlow (/payment)
   ↓ [Process Payment]
5. Confirmation (/confirmation)
   ↓ [Send Another Button]
1. PhoneInput (/) [Loop back to start]
```

### **Step 1: PhoneInput (`/`)**
**Purpose:** Enter phone number and select topup type

**User Actions:**
- Select country from dropdown
- Enter phone number
- Choose "For Myself" or "For Someone Else"
- Click Continue

**Validation:**
- Phone number format validation
- Carrier detection
- Number completeness check

**Navigation Logic:**
- If "For Myself" → Skip to Step 3 (BundleSelection)
- If "For Someone Else" → Go to Step 2 (RecipientInput)

**State Updates:**
```javascript
phoneData: {
  phoneNumber: string,
  country: object,
  carrier: object
}
topUpType: 'myself' | 'someone'
```

---

### **Step 2: RecipientInput (`/recipient`)** [Conditional]
**Purpose:** Enter recipient phone number (only for "someone else" flow)

**User Actions:**
- Enter recipient's phone number
- Click Continue

**Validation:**
- Same phone validation as Step 1
- Carrier detection for recipient

**State Updates:**
```javascript
phoneData: {
  ...phoneData,
  recipientNumber: string,
  recipientCarrier: object
}
```

**Navigation:** Always proceed to Step 3

---

### **Step 3: BundleSelection (`/bundles`)**
**Purpose:** Select airtime bundle or enter custom amount

**User Actions:**
- Choose bundle type: Airtime, Data, or SMS
- Select predefined bundle OR enter custom amount
- Click Continue

**Bundle Options:**
- Predefined bundles from `src/data/bundles.js`
- Custom airtime input with amount validation
- Bundle validation and pricing

**State Updates:**
```javascript
selectedBundle: {
  id: string,
  name: string,
  amount: string,
  price: number,
  type: string
}
```

**Navigation:** Proceed to Step 4

---

### **Step 4: PaymentFlow (`/payment`)**
**Purpose:** Complete payment for selected bundle

**User Actions:**
- Select payment method (Card, etc.)
- Enter card details (number, expiry, CVV, name)
- Review order summary
- Click Pay Now

**Payment Processing:**
- Card validation (Luhn algorithm)
- SuperApp SDK integration
- Secure payment processing

**State Updates:**
```javascript
paymentData: {
  method: string,
  amount: number,
  cardDetails: object,
  transactionId: string,
  status: string
}
```

**Navigation:** On success → Step 5

---

### **Step 5: Confirmation (`/confirmation`)**
**Purpose:** Display successful transaction and provide next actions

**Display Elements:**
- Success indicator with checkmark
- Transaction details summary
- Delivery status confirmation
- Action buttons

**User Actions:**
- Click "Send Another" → Returns to Step 1
- Click "Print Receipt" → Prints transaction details
- Contact support if needed

**No State Updates:** Read-only display

---


## 🔀 UI Version Switching

### **Switcher Component**
**Location:** Floating panel in bottom-right corner

**Functionality:**
- Toggle between V1 and V2 UIs instantly
- Automatic route mapping between versions
- Preserve current step context when switching

**Route Mapping:**
```
V1 → V2 Mapping:
/ → /v2
/bundles → /v2/bundles
/payment → /v2/payment
/confirmation → /v2/success

V2 → V1 Mapping:
/v2 → /
/v2/bundles → /bundles
/v2/payment → /payment
/v2/success → /confirmation
```

---

## 📊 State Management

### **Main App State Structure**
```javascript
const [phoneData, setPhoneData] = useState({
  phoneNumber: '',           // User's phone number
  country: null,             // Selected country object
  carrier: null,             // Detected carrier
  recipientNumber: '',       // Recipient phone (for "someone else")
  recipientCarrier: null     // Recipient carrier
});

const [topUpType, setTopUpType] = useState('myself'); // 'myself' | 'someone'
const [selectedBundle, setSelectedBundle] = useState(null);
const [paymentData, setPaymentData] = useState(null);
```

### **State Flow Through Steps**
```
Step 1 (PhoneInput) → phoneData, topUpType
    ↓
Step 2 (RecipientInput) → phoneData.recipientNumber, phoneData.recipientCarrier
    ↓
Step 3 (BundleSelection) → selectedBundle
    ↓
Step 4 (PaymentFlow) → paymentData
    ↓
Step 5 (Confirmation) → Display all collected state
```

---

## 🎨 Design Differences Summary

| Feature | V1 (Original) | V2 (SuperApp Style) |
|---------|---------------|---------------------|
| **Background** | Purple gradient | Clean white |
| **Layout Style** | Card-based with shadows | Minimal, flat design |
| **Primary Buttons** | Purple (#662d91) | Light green (#90EE90) |
| **Flow Steps** | 4-5 steps (conditional) | 4 steps (always direct) |
| **Bundle Selection** | Predefined + custom options | Focus on custom amount |
| **Amount Entry** | Type directly | Numeric keypad |
| **Payment Style** | Card form interface | QR code generation |
| **Visual Style** | Modern, colorful | SuperApp platform matching |

---

## 🔧 Technical Implementation

### **Routing Structure**
```javascript
// V1 Routes (Original UI)
/ → PhoneInput
/recipient → RecipientInput (conditional)
/bundles → BundleSelection
/payment → PaymentFlow
/confirmation → Confirmation

// V2 Routes (SuperApp Style)
/v2 → PhoneInputV2
/v2/bundles → BundleSelectionV2
/v2/payment → PaymentV2
/v2/success → SuccessV2
```

### **Component Architecture**
```
src/
├── components/              # V1 Components (Original)
│   ├── PhoneInput.jsx
│   ├── RecipientInput.jsx
│   ├── BundleSelection.jsx
│   ├── PaymentFlow.jsx
│   └── Confirmation.jsx
└── v2/
    ├── AppV2.jsx           # V2 Main App
    ├── pages/              # V2 Page Components
    │   ├── PhoneInputV2.jsx
    │   ├── BundleSelectionV2.jsx
    │   ├── PaymentV2.jsx
    │   └── SuccessV2.jsx
    └── components/
        └── UIVersionSwitcher.jsx
```

---

## 📱 Mobile Optimization

### **Responsive Design Principles**
- **Mobile-First:** Designed for mobile devices first
- **Touch Targets:** Minimum 44px for all interactive elements
- **Input Fields:** Large, easy-to-tap input fields
- **Button Placement:** Thumb-friendly navigation

### **Performance Considerations**
- **Lazy Loading:** Components loaded on demand
- **State Persistence:** Maintain state during navigation
- **Error Handling:** Graceful degradation with user feedback
- **Loading States:** Clear feedback during processing

---

## 🔒 Security & Validation

### **Input Validation**
- **Phone Numbers:** Country-specific format validation
- **Payment Cards:** Luhn algorithm validation
- **Amounts:** Range and format validation
- **Real-time Feedback:** Immediate validation results

### **Payment Security**
- **SuperApp SDK:** Secure payment processing
- **No Card Storage:** PCI compliance maintained
- **Encrypted Communication:** HTTPS/TLS encryption
- **Transaction Logging:** Complete audit trail

---

## 🚀 SuperApp Integration

### **Bridge Detection**
- **Automatic Detection:** SuperApp environment detection
- **Payment API:** Native payment processing integration
- **Error Handling:** Graceful fallbacks for non-SuperApp environments
- **Debug Tools:** Development debugging panels

### **Browser Compatibility**
- **Modern Browsers:** Chrome, Firefox, Safari, Edge support
- **Mobile Browsers:** iOS Safari, Android Chrome optimization
- **WebView Support:** SuperApp WebView integration
- **Fallback Support:** Non-SuperApp environment compatibility

---

## 📋 Testing Scenarios

### **V1 Flow Testing**
1. **Complete Flow (For Myself):**
   - Enter phone → Select bundle → Payment → Confirmation
2. **Complete Flow (For Someone Else):**
   - Enter phone → Enter recipient → Select bundle → Payment → Confirmation
3. **Error Scenarios:**
   - Invalid phone numbers, payment failures, network errors

### **V2 Flow Testing**
1. **SuperApp Style Flow:**
   - Enter phone → Custom amount → QR payment → Success
2. **UI Switching:**
   - Switch between V1 and V2 mid-flow with state preservation

---

## 🎯 Success Metrics

### **User Experience Metrics**
- **Completion Rate:** Percentage of successful topups
- **Error Rate:** Failed transactions and recovery success
- **Time to Complete:** Average flow completion time
- **User Preference:** V1 vs V2 usage statistics

### **Technical Performance Metrics**
- **Load Times:** Page and component load performance
- **API Response:** Payment processing response times
- **Error Handling:** Graceful error recovery success rate
- **Mobile Performance:** Touch responsiveness metrics

---

**This process flow ensures consistent user experience across both UI versions while maintaining the same business logic and state management architecture.**