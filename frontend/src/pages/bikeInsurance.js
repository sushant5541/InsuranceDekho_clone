import React, { useState, useEffect } from 'react';
import '../styles/CarInsurance.css';
import usePayment from '../hooks/usePayment';
import Footer from '../components/Footer/Footer';

const BikeInsurance = () => {
  const { initiatePayment } = usePayment();
  const [activeTab, setActiveTab] = useState('Comprehensive');
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [existingInsurance, setExistingInsurance] = useState(null); 
  const [formData, setFormData] = useState({
    bikeNumber: '',
    mobileNumber: '',
    bikeBrand: '',
    biketype: '',
    purchasedYear: '',
  });
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const insuranceTypes = [
    {
      name: 'Comprehensive',
      icon: 'https://static.insurancedekho.com/pwa/img/comprehensive.svg',
      description: 'Covers both own damage and third-party liabilities. Protection against accidents, theft, natural calamities and more.'
    },
    {
      name: 'Third Party',
      icon: 'https://static.insurancedekho.com/pwa/img/thirdparty.svg',
      description: 'Mandatory coverage for third-party injuries, death or property damage caused by your vehicle.'
    },
    {
      name: 'Own Damage',
      icon: 'https://static.insurancedekho.com/pwa/img/ic_thirdparty.svg',
      description: 'Covers damages to your own vehicle from accidents, natural disasters, theft, fire, etc.'
    }
  ];

  const [bikeBrands] = useState([
    'Honda', 'Kawasaki', 'Yamaha', 'Hero', 'Royal Enfield',
    'KTM', 'Suzuki', 'Bajaj', 'TVS', 'Jawa'
  ]);

  const [biketypes] = useState([
    'Petrol', 'Diesel'
  ]);

  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const fetchInsurancePlans = async () => {
      if (!showPlans) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bikeInsurance/plans?type=${activeTab}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseData = await response.text();
          console.error('Received non-JSON response:', responseData);
          throw new Error('Received non-JSON response from server');
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          const validatedPlans = data.plans.map(plan => ({
            ...plan,
            _id: plan._id || plan.id,
            price: plan.price || '₹0'
          }));
          setInsurancePlans(validatedPlans);
        } else {
          console.error('API returned unsuccessful response:', data);
        }
      } catch (error) {
        console.error('Error fetching insurance plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurancePlans();
    loadRazorpay();
  }, [activeTab, showPlans]);

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    // Bike Number validation (basic Indian format)
    if (!formData.bikeNumber.trim()) {
      errors.bikeNumber = 'Bike number is required';
    } else if (!/^[A-Za-z]{2}\d{1,2}[A-Za-z]{0,2}\d{1,4}$/.test(formData.bikeNumber.trim())) {
      errors.bikeNumber = 'Please enter a valid bike number (e.g., MH09S1212)';
    }

    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Bike Brand validation
    if (!formData.bikeBrand) {
      errors.bikeBrand = 'Please select a bike brand';
    }

    // Bike Type validation
    if (!formData.biketype) {
      errors.biketype = 'Please select a bike type';
    }

    // Purchased Year validation
    if (!formData.purchasedYear) {
      errors.purchasedYear = 'Purchased year is required';
    } else if (isNaN(formData.purchasedYear) || 
               formData.purchasedYear < 2000 || 
               formData.purchasedYear > currentYear) {
      errors.purchasedYear = `Please enter a valid year between 2000 and ${currentYear}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleCheckPrices = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    // Check for existing insurance
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike-insurance-form/check?bikeNumber=${formData.bikeNumber}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check existing insurance');
    }
    
    const data = await response.json();
    
    if (data.hasInsurance) {
      setExistingInsurance(data.policy);
      return;
    }
    
    // If no existing insurance, proceed to show plans
    setShowPlans(true);
  } catch (error) {
    console.error('Error checking existing insurance:', error);
    // Even if check fails, we can proceed but show error
    alert('Error checking existing insurance. Please verify your bike details.');
    setShowPlans(true);
  } finally {
    setLoading(false);
  }
};

const handleBuyNowClick = async (plan) => {
  setSelectedPlan(plan);
  setPaymentInProgress(true);
  let formId; // Declare formId at the top to use in catch block

  try {
    // 1. Create insurance record
    console.log('Creating insurance record...');
    const insurancePayload = {
      bikeNumber: formData.bikeNumber.toUpperCase(),
      mobileNumber: formData.mobileNumber,
      bikeBrand: formData.bikeBrand,
      bikeType: formData.biketype,
      purchasedYear: Number(formData.purchasedYear),
      insuranceType: activeTab,
      planId: plan._id,
      status: 'pending_payment',
      userId: localStorage.getItem('userId')
    };

    const formResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/bike-insurance-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(insurancePayload),
    });

    const responseData = await formResponse.json();
    console.log('Insurance record response:', responseData);
    
    if (!formResponse.ok) {
      throw new Error(responseData.message || 'Failed to create insurance record');
    }

    formId = responseData._id || responseData.data?._id;
    console.log('Created insurance record ID:', formId);

    // 2. Initiate payment
    console.log('Initiating payment...');
    const paymentResult = await initiatePayment(plan, 'bike', formId);
    console.log('Payment result:', paymentResult);
    
    if (!paymentResult.success) {
      throw new Error(paymentResult.message || 'Payment failed');
    }

    // 3. Complete insurance
    console.log('Completing insurance...');
    const completeResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/bike-insurance-form/${formId}/complete`, 
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
          paymentAmount: plan.price,
          coverageDetails: plan.coverageDetails || {}
        }),
      }
    );

    const completeData = await completeResponse.json();
    console.log('Complete insurance response:', completeData);
    
    if (!completeResponse.ok) {
      throw new Error(completeData.message || 'Failed to complete insurance');
    }

    console.log('Insurance completed successfully!');
    alert('Insurance purchased successfully!');
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
        await fetch(`${process.env.REACT_APP_API_URL}/api/bike-insurance-form/${formId}/fail`, {
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
        console.error('Failed to update insurance status:', updateError);
      }
    }
  } finally {
    setPaymentInProgress(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const ExistingInsuranceAlert = ({ policy, onContinue }) => (
  <div className="existing-insurance-alert">
    <div className="alert-content">
      <h3>Existing Insurance Found</h3>
      <p>
        This bike number <strong>{policy.policyNumber}</strong> already has an active {policy.insurer} policy 
        that expires on {new Date(policy.expiryDate).toLocaleDateString()}.
      </p>
      <div className="alert-actions">
        <button className="btn-secondary" onClick={() => setExistingInsurance(null)}>
          Go Back
        </button>
        <button className="btn-primary" onClick={onContinue}>
          Continue Anyway
        </button>
      </div>
    </div>
  </div>
);


  return (
    <>
      <div className="car-insurance-page">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="container" style={{ maxWidth: "100%" }}>
            <div className="breadcrumb">
              <span><a href="/">Home</a></span>
            </div>
          </div>
        </div>

       {existingInsurance ? (
  <ExistingInsuranceAlert 
    policy={existingInsurance}
    onContinue={() => {
      setExistingInsurance(null);
      setShowPlans(true);
    }}
  />
) :!showPlans && (
          <section className="car-details-form">
            <div className="form-with-image-container">
            <div className="container">
              <h2>Enter Your Bike Details</h2>
                                <label htmlFor="bikeNumber">Bike Number</label>
              <form onSubmit={handleCheckPrices} noValidate>
                <div className="form-group">
                  <input
                    type="text"
                    id="bikeNumber"
                    name="bikeNumber"
                    value={formData.bikeNumber}
                    onChange={handleInputChange}
                    placeholder="eg. MH09S1212"
                    className={formErrors.bikeNumber ? 'error' : ''}
                  />
                  {formErrors.bikeNumber && <span className="error-message">{formErrors.bikeNumber}</span>}
                </div>
                  <label htmlFor="mobileNumber">Mobile Number</label>
                <div className="form-group">
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="eg. 9858765332"
                    className={formErrors.mobileNumber ? 'error' : ''}
                    maxLength="10"
                  />
                  {formErrors.mobileNumber && <span className="error-message">{formErrors.mobileNumber}</span>}
                </div>
                  <label htmlFor="bikeBrand">Bike Brand</label>
                <div className="form-group">
                  <select
                    id="bikeBrand"
                    name="bikeBrand"
                    value={formData.bikeBrand}
                    onChange={handleInputChange}
                    className={formErrors.bikeBrand ? 'error' : ''}
                  >
                    <option value="">Select Bike Brand</option>
                    {bikeBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {formErrors.bikeBrand && <span className="error-message">{formErrors.bikeBrand}</span>}
                </div>
                                  <label htmlFor="biketype">Bike Type</label>
                <div className="form-group">
                  <select
                    id="biketype"
                    name="biketype"
                    value={formData.biketype}
                    onChange={handleInputChange}
                    className={formErrors.biketype ? 'error' : ''}
                  >
                    <option value="">Select Bike Type</option>
                    {biketypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formErrors.biketype && <span className="error-message">{formErrors.biketype}</span>}
                </div>
                  <label htmlFor="purchasedYear">Purchased Year</label>
                <div className="form-group">
                  <input
                    type="number"
                    id="purchasedYear"
                    name="purchasedYear"
                    value={formData.purchasedYear}
                    onChange={handleInputChange}
                    placeholder={`Enter year between 2000-${new Date().getFullYear()}`}
                    className={formErrors.purchasedYear ? 'error' : ''}
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                  {formErrors.purchasedYear && <span className="error-message">{formErrors.purchasedYear}</span>}
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Check Prices'}
                  </button>
                </div>
              </form>
            </div>
             <div className="form-image-container">
        <img 
          src="https://5.imimg.com/data5/SELLER/Default/2025/2/491776287/MI/TZ/NA/8287604/bike-insurance-services.png" 
          alt="Car Insurance Illustration"
          className="form-side-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x600?text=Car+Insurance';
          }}
        />
      </div>
    </div>
          </section>
        )}

        {/* Insurance Plans - Show after form submission */}
        {showPlans && (
          <>
            {/* Insurance Plans */}
            <section className="insurance-plans">
              <div className="container">
                <h2>Top Bike Insurance Plans</h2>

                <div className="plan-tabs">
                  {insuranceTypes.map(type => (
                    <button
                      key={type.name}
                      className={`tab-btn ${activeTab === type.name ? 'active' : ''}`}
                      onClick={() => setActiveTab(type.name)}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="loading">Loading plans...</div>
                ) : (
                  <div className="plan-cards">
                    {insurancePlans.map((plan, index) => (
                      <div key={index} className="plan-card">
                        <div className="plan-header">
                          <img src={plan.logo} alt={plan.name} className="plan-logo" />
                          <h3>{plan.name}</h3>
                        </div>

                        <div className="plan-features">
                          <ul>
                            {plan.features.map((feature, i) => (
                              <li key={i}>
                                <span className="feature-name">{feature.split(' ')[0]}</span>
                                <span className="feature-value">{feature.split(' ').slice(1).join(' ')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="plan-footer">
                          <div className="plan-price">
                            Starting From <span>{plan.price}</span>
                            <div>
                              {plan.discount && <span className="discount-badge">{plan.discount}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleBuyNowClick(plan)}
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

                        <div className="key-features">
                          <h4>Key Features:</h4>
                          <ul>
                            {plan.keyFeatures.map((feature, i) => (
                              <li key={i}>
                                <span className="tick-icon">✓</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Insurance Types */}
            <section className="insurance-types">
              <div className="container">
                <h2>Types of Bike Insurance</h2>
                <p className="subtitle">
                  It is important to choose the right bike insurance policy. Here's what you need to know about the different types.
                </p>

                <div className="type-cards">
                  {insuranceTypes.map((type, index) => (
                    <div key={index} className="type-card">
                      <img src={type.icon} alt={type.name} className="type-icon" />
                      <h3>{type.name}</h3>
                      <p>{type.description}</p>
                      <a href="#" className="learn-more">Learn More →</a>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* What is Bike Insurance */}
            <section className="info-section">
              <div className="container">
                <h2>What is Bike Insurance?</h2>
                <div className="content">
                  <p>
                    Once you've secured the bike of your dreams, the next step is to get bike insurance from a reliable provider.
                    Think of it as a safety net for your beloved ride and the loved ones who will use it. Bike insurance, also
                    called two wheeler insurance, is a contract between an insurer and you, the policyholder to protect you
                    from unpredictable circumstances like accidents, theft or natural calamities.
                  </p>
                  <p>
                    According to the Motor Vehicles Act of 1988, every bike owner must have at least a third-party insurance policy.
                    This provides coverage in case you are ever involved in an accident causing physical or property damage.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BikeInsurance;