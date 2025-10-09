# H5 Airtime Mini-App - Developer Documentation

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with mobile-first responsive design
- **State Management**: Redux Toolkit with RTK Query
- **HTTP Client**: Axios with interceptors
- **Validation**: React Hook Form with Yup schemas
- **Routing**: React Router v6
- **PWA**: Service Worker for offline capability
- **Bundle Size**: Optimized for <2MB total

## External API Integration

### Phone Number Validation Service
```typescript
// External API integration for phone validation
interface PhoneValidationService {
  validatePhone(phoneNumber: string): Promise<ValidationResult>;
  detectCountry(phoneNumber: string): Promise<Country>;
  detectMNO(phoneNumber: string): Promise<MNO>;
}

interface ValidationResult {
  isValid: boolean;
  formattedNumber: string;
  country: string;
  mno: string;
  networkType: string;
  error?: string;
}

// Zimbabwe-specific examples
const zimbabweExamples = {
  econet: '+263771234567',    // Econet number
  netone: '+263712345678',    // NetOne number  
  telecel: '+263733123456'    // Telecel number
};
```

### Bundle Discovery Service
```typescript
// External API for bundle discovery
interface BundleService {
  fetchBundles(mnoId: string, country: string): Promise<Bundle[]>;
  getBundleDetails(bundleId: string): Promise<BundleDetails>;
}

interface Bundle {
  id: string;
  type: 'airtime' | 'data' | 'sms';
  amount: number;
  currency: string;
  description: string;
  validity?: string;
  dataAmount?: string;
}

// Zimbabwe-specific bundle examples
const zimbabweBundles = {
  econet: [
    { id: 'airtime_5', type: 'airtime', amount: 5, currency: 'USD', description: '$5 Airtime' },
    { id: 'data_1gb', type: 'data', amount: 10, currency: 'USD', dataAmount: '1GB', validity: '30 days' },
    { id: 'sms_100', type: 'sms', amount: 3, currency: 'USD', description: '100 SMS', validity: '30 days' }
  ],
  netone: [
    { id: 'airtime_10', type: 'airtime', amount: 10, currency: 'USD', description: '$10 Airtime' },
    { id: 'data_2gb', type: 'data', amount: 15, currency: 'USD', dataAmount: '2GB', validity: '30 days' }
  ]
};
```

### Payment Gateway Integration
```typescript
// External payment gateway integration
interface PaymentService {
  processPayment(paymentData: PaymentRequest): Promise<PaymentResult>;
  validatePaymentMethod(method: string): Promise<boolean>;
}

interface PaymentRequest {
  bundleId: string;
  recipientPhone: string;
  paymentMethod: string;
  paymentToken: string;
  amount: number;
  currency: string;
}

// Zimbabwe payment methods
const zimbabwePaymentMethods = {
  ecocash: 'EcoCash (Econet)',
  onemoney: 'OneMoney (NetOne)', 
  telecash: 'Telecash (Telecel)',
  bankTransfer: 'Bank Transfer (Zimbabwe banks)',
  usdCard: 'USD Credit/Debit Card'
};
```

## Local Storage & State Management

### Redux Store Structure
```typescript
// Store configuration
interface RootState {
  phone: PhoneState;
  bundles: BundleState;
  payment: PaymentState;
  user: UserState;
  ui: UIState;
}

interface PhoneState {
  phoneNumber: string;
  country: Country | null;
  mno: MNO | null;
  isValid: boolean;
  error: string | null;
}

interface BundleState {
  bundles: Bundle[];
  selectedBundle: Bundle | null;
  loading: boolean;
  error: string | null;
}

interface PaymentState {
  paymentMethod: string;
  paymentToken: string | null;
  transactionId: string | null;
  status: 'idle' | 'processing' | 'success' | 'error';
  error: string | null;
}
```

### Local Storage Schema
```typescript
// Local storage for offline capability
interface LocalStorageData {
  userPreferences: {
    language: string;
    currency: string;
    recentNumbers: string[];
  };
  cachedBundles: {
    [mnoId: string]: Bundle[];
    timestamp: number;
  };
  transactionHistory: Transaction[];
}
```

## React Hooks & Services

### Phone Number Validation Hook
```typescript
// Custom hook for phone number validation
export const usePhoneValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  const validatePhone = async (phoneNumber: string): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      // E.164 format validation with Zimbabwe support
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      if (!e164Regex.test(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }
      
      // Zimbabwe-specific validation
      if (phoneNumber.startsWith('+263')) {
        const zimbabweRegex = /^\+263(7[1-3]|7[7-9])\d{7}$/;
        if (!zimbabweRegex.test(phoneNumber)) {
          throw new Error('Invalid Zimbabwe phone number format');
        }
      }
      
      // Call external validation API
      const response = await fetch('/api/validate-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      
      const result = await response.json();
      setValidationResult(result);
      return result;
    } catch (error) {
      const errorResult = { isValid: false, error: error.message };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  };
  
  return { validatePhone, isValidating, validationResult };
};
```

### Bundle Service Hook
```typescript
// Custom hook for bundle management
export const useBundleService = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchBundles = async (mnoId: string, country: string): Promise<Bundle[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bundles?mnoId=${mnoId}&country=${country}`);
      const data = await response.json();
      setBundles(data.bundles);
      return data.bundles;
    } catch (err) {
      setError('Failed to fetch bundles');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  return { bundles, loading, error, fetchBundles };
};
```

### Payment Processing Hook
```typescript
// Custom hook for payment processing
export const usePayment = () => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const processPayment = async (paymentData: PaymentRequest): Promise<PaymentResult> => {
    setPaymentStatus('processing');
    setError(null);
    
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setPaymentStatus('success');
        setTransactionId(result.transactionId);
      } else {
        setPaymentStatus('error');
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setPaymentStatus('error');
      setError('Payment processing failed');
      throw err;
    }
  };
  
  return { paymentStatus, transactionId, error, processPayment };
};
```

## Frontend Components

### Phone Number Input Component
```tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { CountryFlag } from '@/components/CountryFlag';

interface PhoneInputProps {
  value: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onCountryDetected: (country: Country) => void;
  onMNODetected: (mno: MNO) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  placeholder = "Enter phone number",
  onValueChange,
  onCountryDetected,
  onMNODetected
}) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { validatePhone, detectCountry, detectMNO } = usePhoneValidation();
  
  const { control, watch } = useForm({
    defaultValues: {
      phoneNumber: value
    }
  });
  
  const phoneNumber = watch('phoneNumber');
  
  useEffect(() => {
    onValueChange(phoneNumber);
  }, [phoneNumber, onValueChange]);
  
  useEffect(() => {
    const validatePhoneNumber = async () => {
      if (phoneNumber && phoneNumber.length > 5) {
        try {
          const validation = await validatePhone(phoneNumber);
          if (validation.isValid) {
            setHasError(false);
            const country = await detectCountry(phoneNumber);
            const mno = await detectMNO(phoneNumber);
            onCountryDetected(country);
            onMNODetected(mno);
          } else {
            setHasError(true);
            setErrorMessage(validation.error);
          }
        } catch (error) {
          setHasError(true);
          setErrorMessage('Invalid phone number');
        }
      }
    };
    
    validatePhoneNumber();
  }, [phoneNumber, validatePhone, detectCountry, detectMNO, onCountryDetected, onMNODetected]);
  
  return (
    <div className="phone-input">
      <div className="country-selector">
        <CountryFlag country={selectedCountry} />
        <select 
          value={selectedCountry} 
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="country-select"
        >
          <option value="ZW">Zimbabwe (+263)</option>
          <option value="ZA">South Africa (+27)</option>
          <option value="NG">Nigeria (+234)</option>
          <option value="KE">Kenya (+254)</option>
          <option value="BW">Botswana (+267)</option>
          <option value="US">United States (+1)</option>
          <option value="GB">United Kingdom (+44)</option>
          {/* Add more countries as needed */}
        </select>
      </div>
      
      <Controller
        name="phoneNumber"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="tel"
            placeholder={placeholder}
            className={`phone-input-field ${hasError ? 'error' : ''}`}
          />
        )}
      />
      
      {hasError && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
```

### Bundle Selection Component
```tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useBundleService } from '@/hooks/useBundleService';

interface BundleSelectionProps {
  mno: MNO;
  country: Country;
  onBundleSelected: (bundle: Bundle) => void;
}

export const BundleSelection: React.FC<BundleSelectionProps> = ({
  mno,
  country,
  onBundleSelected
}) => {
  const [selectedType, setSelectedType] = useState<'airtime' | 'data' | 'sms'>('airtime');
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  
  const { bundles, loading, error, fetchBundles } = useBundleService();
  
  const bundleTypes = ['airtime', 'data', 'sms'] as const;
  
  const filteredBundles = useMemo(() => 
    bundles.filter(bundle => bundle.type === selectedType),
    [bundles, selectedType]
  );
  
  const selectBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    onBundleSelected(bundle);
  };
  
  useEffect(() => {
    if (mno) {
      fetchBundles(mno.id, country.code);
    }
  }, [mno, country, fetchBundles]);
  
  if (loading) {
    return <div className="loading">Loading bundles...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="bundle-selection">
      <div className="bundle-tabs">
        {bundleTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`tab-button ${selectedType === type ? 'active' : ''}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="bundles-grid">
        {filteredBundles.map(bundle => (
          <div
            key={bundle.id}
            onClick={() => selectBundle(bundle)}
            className={`bundle-card ${selectedBundle?.id === bundle.id ? 'selected' : ''}`}
          >
            <div className="bundle-amount">
              {bundle.type === 'airtime' ? `$${bundle.amount}` : bundle.dataAmount || bundle.amount}
            </div>
            <div className="bundle-description">{bundle.description}</div>
            <div className="bundle-price">
              ${bundle.amount} {bundle.currency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Environment Configuration

### Development Environment
```bash
# .env.development
VITE_API_BASE_URL=https://api-dev.airtime.com
VITE_PAYMENT_GATEWAY_URL=https://api-sandbox.payment-gateway.com
VITE_SMS_API_URL=https://api-sandbox.sms-provider.com
VITE_APP_ENV=development
VITE_DEBUG=true
```

### Production Environment
```bash
# .env.production
VITE_API_BASE_URL=https://api.airtime.com
VITE_PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
VITE_SMS_API_URL=https://api.sms-provider.com
VITE_APP_ENV=production
VITE_DEBUG=false
```

## Testing Strategy

### Unit Tests
```typescript
// tests/hooks/usePhoneValidation.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';

describe('usePhoneValidation', () => {
  it('should validate Zimbabwe phone format', async () => {
    const { result } = renderHook(() => usePhoneValidation());
    
    await act(async () => {
      const validation = await result.current.validatePhone('+263771234567');
      expect(validation.isValid).toBe(true);
    });
  });
  
  it('should reject invalid Zimbabwe format', async () => {
    const { result } = renderHook(() => usePhoneValidation());
    
    await act(async () => {
      const validation = await result.current.validatePhone('+263123456789');
      expect(validation.isValid).toBe(false);
    });
  });
});
```

### Component Tests
```typescript
// tests/components/PhoneInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PhoneInput } from '@/components/PhoneInput';

describe('PhoneInput', () => {
  it('should render phone input field', () => {
    render(<PhoneInput value="" onValueChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument();
  });
  
  it('should call onValueChange when input changes', () => {
    const mockOnValueChange = jest.fn();
    render(<PhoneInput value="" onValueChange={mockOnValueChange} />);
    
    const input = screen.getByPlaceholderText('Enter phone number');
    fireEvent.change(input, { target: { value: '+263771234567' } });
    
    expect(mockOnValueChange).toHaveBeenCalledWith('+263771234567');
  });
});
```

## Build & Deployment

### Vite Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### Static Hosting Configuration
```yaml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy load components with React.lazy()
- **Bundle Size**: Keep under 2MB total
- **Caching**: Service worker for offline capability
- **Images**: WebP format with fallbacks
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists of bundles

### PWA Configuration
```typescript
// src/sw.ts - Service Worker
const CACHE_NAME = 'airtime-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### Manifest Configuration
```json
// public/manifest.json
{
  "name": "H5 Airtime Mini-App",
  "short_name": "Airtime",
  "description": "Send airtime, data, and SMS bundles worldwide",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

*This developer documentation provides the technical foundation for implementing the H5 Airtime Mini-App as a React-based frontend application.*
