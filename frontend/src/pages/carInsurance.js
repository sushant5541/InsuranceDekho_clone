import React, { useState, useEffect } from 'react';
import '../styles/CarInsurance.css';
import usePayment from '../hooks/usePayment';
import Footer from '../components/Footer/Footer';

const CarInsurance = () => {
  const { initiatePayment } = usePayment();
  const [activeTab, setActiveTab] = useState('Comprehensive');
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    carNumber: '',
    mobileNumber: '',
    carBrand: '',
    purchasedYear: '',
  });

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
      name: 'Standalone Own Damage',
      icon: 'https://static.insurancedekho.com/pwa/img/ic_thirdparty.svg',
      description: 'Covers damages to your own vehicle from accidents, natural disasters, theft, fire, etc.'
    }
  ];

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
  }, [activeTab]);

  const handleBuyNowClick = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form data
    if (!formData.carNumber || !formData.mobileNumber || !formData.carBrand || !formData.purchasedYear) {
      alert('Please fill all the fields');
      setLoading(false);
      return;
    }

    try {
      await initiatePayment(selectedPlan, 'car', formData);
      setShowForm(false);
    } catch (error) {
      console.error('Payment failed:', error);
      alert(error.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

        {/* Insurance Plans */}
        <section className="insurance-plans">
          <div className="container">
            <h2>Top Car Insurance Plans</h2>

            <div className="plan-tabs">
              {['Comprehensive', 'Third Party', 'Own Damage'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
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
                        {plan.discount && <span className="discount-badge">{plan.discount}</span>}
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

        {/* Form Modal */}
        {showForm && (
          <div className="form-modal-overlay">
            <div className="form-modal">
              <h3>Enter Your Car Details</h3>
              <form onSubmit={handleFormSubmit}>
                <label>Car Number</label>
                <div className="form-group">
                  
                  <input
                    type="text"
                    name="carNumber"
                    value={formData.carNumber}
                    onChange={handleInputChange}
                    placeholder="eg.MH09S1212"
                    required
                  />
                </div>
                 <label>Mobile Number</label>
                <div className="form-group">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="eg.9858765332"
                    required
                  />
                </div>
                  <label>Car Brand</label>
                <div className="form-group">
                  <input
                    type="text"
                    name="carBrand"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    placeholder="eg. Mahindra, Toyota.."
                    required
                  />
                </div>
                                  <label>Purchased Year</label>
                <div className="form-group">
                  <input
                    type="number"
                    name="purchasedYear"
                    value={formData.purchasedYear}
                    onChange={handleInputChange}
                    placeholder="Enter purchased year"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
      </div>
      <Footer/>
    </>
  );
};

export default CarInsurance;