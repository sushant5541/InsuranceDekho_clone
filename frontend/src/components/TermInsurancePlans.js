// frontend/src/components/TermInsurancePlans.js
// frontend/src/components/TermInsurancePlans.js
import React from 'react';
import '../styles/TermInsurance.css';
import usePayment from '../hooks/usePayment';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TermInsurancePlans = ({ formData }) => {
  const { initiatePayment, loading, error } = usePayment();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const termPlans = [
    {
      id: 1,
      insurer: "HDFC Life",
      logo: "hdfc",
      name: "Click 2 Protect Life",
      features: [
        "Sum Assured: ₹50 Lakhs - ₹5 Crore",
        "Policy Term: 10-40 years",
        "Premium Payment Term: Regular pay or limited pay",
        "Option to increase cover",
        "Critical illness rider available"
      ],
      price: "₹490/month",
      claimSettled: "98.5%"
    },
    {
      id: 2,
      insurer: "ICICI Pru",
      logo: "icici",
      name: "iProtect Smart",
      features: [
        "Sum Assured: ₹25 Lakhs - ₹10 Crore",
        "Policy Term: 5-40 years",
        "Option to return premium",
        "Multiple rider options",
        "Flexible payment options"
      ],
      price: "₹520/month",
      claimSettled: "98.9%"
    },
    {
      id: 3,
      insurer: "Max Life",
      logo: "max",
      name: "Online Term Plan Plus",
      features: [
        "Sum Assured: ₹50 Lakhs - ₹5 Crore",
        "Policy Term: 10-40 years",
        "Option to increase cover",
        "Critical illness rider available",
        "Accidental death benefit"
      ],
      price: "₹510/month",
      claimSettled: "99.1%"
    },
    {
      id: 4,
      insurer: "Bajaj Allianz",
      logo: "bajaj",
      name: "Flexi Term",
      features: [
        "Sum Assured: ₹25 Lakhs - ₹5 Crore",
        "Policy Term: 10-40 years",
        "Flexible premium payment terms",
        "Option to increase cover",
        "High claim settlement ratio"
      ],
      price: "₹420/month",
      claimSettled: "99.7%"
    }
  ];

   const handleBuyNow = async (plan) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      // 1. Create form submission
      const formSubmission = await submitTermInsuranceForm(plan);
      
      // 2. Initiate payment
      const paymentResult = await initiatePayment(plan, 'term', formSubmission._id);
      
      if (paymentResult.success) {
        // 3. Update form with payment details
        await updateTermInsuranceForm(formSubmission._id, paymentResult.paymentId);
        
        // Redirect to success page
        navigate('/payment-success', {
          state: {
            paymentId: paymentResult.paymentId,
            planType: 'term',
            planName: plan.name
          }
        });
      } else {
        // Handle payment failure
        console.error('Payment failed:', paymentResult.message);
        alert(`Payment failed: ${paymentResult.message}`);
      }
    } catch (err) {
      console.error('Error during purchase:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const submitTermInsuranceForm = async (plan) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/term-insurance-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        user: user._id,
        plan: plan.id,
        personalDetails: formData,
        status: 'pending_payment'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit form');
    }
    
    return await response.json();
  };

  const updateTermInsuranceForm = async (formId, paymentId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/term-insurance-form/${formId}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        paymentId,
        status: 'completed'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update form');
    }
    
    return await response.json();
  };
  return (
    <div className="term-insurance-plans">
      <div className="user-details">
        <h3>Hi {formData.name}, {formData.age}</h3>
        <p>Here are the best term insurance plans for you</p>
      </div>
      
      <div className="plans-grid">
        {termPlans.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <img 
                src={`https://static.insurancedekho.com/pwa/img/banner/${plan.logo}.png`} 
                alt={plan.insurer} 
              />
              <div className="plan-title">
                <h3>{plan.insurer}</h3>
                <h4>{plan.name}</h4>
                <div className="claim-settled">
                  <span>Claim Settled: {plan.claimSettled}</span>
                </div>
              </div>
            </div>
            
            <div className="plan-features">
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="plan-price">
              <span>From {plan.price}</span>
            </div>
            
                <div className="plan-actions">
              <button 
                className="buy-now-btn" 
                onClick={() => handleBuyNow(plan)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="need-help">
        <p>Need help choosing the right plan?</p>
        <button className="expert-help-btn">Talk to our expert</button>
      </div>
       {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TermInsurancePlans;