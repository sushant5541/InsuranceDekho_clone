import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';

// Load Razorpay script dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve();
    };
    document.body.appendChild(script);
  });
};

// Then modify your payment initiation:
const initiatePayment = async (plan, planType) => {
  try {
    await loadRazorpay();
    
    if (!window.Razorpay) {
      throw new Error('Razorpay failed to load');
    }

    // Rest of your payment logic
  } catch (error) {
    // Handle error
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <AuthProvider>
        <Navbar/>
       
        <App />
         <Footer/>
      </AuthProvider>
    </React.StrictMode>
  </Router>
);