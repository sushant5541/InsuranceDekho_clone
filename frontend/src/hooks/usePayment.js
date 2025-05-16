import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const usePayment = () => {
  const { user, logout } = useAuth(); // 'user' is now used in the prefill section
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRazorpayScript = async () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (plan, planType) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      // 1. Load Razorpay SDK
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // 2. Create payment order
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: parseInt((plan.price || '0').replace(/\D/g, '')),
        planId: plan._id || plan.id,
        planType: planType.toLowerCase(),
      }),
    });

      if (response.status === 401) {
        logout();
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Payment processing failed');
      }

      const { order } = await response.json();

      // 3. Initialize Razorpay payment
      const options = {
        key: 'rzp_test_enSNChz4e2UlQM', // Replace with your actual key
        amount: order.amount,
        currency: order.currency || 'INR',
        name: `${planType} Insurance`,
        description: `Payment for ${plan.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
             const verification = await fetch('http://insurance-backend:4000/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        planId: plan._id || plan.id,
        planType: planType.toLowerCase(),
      }),
    });
            const { success, message } = await verification.json();
            alert(success ? 'Payment successful!' : message || 'Payment verification failed');
          } catch (err) {
            console.error('Verification error:', err);
            alert('Error verifying payment. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@example.com',
          contact: user?.phone || '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options); // Define rzp here
      rzp.open();
    } catch (error) {
      setError(error.message);
      console.error('Payment Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
};

export default usePayment;