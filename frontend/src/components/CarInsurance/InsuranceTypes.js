import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/InsuranceTypes.css';

const InsuranceTypes = ({ type, companies }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`/api/car-insurance/plans/${type.toLowerCase()}`);
        const plansWithCompanies = res.data.map(plan => ({
          ...plan,
          company: companies.find(c => c._id === plan.company) || {}
        }));
        setPlans(plansWithCompanies);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (companies.length > 0) {
      fetchPlans();
    }
  }, [type, companies]);

  if (loading) {
    return <div className="loading">Loading {type} plans...</div>;
  }

  if (plans.length === 0) {
    return <div className="no-plans">No {type} plans available</div>;
  }

  return (
    <div className="insurance-plans">
      {plans.map(plan => (
        <div key={plan._id} className="plan-card">
          <div className="plan-header">
            <div className="company-logo">
              {plan.company.logo && (
                <img src={plan.company.logo} alt={plan.company.name} />
              )}
              <span>{plan.company.name || 'Unknown Company'}</span>
            </div>
            <div className="plan-stats">
              <div>
                <span>Network Garages</span>
                <strong>{plan.company.networkGarages?.toLocaleString() || 'N/A'}+</strong>
              </div>
              <div>
                <span>Claims Settled</span>
                <strong>{plan.company.claimSettlementRatio || 'N/A'}%</strong>
              </div>
            </div>
          </div>
          
          <div className="plan-details">
            <h3>{plan.name} Plan</h3>
            <p className="description">{plan.description}</p>
            <div className="starting-price">
              Starting From <span>₹{plan.startingPrice}</span>
            </div>
            <button className="get-quote-btn">Get Quote</button>
          </div>
          
          <div className="key-features">
            <h4>Key Features:</h4>
            <ul>
              {plan.keyFeatures?.map((feature, index) => (
                <li key={index}>
                  <span className="tick-icon">✓</span> {feature}
                </li>
              )) || <li>No features listed</li>}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsuranceTypes;