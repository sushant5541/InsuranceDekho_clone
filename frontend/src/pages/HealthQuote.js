import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HealthQuote.css';
import usePayment from '../hooks/usePayment';


const api = axios.create({
  baseURL: 'http://insurance-backend:4000/api',
});

const QuotePage = () => {
  const { initiatePayment } = usePayment();
  const location = useLocation();
  const formData = location.state?.formData || {};
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = async () => {
      const loaded = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      setRazorpayLoaded(loaded);
    };

    loadRazorpay();
  }, []);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.post('/insurance/get-plans', formData);

        if (response.data.success) {
          // Ensure plans have required fields
          const validatedPlans = response.data.plans.map(plan => ({
            ...plan,
            _id: plan._id || plan.id,
            price: plan.price || plan.premium // Use premium if price doesn't exist
          }));
          setPlans(validatedPlans);
        } else {
          setError(response.data.message || 'Failed to fetch plans');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.response?.data?.message || 'Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(formData).length > 0) {
      fetchPlans();
    }
  }, [formData]);

  const handlePayment = async (plan) => {
  if (!razorpayLoaded) {
    alert('Payment system is still loading. Please try again in a moment.');
    return;
  }

  if (!plan || !plan._id) {
    console.error('Invalid plan structure:', plan);
    alert('Invalid plan selected. Please try again.');
    return;
  }

  try {
    // Convert price to string if it's a number
    const price = typeof plan.price === 'number' ? plan.price.toString() : plan.price || '0';
    
    // Ensure the plan has all required fields
    const paymentPlan = {
      ...plan,
      name: plan.planName || plan.name || 'Health Insurance Plan',
      price: price, // Use the converted price
      premium: price // Also set premium in case backend expects it
    };
    
    await initiatePayment(paymentPlan, 'health');
  } catch (error) {
    console.error('Payment failed:', error);
    alert(error.message || 'Payment initialization failed');
  }
};

// Update your formatCurrency function to handle numbers
const formatCurrency = (amount) => {
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? 
    parseFloat(amount.replace(/[^0-9.-]+/g, '')) : 
    Number(amount);
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numAmount).replace('₹', '₹ ');
};

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Finding the best health plans for you...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="plan-header">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          &larr; Back
        </button>
        <h2>Available Health Insurance Plans</h2>
        <p className="results-count">{plans.length} {plans.length === 1 ? 'Plan' : 'Plans'} Found</p>
      </div>

      {plans.length > 0 ? (
        <div className="plans-container">
          {plans.map(plan => (
            <div key={plan._id} className="plan-card">
              <div className="plan-card-header">
                <img
                  src={plan.logo?.startsWith('http') ? plan.logo : `https://via.placeholder.com/80?text=Logo`}
                  alt={plan.insurerName || 'Insurance Logo'}
                  className="plan-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                  }}
                />

                <div className="plan-title">
                  <h3>{plan.insurerName}</h3>
                  <h4>{plan.planName}</h4>
                </div>
              </div>

              <div className="plan-features">
                <div className="feature-highlight">
                  <span>Cover Amount:</span>
                  <strong>{plan.coverAmount}</strong>
                </div>
                <div className="feature-highlight">
                  <span>Cashless Hospitals:</span>
                  <strong>{plan.cashlessHospitals.toLocaleString()}+</strong>
                </div>
                <div className="feature-highlight">
                  <span>Claim Settlement:</span>
                  <strong>{plan.claimSettled}</strong>
                </div>

                <ul className="feature-list">
                  {plan.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="plan-footer">
                <div className="plan-price">
                  <div className="price-label">Annual Premium</div>
                  <div className="price-amount">{formatCurrency(plan.premium)}</div>
                </div>

                <div className="plan-actions">
                 <button
                        onClick={() => handlePayment(plan)}
                        disabled={loading}
                        className="check-price-btn"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : 'Buy Now'}
                      </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="no-plans">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt="No plans found"
              className="no-plans-image"
            />
            <h3>No health insurance plans found</h3>
            <p>We couldn't find any plans matching your criteria.</p>
            <button
              onClick={() => navigate(-1)}
              className="btn-try-again"
            >
              Try Different Options
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default QuotePage;