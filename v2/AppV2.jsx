/**
 * V2 App - Exact copy of V1 functionality
 * This is the experimental version for editing and testing
 */

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PhoneInputV2 from './pages/PhoneInputV2';
import RecipientInputV2 from './pages/RecipientInputV2';
import BundleSelectionV2 from './pages/BundleSelectionV2';
import PaymentV2 from './pages/PaymentV2';
import ConfirmationV2 from './pages/ConfirmationV2';
import UIVersionSwitcher from './components/UIVersionSwitcher';

const AppV2 = () => {
  const [phoneData, setPhoneData] = useState({
    phoneNumber: '',
    country: null,
    carrier: null,
    recipientNumber: '',
    recipientCarrier: null
  });
  
  const [topUpType, setTopUpType] = useState('myself'); // 'myself' or 'someone'
  
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      <UIVersionSwitcher />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <PhoneInputV2 
              phoneData={phoneData}
              setPhoneData={setPhoneData}
              topUpType={topUpType}
              setTopUpType={setTopUpType}
            />
          } 
        />
        <Route 
          path="/recipient" 
          element={
            <RecipientInputV2 
              phoneData={phoneData}
              setPhoneData={setPhoneData}
            />
          } 
        />
        <Route 
          path="/bundles" 
          element={
            <BundleSelectionV2 
              phoneData={phoneData}
              selectedBundle={selectedBundle}
              setSelectedBundle={setSelectedBundle}
            />
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PaymentV2 
              phoneData={phoneData}
              selectedBundle={selectedBundle}
              setPaymentData={setPaymentData}
            />
          } 
        />
        <Route 
          path="/confirmation" 
          element={
            <ConfirmationV2 
              phoneData={phoneData}
              selectedBundle={selectedBundle}
              paymentData={paymentData}
            />
          } 
        />
      </Routes>
    </div>
  );
};

export default AppV2;

