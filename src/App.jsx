import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PhoneInput from './components/PhoneInput';
import RecipientInput from './components/RecipientInput';
import BundleSelection from './components/BundleSelection';
import PaymentFlow from './components/PaymentFlow';
import Confirmation from './components/Confirmation';
import AppV2 from '../v2/AppV2';
import UIVersionSwitcher from '../v2/components/UIVersionSwitcher';
// import BridgeStatusIndicator from './components/BridgeStatusIndicator'; // Disabled - causing infinite loop
import './App.css';

function App() {
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
    <Router>
      <UIVersionSwitcher />
      
      <Routes>
        {/* V2 Routes - SuperApp Design */}
        <Route path="/v2/*" element={<AppV2 />} />

        {/* V1 Routes - Original Design */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-[900px] mx-auto px-4 py-12 w-full">
              <Routes>
            <Route 
              path="/" 
              element={
                <PhoneInput 
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
                <RecipientInput 
                  phoneData={phoneData}
                  setPhoneData={setPhoneData}
                />
              } 
            />
            <Route 
              path="/bundles" 
              element={
                <BundleSelection 
                  phoneData={phoneData}
                  selectedBundle={selectedBundle}
                  setSelectedBundle={setSelectedBundle}
                />
              } 
            />
            <Route 
              path="/payment" 
              element={
                <PaymentFlow 
                  phoneData={phoneData}
                  selectedBundle={selectedBundle}
                  setPaymentData={setPaymentData}
                />
              } 
            />
            <Route 
              path="/confirmation" 
              element={
                <Confirmation 
                  phoneData={phoneData}
                  selectedBundle={selectedBundle}
                  paymentData={paymentData}
                />
              } 
            />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;