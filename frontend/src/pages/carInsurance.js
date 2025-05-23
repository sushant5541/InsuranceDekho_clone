import React, { useState, useEffect } from 'react';
import '../styles/CarInsurance.css';
import usePayment from '../hooks/usePayment';
import Footer from '../components/Footer/Footer';

const CarInsurance = () => {
  const { initiatePayment } = usePayment();
  const [activeTab, setActiveTab] = useState('Comprehensive');
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [formData, setFormData] = useState({
    carNumber: '',
    mobileNumber: '',
    carBrand: '',
    carType: '',
    purchasedYear: '',
    carModel: '',
    carValue: ''
  });
  const [existingInsurance, setExistingInsurance] = useState(null);

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

  const [carBrands] = useState([
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota',
    'Honda', 'Kia', 'Volkswagen', 'Renault', 'Ford'
  ]);

  const [carTypes] = useState([
    'Petrol', 'CNG', 'Diesel', 'Electric'
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/car-insurance/plans?type=${activeTab}`, {
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
          console.error('Received non-JJSON response:', responseData);
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

    // Car Number validation (basic Indian format)
    if (!formData.carNumber.trim()) {
      errors.carNumber = 'Car number is required';
    } else if (!/^[A-Za-z]{2}\d{1,2}[A-Za-z]{0,2}\d{1,4}$/.test(formData.carNumber.trim())) {
      errors.carNumber = 'Please enter a valid car number (e.g., MH09S1212)';
    }

    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Car Brand validation
    if (!formData.carBrand) {
      errors.carBrand = 'Please select a car brand';
    }

    // Car Type validation
    if (!formData.carType) {
      errors.carType = 'Please select a car type';
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/car-insurance-form/check?carNumber=${formData.carNumber}`, {
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
    alert('Error checking existing insurance. Please verify your car details.');
    setShowPlans(true);
  } finally {
    setLoading(false);
  }
};

  const handleBuyNowClick = async (plan) => {
  setPaymentInProgress(true);

  try {
    // 1. Initiate payment
    const paymentResult = await initiatePayment(plan, 'car');
    if (!paymentResult.success) throw new Error(paymentResult.message);

    // 2. Prepare payload
    const payload = {
      carNumber: formData.carNumber.toUpperCase(),
      mobileNumber: formData.mobileNumber,
      carBrand: formData.carBrand,
      carType: formData.carType,
      carModel: formData.carModel || undefined, // Optional
      carValue: formData.carValue || undefined, // Optional
      purchasedYear: formData.purchasedYear,
      insuranceType: activeTab,
      planId: plan._id,
      paymentId: paymentResult.paymentId,
      paymentAmount: plan.price,
      coverageDetails: plan.coverageDetails || {}
    };

    // 3. Create insurance record
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/car-insurance-form/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend errors:', data);
      throw new Error(data.error || 'Failed to create insurance record');
    }

    // Success!
    alert('Insurance created successfully!');
    // Redirect or show success page
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
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
        This car number <strong>{policy.policyNumber}</strong> already has an active policy 
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

        {/* Car Details Form - Show first */}
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
            <div className="container" >
              <h2>Enter Your Car Details</h2>
              <form onSubmit={handleCheckPrices} noValidate>
                <label htmlFor="carNumber">Car Number</label>
                <div className="form-group">
                  <input
                    type="text"
                    id="carNumber"
                    name="carNumber"
                    value={formData.carNumber}
                    onChange={handleInputChange}
                    placeholder="eg. MH09S1212"
                    className={formErrors.carNumber ? 'error' : ''}
                  />
                  {formErrors.carNumber && <span className="error-message">{formErrors.carNumber}</span>}
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

                <label htmlFor="carBrand">Car Brand</label>
                <div className="form-group">
                  <select
                    id="carBrand"
                    name="carBrand"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    className={formErrors.carBrand ? 'error' : ''}
                  >
                    <option value="">Select Car Brand</option>
                    {carBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {formErrors.carBrand && <span className="error-message">{formErrors.carBrand}</span>}
                </div>

                <label htmlFor="carModel">Car Model (Optional)</label>
                <div className="form-group">
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    placeholder="eg. Swift Dzire"
                  />
                </div>

                <label htmlFor="carType">Car Type</label>
                <div className="form-group">
                  <select
                    id="carType"
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    className={formErrors.carType ? 'error' : ''}
                  >
                    <option value="">Select Car Type</option>
                    {carTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formErrors.carType && <span className="error-message">{formErrors.carType}</span>}
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
          src="https://www.policybazaar.com/pblife/assets/images/pb_life_1631626565.jpg" 
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
                <h2>Top Car Insurance Plans</h2>

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
                            disabled={paymentInProgress}
                            className="check-price-btn"
                          >
                            {paymentInProgress ? (
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
                <h2>Types of Car Insurance</h2>
                <p className="subtitle">
                  It is important to choose the right car insurance policy. Here's what you need to know about the different types.
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

            {/* What is Car Insurance */}
            <section className="info-section">
              <div className="container">
                <h2>What is Car Insurance?</h2>
                <div className="content">
                  <p>
                    Once you've secured the car of your dreams, the next step is to get car insurance from a reliable provider.
                    Think of it as a safety net for your beloved vehicle and the loved ones who will use it. Car insurance is a
                    contract between an insurer and you, the policyholder to protect you from unpredictable circumstances like
                    accidents, theft or natural calamities.
                  </p>
                  <p>
                    According to the Motor Vehicles Act of 1988, every car owner must have at least a third-party insurance policy.
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

export default CarInsurance;