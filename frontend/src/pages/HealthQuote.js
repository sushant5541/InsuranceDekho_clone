import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const diseasesList = [
  { label: "No existing disease", value: "no_disease" },
  { label: "Diabetes", value: "diabetes" },
  { label: "BP/Hypertension", value: "bp_hypertension" },
  { label: "Heart Disease", value: "heart_disease" },
  { label: "Asthma", value: "asthma" },
  { label: "Thyroid Disorder", value: "thyroid_disorder" },
  { label: "Any other Disease", value: "any_other_disease" }
];

// Fetch plans from the backend API
const fetchPlans = async (selectedDiseases) => {
  const response = await fetch('/api/plans/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ selectedDiseases })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch plans');
  }

  return await response.json();
};

const QuotePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  const handleCheckboxChange = (value) => {
    setSelectedDiseases((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (selectedDiseases.length === 0) {
      alert("Please select at least one option");
      return;
    }
    
    setLoading(true);
    try {
      const fetchedPlans = await fetchPlans(selectedDiseases);
      setPlans(fetchedPlans);
      setShowPlans(true);
    } catch (error) {
      console.error("Error fetching plans:", error);
      alert("Failed to fetch plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    backArrow: {
      marginRight: '10px',
      cursor: 'pointer'
    },
    list: {
      listStyle: 'none',
      padding: 0
    },
    card: {
      marginBottom: '10px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '5px'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    indicator: {
      marginLeft: '10px'
    },
    buttonContainer: {
      marginTop: '20px',
      textAlign: 'center'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    loading: {
      textAlign: 'center',
      margin: '20px 0'
    },
    planContainer: {
      marginTop: '30px'
    },
    planHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    planCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px'
    },
    planLogo: {
      width: '80px',
      height: 'auto',
      marginRight: '15px'
    },
    planDetails: {
      display: 'flex',
      marginBottom: '15px'
    },
    planFeatures: {
      marginLeft: '15px'
    },
    featureItem: {
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    },
    premiumBox: {
      textAlign: 'right'
    },
    discountBadge: {
      backgroundColor: '#f0f8ff',
      padding: '5px 10px',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      marginBottom: '10px'
    }
  };

  return (
    <div className="preQhealth diseaseNew" style={styles.container}>
      {!showPlans ? (
        <>
          <div className="distitle" style={styles.title}>
            <span className="leftArrow" onClick={() => navigate(-1)} style={styles.backArrow}>
              <img src="https://static.insurancedekho.com/pwa/img/back-arrow-new.svg" alt="Arrow" />
            </span>
            Does any selected member have a known disease?
          </div>

          <div className="illnessgrp">
            <div className="memberlist">
              <ul style={styles.list}>
                {diseasesList.map(({ label, value }) => (
                  <li key={value} className="illcard" style={styles.card}>
                    <label className="gs_control gs_checkbox" style={styles.label}>
                      <input
                        type="checkbox"
                        name="existingDisease"
                        value={value}
                        checked={selectedDiseases.includes(value)}
                        onChange={() => handleCheckboxChange(value)}
                      />
                      {label}
                      <span className="gs_control__indicator" style={styles.indicator}></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="btnbox">
              <div className="sticky" style={styles.buttonContainer}>
                <button 
                  className="button-primary large" 
                  title="View Plans" 
                  style={styles.button} 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'View Plans'}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.planContainer}>
          <div style={styles.planHeader}>
            <h2>{plans.length} Plans found <span>(All prices are inclusive of GST)</span></h2>
            <button onClick={() => setShowPlans(false)}>Back</button>
          </div>

          {plans.map(plan => (
            <div key={plan._id} style={styles.planCard}>
              <div style={styles.planDetails}>
                <img src={plan.logo} alt={plan.insurer} style={styles.planLogo} />
                <div style={styles.planFeatures}>
                  <h3>{plan.insurer}</h3>
                  <p>{plan.planName}</p>
                  
                  <div style={{ display: 'flex', margin: '10px 0' }}>
                    <div style={{ marginRight: '20px' }}>
                      <p>Cashless Hospitals</p>
                      <h4>{plan.cashlessHospitals}</h4>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                      <p>Claim Settled</p>
                      <h4>{plan.claimSettled}</h4>
                    </div>
                    <div>
                      <p>Cover Amount</p>
                      <h4>{plan.coverAmount}</h4>
                    </div>
                  </div>
                  
                  <div>
                    {plan.features.map((feature, index) => (
                      <div key={index} style={styles.featureItem}>
                        <img 
                          src="https://static.insurancedekho.com/pwa/img/check-green.svg" 
                          width="16px" 
                          height="16px" 
                          alt="Check" 
                          style={{ marginRight: '5px' }}
                        />
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                  
                  {plan.addons > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <p>Maximize Your Benefits</p>
                      <a href="#">{plan.addons} Add-ons</a>
                    </div>
                  )}
                </div>
                
                <div style={styles.premiumBox}>
                  {plan.discount && (
                    <div style={styles.discountBadge}>
                      <img 
                        src="https://static.insurancedekho.com/pwa/img/discount-nudge.svg" 
                        alt="Discount" 
                        style={{ marginRight: '5px' }}
                      />
                      Inc. {plan.discount}
                    </div>
                  )}
                  <button style={{ 
                    backgroundColor: '#f5f5f5', 
                    border: '1px solid #ddd',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}>
                    {plan.monthlyPremium}<span>/Month</span>
                  </button>
                  <p>{plan.yearlyPremium}/Yr</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotePage;
