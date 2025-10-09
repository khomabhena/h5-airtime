// Payment data and utilities for H5 Airtime Application

export const paymentMethods = [
  { 
    id: 'card', 
    name: 'Credit/Debit Card', 
    icon: '💳',
    description: 'Visa, Mastercard, American Express',
    enabled: true
  },
  { 
    id: 'ecocash', 
    name: 'EcoCash', 
    icon: '📱',
    description: 'Zimbabwe mobile money',
    enabled: true
  },
  { 
    id: 'onemoney', 
    name: 'OneMoney', 
    icon: '💰',
    description: 'Zimbabwe mobile money',
    enabled: true
  },
  { 
    id: 'telecash', 
    name: 'Telecash', 
    icon: '💸',
    description: 'Zimbabwe mobile money',
    enabled: true
  },
  { 
    id: 'bank_transfer', 
    name: 'Bank Transfer', 
    icon: '🏦',
    description: 'Direct bank transfer',
    enabled: false
  }
];

export const getPaymentMethodById = (id) => {
  return paymentMethods.find(method => method.id === id);
};

export const getEnabledPaymentMethods = () => {
  return paymentMethods.filter(method => method.enabled);
};

export const validateCardDetails = (cardDetails) => {
  const errors = {};
  
  if (!cardDetails.number || cardDetails.number.length < 16) {
    errors.number = 'Please enter a valid card number';
  }
  
  if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
    errors.expiry = 'Please enter expiry in MM/YY format';
  }
  
  if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
    errors.cvv = 'Please enter a valid CVV';
  }
  
  if (!cardDetails.name || cardDetails.name.length < 2) {
    errors.name = 'Please enter cardholder name';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatCardNumber = (number) => {
  return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
};

export const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const processPayment = async (paymentData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: generateTransactionId(),
        timestamp: new Date().toISOString(),
        amount: paymentData.amount,
        method: paymentData.method
      });
    }, 2000);
  });
};
