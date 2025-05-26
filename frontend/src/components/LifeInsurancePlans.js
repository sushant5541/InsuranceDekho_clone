import React, { useState } from 'react';
import '../styles/LifeInsurance.css';
import usePayment from '../hooks/usePayment';

const LifeInsurancePlans = ({ formData }) => {
  const { initiatePayment } = usePayment();
  const [loading, setLoading] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      _id: 'plan_1',
      insurer: "Bajaj Allianz",
      logo: "bajaj",
      name: "POS Goal Suraksha",
      features: [
        "Sum Assured: ₹1 Crore - ₹5 Crore",
        "Policy Term: 10-30 years",
        "Premium Payment Term: 5-15 years",
        "Guaranteed additions from year 1",
        "Maturity and death benefits"
      ],
      price: "₹1,200/month",
      priceValue: 1200,
      coverageDetails: {
        sumAssured: "₹1 Crore - ₹5 Crore",
        policyTerm: "10-30 years"
      }
    },
    {
      id: 2,
      _id: 'plan_2',
      insurer: "HDFC Life",
      logo: "hdfc",
      name: "Sanchay Fixed Maturity Plan",
      features: [
        "Sum Assured: ₹50 Lakhs - ₹10 Crore",
        "Policy Term: 10-25 years",
        "Premium Payment Term: 5-10 years",
        "Guaranteed returns up to 7.5%",
        "Flexible payout options"
      ],
      price: "₹1,500/month",
      priceValue: 1500,
      coverageDetails: {
        sumAssured: "₹50 Lakhs - ₹10 Crore",
        policyTerm: "10-25 years"
      }
    },
    {
      id: 3,
      _id: 'plan_3',
      insurer: "Max Life",
      logo: "max",
      name: "Smart Wealth Plan",
      features: [
        "Sum Assured: ₹25 Lakhs - ₹2 Crore",
        "Policy Term: 10-20 years",
        "Premium Payment Term: 5-10 years",
        "Loyalty additions from year 6",
        "Partial withdrawal option"
      ],
      price: "₹1,000/month",
      priceValue: 1000,
      coverageDetails: {
        sumAssured: "₹25 Lakhs - ₹2 Crore",
        policyTerm: "10-20 years"
      }
    }
  ];

  const handleBuyNowClick = async (plan) => {
    setSelectedPlan(plan);
    setPaymentInProgress(true);
    let formId;

    try {
      // 1. Create insurance record
      console.log('Creating life insurance record...');
      const insurancePayload = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        planId: plan._id,
        status: 'pending_payment',
        userId: localStorage.getItem('userId'),
        coverageDetails: plan.coverageDetails
      };

      const formResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/life-insurance-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(insurancePayload),
      });

      const responseData = await formResponse.json();
      console.log('Life insurance record response:', responseData);
      
      if (!formResponse.ok) {
        throw new Error(responseData.message || 'Failed to create life insurance record');
      }

      formId = responseData._id || responseData.data?._id;
      console.log('Created life insurance record ID:', formId);

      // 2. Initiate payment
      console.log('Initiating payment...');
      const paymentResult = await initiatePayment(plan, 'life', formId);
      console.log('Payment result:', paymentResult);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment failed');
      }

      // 3. Complete insurance
      console.log('Completing insurance...');
      const completeResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/life-insurance-form/${formId}/complete`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            planId: plan._id,
            paymentId: paymentResult.paymentId,
            razorpayOrderId: paymentResult.razorpayOrderId,
            razorpaySignature: paymentResult.razorpaySignature,
            paymentAmount: plan.priceValue,
            coverageDetails: plan.coverageDetails
          }),
        }
      );

      const completeData = await completeResponse.json();
      console.log('Complete insurance response:', completeData);
      
      if (!completeResponse.ok) {
        throw new Error(completeData.message || 'Failed to complete life insurance');
      }

      console.log('Life insurance completed successfully!');
      alert('Life insurance purchased successfully!');
      // Redirect to success page
      window.location.href = `/insurance-success?policy=${completeData.data.policyNumber}`;
    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        formId: formId,
        response: error.response
      });
      
      alert(`Error: ${error.message}`);
      
      // Update insurance record to failed status if it exists
      if (formId) {
        try {
          await fetch(`${process.env.REACT_APP_API_URL}/api/life-insurance-form/${formId}/fail`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ 
              status: 'failed',
              rejectionReason: error.message 
            }),
          });
        } catch (updateError) {
          console.error('Failed to update life insurance status:', updateError);
        }
      }
    } finally {
      setPaymentInProgress(false);
    }
  };

  return (
    <div className="life-insurance-plans">
      <div className="user-details">
        <h3>Hi {formData.name}, {formData.age}</h3>
        <p>Here are the best life insurance plans for you</p>
      </div>
      
      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <img 
                src={`https://static.insurancedekho.com/pwa/img/banner/${plan.logo}.png`} 
                alt={plan.insurer} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100x50?text=Insurer';
                }}
              />
              <div className="plan-title">
                <h3>{plan.insurer}</h3>
                <h4>{plan.name}</h4>
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
                onClick={() => handleBuyNowClick(plan)}
                disabled={paymentInProgress && selectedPlan?.id === plan.id}
              >
                {paymentInProgress && selectedPlan?.id === plan.id ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : 'Buy Now'}
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
    </div>
  );
};

export default LifeInsurancePlans;