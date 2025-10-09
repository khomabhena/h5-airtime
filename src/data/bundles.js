// Bundle data and utilities for H5 Airtime Application

export const bundleTypes = {
  airtime: {
    name: 'Airtime',
    icon: 'airtime',
    description: 'Voice calls and basic services'
  },
  data: {
    name: 'Data',
    icon: 'data', 
    description: 'Internet data packages'
  },
  sms: {
    name: 'SMS',
    icon: 'sms',
    description: 'Text messaging packages'
  }
};

export const getBundlesByType = (type) => {
  const bundles = {
    airtime: [
      { 
        id: 1, 
        name: 'Small Top-up', 
        amount: 5, 
        price: 5.50, 
        description: 'Perfect for a quick call',
        popular: false
      },
      { 
        id: 2, 
        name: 'Medium Top-up', 
        amount: 10, 
        price: 11.00, 
        description: 'Great for daily use',
        popular: true
      },
      { 
        id: 3, 
        name: 'Large Top-up', 
        amount: 20, 
        price: 22.00, 
        description: 'Best value for money',
        popular: false
      },
      { 
        id: 4, 
        name: 'Extra Large', 
        amount: 50, 
        price: 55.00, 
        description: 'Maximum value',
        popular: false
      }
    ],
    data: [
      { 
        id: 5, 
        name: '1GB Data', 
        amount: '1GB', 
        price: 8.00, 
        description: 'Light browsing and messaging',
        popular: false
      },
      { 
        id: 6, 
        name: '3GB Data', 
        amount: '3GB', 
        price: 15.00, 
        description: 'Social media and streaming',
        popular: true
      },
      { 
        id: 7, 
        name: '5GB Data', 
        amount: '5GB', 
        price: 25.00, 
        description: 'Heavy usage and downloads',
        popular: false
      },
      { 
        id: 8, 
        name: '10GB Data', 
        amount: '10GB', 
        price: 45.00, 
        description: 'Unlimited browsing',
        popular: false
      }
    ],
    sms: [
      { 
        id: 9, 
        name: '50 SMS', 
        amount: '50 SMS', 
        price: 3.00, 
        description: 'Quick messages',
        popular: false
      },
      { 
        id: 10, 
        name: '100 SMS', 
        amount: '100 SMS', 
        price: 5.50, 
        description: 'Regular messaging',
        popular: true
      },
      { 
        id: 11, 
        name: '200 SMS', 
        amount: '200 SMS', 
        price: 10.00, 
        description: 'Heavy messaging',
        popular: false
      },
      { 
        id: 12, 
        name: '500 SMS', 
        amount: '500 SMS', 
        price: 22.00, 
        description: 'Maximum SMS value',
        popular: false
      }
    ]
  };

  return bundles[type] || [];
};

export const getBundleById = (id) => {
  const allBundles = [
    ...getBundlesByType('airtime'),
    ...getBundlesByType('data'),
    ...getBundlesByType('sms')
  ];
  return allBundles.find(bundle => bundle.id === id);
};

export const getPopularBundles = () => {
  const allBundles = [
    ...getBundlesByType('airtime'),
    ...getBundlesByType('data'),
    ...getBundlesByType('sms')
  ];
  return allBundles.filter(bundle => bundle.popular);
};
