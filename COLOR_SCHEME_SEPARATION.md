# Color Scheme Separation - V1 vs V2

## Overview
V1 and V2 now have separate color schemes to allow independent design experimentation.

---

## V1 - Green Theme 🟢

### Primary Color: `#8dd000` (Lime Green)

### Color File
- **Location**: `src/data/colors.js`
- **Export**: `colors`

### Color Palette
```javascript
app: {
  primary: '#8dd000',        // Main green
  primaryLight: '#8dd00020', // Light green with opacity
  primaryDark: '#65a30d',    // Darker green
}

border: {
  accent: '#8dd000',         // Green border
  focus: '#8dd000',          // Green focus
}

ring: {
  primary: '#8dd000',        // Green focus ring
}
```

### Components Using Green
- `src/components/Button.jsx` - Primary button
- `src/components/Header.jsx` - Back button icon
- `src/components/PaymentFlow.jsx` - Total price color
- `src/components/Confirmation.jsx` - Success icons and status

### Usage
All V1 components automatically use the green theme through the centralized `src/data/colors.js` file.

---

## V2 - Purple Theme 🟣

### Primary Color: `#662d91` (Purple)

### Color File
- **Location**: `v2/data/colorsV2.js`
- **Export**: `colorsV2`

### Color Palette
```javascript
app: {
  primary: '#662d91',        // Main purple
  primaryLight: '#662d9120', // Light purple with opacity
  primaryDark: '#4d2270',    // Darker purple
}

border: {
  accent: '#662d91',         // Purple border
  focus: '#662d91',          // Purple focus
}

ring: {
  primary: '#662d91',        // Purple focus ring
}
```

### V2-Specific Components
- **`v2/components/ButtonV2.jsx`** - Purple-themed button component
- **`v2/data/colorsV2.js`** - V2 color definitions

### V2 Pages Using Purple
- `v2/pages/PhoneInputV2.jsx`
- `v2/pages/RecipientInputV2.jsx`
- `v2/pages/BundleSelectionV2.jsx`
- `v2/pages/PaymentV2.jsx`
- `v2/pages/ConfirmationV2.jsx`

### Hardcoded Purple Colors in V2
All V2 pages use inline styles with `#662d91` for:
- Success icons backgrounds
- Total price text
- Delivery status backgrounds and text
- Checkmarks and status indicators

---

## Key Differences

| Feature | V1 (Green) | V2 (Purple) |
|---------|------------|-------------|
| **Primary Color** | `#8dd000` | `#662d91` |
| **Button Component** | `src/components/Button.jsx` | `v2/components/ButtonV2.jsx` |
| **Colors File** | `src/data/colors.js` | `v2/data/colorsV2.js` |
| **Theme** | Lime Green | Purple |
| **Purpose** | Production/Stable | Experimental |

---

## Benefits of Separation

1. **Independent Experimentation** - V2 can test new colors without affecting V1
2. **Easy Comparison** - Users can switch between versions to compare designs
3. **Rollback Safety** - V1 remains stable while V2 is modified
4. **Clear Organization** - Separate files make it obvious which version uses which colors

---

## How to Change Colors

### To Change V1 Colors:
Edit `src/data/colors.js` and update the hex values.

### To Change V2 Colors:
Edit `v2/data/colorsV2.js` and update the hex values, then update inline styles in V2 pages if needed.

### To Add New Colors:
Add them to the respective color files under appropriate categories (app, text, background, border, state, ring).

---

## Migration Notes

If you want to apply V2 changes to V1 (or vice versa):

1. Compare the color values in both files
2. Update the target color file
3. Search for inline styles with hardcoded hex values
4. Update component imports if needed

---

**Last Updated:** October 18, 2025  
**Status:** Complete ✅

