// Card type detection utility
export const detectCardType = (cardNumber) => {
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Card type patterns
  const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]|^2[2-7]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3[0689]/,
    jcb: /^35/,
    unionpay: /^62/,
    maestro: /^(5[0678]|6)/,
    visaElectron: /^4(026|17500|405|508|844|913|917)/
  };

  // Check each pattern
  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleanNumber)) {
      return type;
    }
  }

  return 'unknown';
};

// Get card type display name
export const getCardTypeName = (cardType) => {
  const cardNames = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    diners: 'Diners Club',
    jcb: 'JCB',
    unionpay: 'UnionPay',
    maestro: 'Maestro',
    visaElectron: 'Visa Electron',
    unknown: 'Unknown Card'
  };

  return cardNames[cardType] || 'Unknown Card';
};

// Get card type color for UI
export const getCardTypeColor = (cardType) => {
  const cardColors = {
    visa: '#1A1F71', // Blue
    mastercard: '#EB001B', // Red
    amex: '#006FCF', // Blue
    discover: '#FF6000', // Orange
    diners: '#0079BE', // Blue
    jcb: '#003A8B', // Dark Blue
    unionpay: '#E60012', // Red
    maestro: '#009639', // Green
    visaElectron: '#1A1F71', // Blue
    unknown: '#6B7280' // Gray
  };

  return cardColors[cardType] || '#6B7280';
};

// Get card type icon (using text-based approach)
export const getCardTypeIcon = (cardType) => {
  const cardIcons = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    diners: '💳',
    jcb: '💳',
    unionpay: '💳',
    maestro: '💳',
    visaElectron: '💳',
    unknown: '💳'
  };

  return cardIcons[cardType] || '💳';
};

// Validate card number length
export const validateCardNumberLength = (cardNumber, cardType) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  const cardLengths = {
    visa: [13, 16],
    mastercard: [16],
    amex: [15],
    discover: [16],
    diners: [14],
    jcb: [15, 16],
    unionpay: [16, 17, 18, 19],
    maestro: [12, 13, 14, 15, 16, 17, 18, 19],
    visaElectron: [16],
    unknown: [13, 14, 15, 16, 17, 18, 19]
  };

  const validLengths = cardLengths[cardType] || [13, 14, 15, 16, 17, 18, 19];
  return validLengths.includes(cleanNumber.length);
};

// Format card number with spaces
export const formatCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const cardType = detectCardType(cleanNumber);
  
  // Different formatting for different card types
  if (cardType === 'amex') {
    // Amex: 4-6-5 format (1234 567890 12345)
    return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  } else {
    // Most cards: 4-4-4-4 format (1234 5678 9012 3456)
    return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
};

// Luhn algorithm validation
export const validateLuhn = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Complete card validation
export const validateCard = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const cardType = detectCardType(cleanNumber);
  
  return {
    isValid: validateLuhn(cleanNumber) && validateCardNumberLength(cleanNumber, cardType),
    cardType,
    cardTypeName: getCardTypeName(cardType),
    cardTypeColor: getCardTypeColor(cardType),
    cardTypeIcon: getCardTypeIcon(cardType),
    formattedNumber: formatCardNumber(cleanNumber)
  };
};


