import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PhoneInput from './components/PhoneInput';
import RecipientInput from './components/RecipientInput';
import BundleSelection from './components/BundleSelection';
import PaymentFlow from './components/PaymentFlow';
import Confirmation from './components/Confirmation';
import './App.css';

function App() {
  const [phoneData, setPhoneData] = useState({
    phoneNumber: '',
    country: null,
    carrier: null,
    recipientNumber: '',
    recipientCarrier: null
  });
  
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
        <Header />

        {/* Main Content */}
        <main className="flex-1 max-w-[900px] mx-auto px-4 py-12 w-full">
          <Routes>
            <Route 
              path="/" 
              element={
                <PhoneInput 
                  phoneData={phoneData}
                  setPhoneData={setPhoneData}
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
    </Router>
  );
}

export default App;