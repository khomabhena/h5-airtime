# V2 UI - SuperApp Design

## 🎨 Overview

This is an alternative UI design based on the SuperApp screenshots, matching the visual style and interaction patterns of the SuperApp platform.

---

## 📁 Structure

```
v2/
├── AppV2.jsx                 # Main V2 app component
├── components/
│   └── UIVersionSwitcher.jsx # Switch between V1 and V2
├── pages/
│   ├── PhoneInputV2.jsx      # Phone number input (SuperApp style)
│   ├── BundleSelectionV2.jsx # Airtime selection with keypad
│   └── PaymentV2.jsx         # QR code payment style
├── screenshots/              # Design reference screenshots
└── README.md                 # This file
```

---

## 🚀 How to Use

### Access V2 UI:

**Option 1: Direct URL**
```
http://localhost:5173/v2
```

**Option 2: UI Switcher**
- Look for the switcher in bottom-right corner (development mode)
- Click "V2 SuperApp" button

---

## 🎨 Design Differences from V1

### V1 (Original):
- Colorful gradient backgrounds
- Card-based layout
- Modern, spacious design
- Multiple steps with cards

### V2 (SuperApp Style):
- Clean white background
- Minimal borders
- Compact layout
- Matches SuperApp platform
- Light green action buttons
- Numeric keypad for amount input
- QR code generation interface

---

## 📱 V2 Pages

### 1. **PhoneInputV2**
**Features:**
- Clean header with back button
- Split input: country code + phone number
- Clear button (X) on phone input
- Contacts button
- Purple continue button (full width, rounded)

**Route:** `/v2`

### 2. **BundleSelectionV2**
**Features:**
- "Airtime" tab with underline
- Custom amount input field
- Full numeric keypad (1-9, 0, decimal)
- Backspace button
- Green confirm button
- Service fees display
- Total amount calculation
- Light green checkout button

**Route:** `/v2/bundles`

### 3. **PaymentV2**
**Features:**
- Account selection with flag icons
- Balance display
- Amount preview
- Light green "Generate QR Code" button
- Matches SuperApp payment style

**Route:** `/v2/payment`

---

## 🔄 Switching Between UIs

### Development Mode:

A floating switcher appears in bottom-right corner:

```
┌──────────────────┐
│ UI Version       │
│ [V1] [V2]       │
│ Current: V1      │
└──────────────────┘
```

- Click **V1 Original** for current UI
- Click **V2 SuperApp** for SuperApp-style UI
- Automatically maps routes between versions

### Production:

Add `?switcher=true` to URL to show switcher:
```
https://your-app.com/?switcher=true
```

---

## 🎨 Color Scheme

V2 uses simplified colors matching SuperApp:

- **Primary Action**: Light green (`#90EE90`) - matches SuperApp
- **Purple Accent**: `#662d91` - for branding
- **Background**: White
- **Text**: Black/Dark gray
- **Borders**: Light gray
- **Inputs**: Light gray background

---

## 📋 Features

### ✅ Implemented:
- Phone number input with split fields
- Numeric keypad for amount entry
- Account selection interface
- Service fees calculation
- Clean, minimal design
- Route mapping between V1 and V2
- UI version switcher

### 🔄 Shared with V1:
- Uses same color system (`src/data/colors.js`)
- Uses same data layer
- Same state management
- Same routing structure

---

## 🔧 Customization

### Change Button Color:
```jsx
// In any V2 component
style={{backgroundColor: '#90EE90'}}  // Light green (SuperApp style)
// Or use purple:
style={{backgroundColor: colors.app.primary}}
```

### Add New V2 Page:
1. Create in `v2/pages/NewPageV2.jsx`
2. Add route in `v2/AppV2.jsx`
3. Update switcher mapping if needed

---

## 🎯 Development Workflow

### Working on V1:
```
Navigate to: /
Work in: src/components/
```

### Working on V2:
```
Navigate to: /v2
Work in: v2/pages/ and v2/components/
```

### Testing Both:
Use the UI switcher to quickly jump between versions

---

## 📦 Next Steps

### To Add:
- [ ] Success page for V2
- [ ] Bundle/package selection (not just custom airtime)
- [ ] QR code generation logic
- [ ] Error states matching SuperApp
- [ ] Loading states
- [ ] Animations/transitions

### To Enhance:
- [ ] Add more SuperApp-specific features
- [ ] Implement all screenshot designs
- [ ] Add SuperApp color themes
- [ ] Match exact spacing and typography

---

## 🎨 Design References

Screenshots in `v2/screenshots/` folder:
- Phone input design
- Custom amount keypad
- Payment/QR code interface
- Account selection
- Service fees display

---

**V2 UI is now available! Visit `/v2` to see the SuperApp-style interface!** 🎉

