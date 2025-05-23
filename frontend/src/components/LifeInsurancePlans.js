import React from 'react';
import '../styles/LifeInsurance.css';

const LifeInsurancePlans = ({ formData }) => {
  const plans = [
    {
      id: 1,
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
      price: "₹1,200/month"
    },
    {
      id: 2,
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
      price: "₹1,500/month"
    },
    {
      id: 3,
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
      price: "₹1,000/month"
    }
  ];

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
              <button className="buy-now-btn">Buy Now</button>
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