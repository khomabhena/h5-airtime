import React, { useState, useEffect } from 'react';
import InputField from './InputField';

const CustomAirtimeInput = ({ onCustomAmountChange, minAmount = 1, maxAmount = 1000, clearInput = false }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  // Clear input when clearInput prop changes to true
  useEffect(() => {
    if (clearInput) {
      setCustomAmount('');
      setIsValid(false);
      setError('');
      onCustomAmountChange(null);
    }
  }, [clearInput]);

  useEffect(() => {
    if (customAmount === '') {
      setIsValid(false);
      setError('');
      onCustomAmountChange(null);
      return;
    }

    const amount = parseFloat(customAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setIsValid(false);
      setError('Please enter a valid amount');
      onCustomAmountChange(null);
      return;
    }

    if (amount < minAmount) {
      setIsValid(false);
      setError(`Minimum amount is $${minAmount}`);
      onCustomAmountChange(null);
      return;
    }

    if (amount > maxAmount) {
      setIsValid(false);
      setError(`Maximum amount is $${maxAmount}`);
      onCustomAmountChange(null);
      return;
    }

    setIsValid(true);
    setError('');
    
    // Calculate price with markup (assuming 10% markup like the predefined bundles)
    const price = amount * 1.1;
    onCustomAmountChange({
      id: 'custom',
      name: 'Custom Amount',
      amount: amount,
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      description: `Custom airtime amount`,
      isCustom: true
    });
  }, [customAmount, minAmount, maxAmount]); // Remove onCustomAmountChange from dependencies

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300 hover:border-emerald-300 transition-all">
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-800 mb-1">Custom Amount</h3>
        <p className="text-xs text-gray-600">Enter your desired airtime amount</p>
      </div>

      <div className="space-y-3">
        <InputField
          type="text"
          label="Airtime Amount"
          value={customAmount}
          onChange={handleAmountChange}
          placeholder={`$${minAmount} - $${maxAmount}`}
          error={error}
          icon={
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        {customAmount && isValid && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-800">Custom Amount</p>
                <p className="text-xs text-emerald-600 truncate">${customAmount} airtime</p>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <div className="text-base font-bold text-emerald-600">
                  ${(parseFloat(customAmount) * 1.1).toFixed(2)}
                </div>
                <div className="text-xs text-emerald-500">USD</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Range: ${minAmount} - ${maxAmount}
        </div>
      </div>
    </div>
  );
};

export default CustomAirtimeInput;
