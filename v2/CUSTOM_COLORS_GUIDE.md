# Custom Colors Guide for V2

## Overview
The `ReusableButton` component now accepts a `customColors` prop, allowing V2 to use purple colors while V1 uses green colors.

---

## How It Works

### ReusableButton Enhancement
The `ReusableButton` component in `src/components/buttons/ReusableButton.jsx` now accepts an optional `customColors` prop:

```javascript
<ReusableButton
  variant="selection"
  selected={true}
  customColors={colorsV2}  // Pass V2 purple colors
>
  Button Text
</ReusableButton>
```

### Color Priority
1. **Custom Colors** - If `customColors` prop is provided, use those
2. **Default Colors** - If no `customColors` prop, use `src/data/colors.js` (green theme)

---

## V2 Implementation

### Import V2 Colors
```javascript
import { colorsV2 } from '../data/colorsV2';
```

### Pass to Buttons
```javascript
<ReusableButton
  onClick={handleClick}
  selected={isSelected}
  variant="selection"  // or "card"
  customColors={colorsV2}  // Purple theme
>
  Button Content
</ReusableButton>
```

---

## Current V2 Pages Using Custom Colors

### 1. **PhoneInputV2.jsx**
- **Buttons**: "For Me" and "For a friend"
- **Colors**: Purple (`#662d91`)

```javascript
<ReusableButton
  selected={topUpType === 'myself'}
  variant="selection"
  customColors={colorsV2}
>
  For Me
</ReusableButton>
```

### 2. **BundleSelectionV2.jsx**
- **Buttons**: Bundle type selectors (Airtime, Data, etc.) and bundle cards
- **Colors**: Purple (`#662d91`)

```javascript
<ReusableButton
  selected={bundleType === key}
  variant="selection"
  customColors={colors}  // colors is imported as colorsV2
>
  {type.name}
</ReusableButton>
```

---

## Benefits

### 1. **No Code Duplication**
- V1 and V2 share the same `ReusableButton` component
- No need to maintain separate button components

### 2. **Easy Color Changes**
- Change V2 colors in one file: `v2/data/colorsV2.js`
- All V2 buttons automatically update

### 3. **Flexible**
- Can easily test different color schemes
- Can override colors on a per-button basis if needed

### 4. **V1 Unaffected**
- V1 continues to use default green colors
- No changes needed to V1 code

---

## Customizing Colors

### To Change V2 Button Colors:

1. Edit `v2/data/colorsV2.js`
2. Update the `app` section:

```javascript
app: {
  primary: '#YOUR_COLOR',        // Main color for buttons
  primaryLight: '#YOUR_COLOR20', // Light version (20% opacity)
  primaryDark: '#DARKER_COLOR',  // Darker version for hover
}
```

3. The changes apply automatically to all buttons using `customColors={colorsV2}`

### To Add New Color Variants:

Add them to `v2/data/colorsV2.js` under appropriate categories:

```javascript
state: {
  success: '#10b981',
  error: '#ef4444',
  custom: '#YOUR_COLOR',  // New custom color
}
```

---

## Color Properties Used by Buttons

| Property | Used For |
|----------|----------|
| `app.primary` | Selected button background/border |
| `app.primaryDark` | Hover state background |
| `ring.primary` | Focus ring color |

---

## Future Enhancements

### InputField Colors (Coming Soon)
The `InputField` component will also accept a `customColors` prop to allow:
- Custom border colors
- Custom focus colors
- Custom error colors

This will complete the V2 purple theme across all interactive elements.

---

**Last Updated:** October 18, 2025  
**Status:** Buttons Implemented ✅

