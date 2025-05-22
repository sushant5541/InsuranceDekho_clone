import React, { useState, useEffect } from 'react';
import '../styles/HealthInsurance.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer/Footer';

const HealthInsuranceForm = ({ formData, onContinue, onBack }) => {
  const [selectedMembers, setSelectedMembers] = useState({
    self: false,
    spouse: false,
    mother: false,
    father: false,
    children: []
  });
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  const toggleMember = (member) => {
    setSelectedMembers(prev => ({
      ...prev,
      [member]: !prev[member]
    }));
  };

  const addChild = (type) => {
    const newChild = {
      id: Date.now(),
      type,
      age: ''
    };
    
    setSelectedMembers(prev => ({
      ...prev,
      children: [...prev.children, newChild]
    }));
  };

  const removeChild = (id) => {
    setSelectedMembers(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id)
    }));
  };

  const updateChildAge = (id, age) => {
    setSelectedMembers(prev => ({
      ...prev,
      children: prev.children.map(child => 
        child.id === id ? {...child, age} : child
      )
    }));
  };

  const handleContinue = () => {
    // Validate at least one member is selected
    const hasMembers = selectedMembers.self || selectedMembers.spouse || 
                      selectedMembers.mother || selectedMembers.father || 
                      selectedMembers.children.length > 0;
    
    if (!hasMembers) {
      setPincodeError('Please select at least one family member');
      return;
    }
    
    // Validate children ages
    const invalidChild = selectedMembers.children.find(child => 
      !child.age || isNaN(child.age) || child.age < 0 || child.age > 25
    );
    
    if (invalidChild) {
      setPincodeError('Please enter valid ages for all children (0-25)');
      return;
    }
    
    if (!pincode) {
      setPincodeError('Please enter your city pincode');
      return;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return;
    }
    
    onContinue({
      ...formData,
      pincode,
      members: selectedMembers
    });
  };

  return (
    <div className="health-insurance-form">
      <div className="arrowblock" onClick={onBack}>
        <span className="leftArrow">
          <img src="https://static.insurancedekho.com/pwa/img/back-arrow-new.svg" alt="Arrow" />
        </span>
      </div>
      
      <div className="scrollarea">
        <div className="findbest">
          Find the best plans with up to <span>25% discount*</span>
        </div>
        
        <div className="adultGrp">
          <div className="selectext">Select adults</div>
          <div className="rowlist">
            <div className={`cards ${selectedMembers.self ? 'selected' : ''}`} onClick={() => toggleMember('self')}>
              <span className="imgbox">
                <img src="https://static.insurancedekho.com/pwa/img/img-husband.svg" alt="Self" />
                {selectedMembers.self && <img src="https://static.insurancedekho.com/pwa/img/ic_tick_green2.svg" className="greentick" alt="Tick" />}
              </span>
              <div className="memb">Self</div>
            </div>
            
            <div className={`cards ${selectedMembers.spouse ? 'selected' : ''}`} onClick={() => toggleMember('spouse')}>
              <span className="imgbox">
                <img src="https://static.insurancedekho.com/pwa/img/img-wife.svg" alt="Spouse" />
                {selectedMembers.spouse && <img src="https://static.insurancedekho.com/pwa/img/ic_tick_green2.svg" className="greentick" alt="Tick" />}
              </span>
              <div className="memb">Spouse</div>
            </div>
            
            <div className={`cards ${selectedMembers.mother ? 'selected' : ''}`} onClick={() => toggleMember('mother')}>
              <span className="imgbox">
                <img src="https://static.insurancedekho.com/pwa/img/img-mother.svg" alt="Mother" />
                {selectedMembers.mother && <img src="https://static.insurancedekho.com/pwa/img/ic_tick_green2.svg" className="greentick" alt="Tick" />}
              </span>
              <div className="memb">Mother</div>
            </div>
            
            <div className={`cards ${selectedMembers.father ? 'selected' : ''}`} onClick={() => toggleMember('father')}>
              <span className="imgbox">
                <img src="https://static.insurancedekho.com/pwa/img/img-father.svg" alt="Father" />
                {selectedMembers.father && <img src="https://static.insurancedekho.com/pwa/img/ic_tick_green2.svg" className="greentick" alt="Tick" />}
              </span>
              <div className="memb">Father</div>
            </div>
          </div>
        </div>
        
        {selectedMembers.children.length > 0 && (
          <div className="childgrp">
            <div className="selectext">Selected Children</div>
            <div className="children-list">
              {selectedMembers.children.map(child => (
                <div key={child.id} className="child-card">
                  <img 
                    src={child.type === 'son' ? 
                      "https://static.insurancedekho.com/pwa/img/img-son.svg" : 
                      "https://static.insurancedekho.com/pwa/img/img-daughter.svg"} 
                    alt={child.type} 
                  />
                  <div className="child-info">
                    <span>{child.type === 'son' ? 'Son' : 'Daughter'}</span>
                    <input
                      type="number"
                      placeholder="Age"
                      value={child.age}
                      onChange={(e) => updateChildAge(child.id, e.target.value)}
                      min="0"
                      max="25"
                      className="child-age-input"
                    />
                  </div>
                  <button onClick={() => removeChild(child.id)} className="remove-child">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="addchild">
          <span onClick={() => addChild('son')}>
            <div className="addchildgroup">
              <img src="https://static.insurancedekho.com/pwa/img/plus_icon.svg" title="plus" alt="Add Son" /> 
              Add Son
            </div>
          </span>
          <span onClick={() => addChild('daughter')}>
            <div className="addchildgroup">
              <img src="https://static.insurancedekho.com/pwa/img/plus_icon.svg" title="plus" alt="Add Daughter" /> 
              Add Daughter
            </div>
          </span>
        </div>
        
        <div className="areapin">
          <div className="input-field">
            <input 
              id="pincode" 
              type="tel" 
              name="pincode" 
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setPincodeError('');
              }}
              maxLength="6"
              className={pincodeError ? 'error-input' : ''}
            />
            <label htmlFor="pincode">Enter your city pincode</label>
            {pincodeError && <span className="error-message">{pincodeError}</span>}
          </div>
        </div>
      </div>
      
      <div className="btnbox">
        <button className="button-primary large" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

const HealthInsurance = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('form'); // 'form', 'member-selection'
    const [insuranceFormData, setInsuranceFormData] = useState(null);

    const plans = [
        {
            name: "Care Supreme Discounted",
            company: "Care Health Insurance Limited",
            logo: "https://healthstatic.insurancedekho.com/prod/oem_image/1598957797.jpg",
            coverage: "5 Lakh",
            price: "615/month",
            features: ["No room rent limit", "Unlimited restoration benefits"]
        },
        {
            name: "Reassure 2.0 Titanium+ (Direct)",
            company: "MaxBupa",
            logo: "https://healthstatic.insurancedekho.com/prod/oem_image/20211022184151.png",
            coverage: "5 Lakh",
            price: "628/month",
            features: ["No room rent limit", "100% no claim bonus"]
        },
        {
            name: "Comprehensive Individual",
            company: "MaxBupa",
            logo: "https://healthstatic.insurancedekho.com/prod/oem_image/1589437596.jpg",
            coverage: "5 Lakh",
            price: "628/month",
            features: ["No room rent limit", "100% no claim bonus"]
        }
    ];

    const benefits = [
        {
            title: "Financial Security",
            description: "A health insurance policy can free you and your family from the financial burden that comes with a medical emergency.",
            icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004073_b45536e7a3.svg"
        },
        {
            title: "Peace of Mind",
            description: "Once you and your loved ones are covered under a health insurance plan, you will have peace of mind and can focus on getting the right treatment stress-free.",
            icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004074_e922d34238.svg?updated_at=2024-10-28T08:58:00.279Z"
        },
        {
            title: "Financial Security",
            description: "A health insurance policy can free you and your family from the financial burden that comes with a medical emergency.",
            icon: "https://staticimg.insurancedekho.com/strapi/Group_1000004075_02d44e54a1.svg?updated_at=2024-10-28T08:58:01.331Z"
        }
    ];

    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        gender: 'Male',
        address: '',
        city: '',
        pincode: '',
        whatsAppOptIn: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (currentUser) {
            setFormData({
                gender: currentUser.gender || 'male',
                name: currentUser.name || '',
                mobile: currentUser.phoneNumber || currentUser.mobile || '',
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Invalid mobile number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setInsuranceFormData(formData);
        setStep('member-selection');
    };

    const handleContinueToQuote = (data) => {
        // Combine form data with plans and navigate to health-quote
        navigate('/health-quote', {
            state: {
                formData: data,
                plan: { // Adding a default plan object similar to PremiumDetails
                    name: "Custom Health Plan",
                    coverage: "Custom Coverage",
                    features: ["Family coverage", "Custom benefits"]
                },
                plans: plans // Passing all available plans
            }
        });
    };

    const renderStep = () => {
        switch (step) {
            case 'member-selection':
                return (
                    <HealthInsuranceForm 
                        formData={insuranceFormData}
                        onContinue={handleContinueToQuote}
                        onBack={() => setStep('form')}
                    />
                );
            default:
                return (
                    <div className="health-insurance-page">
                        {/* Hero Section */}
                        <section className="hero-section">
                            <div className="container" style={{ maxWidth: "100%" }}>
                                <div className="hero-content">
                                    <h1>Buy Health Insurance Plans and Policies Online</h1>
                                    <p>A health or medical insurance policy covers your medical expenses for illnesses and injuries including hospitalisation, daycare procedures, ambulance charges, medical care at home, medicine costs, and more.</p>

                                    <div className="key-features">
                                        <h3>Key Highlights</h3>
                                        <div className="features-grid">
                                            <div className="feature-item">
                                                <img src="https://staticimg.insurancedekho.com/strapi/Group_1000004038_797ae83ff3.svg" alt="Plans" />
                                                <p className="feature-title">Wide range of Plans & Companies</p>
                                                <p className="feature-sub">(134 Plans and 22 Companies)</p>
                                            </div>
                                            <div className="feature-item">
                                                <img src="https://staticimg.insurancedekho.com/strapi/Group_1000004106_722ee3c5ae.svg?updated_at=2024-10-28T08:55:03.581Z" alt="Plans" />
                                                <p className="feature-title">24 x 7 Claim Support</p>
                                                <p className="feature-sub">(We are there for the time of your need to support in claim processing)*</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="quote-form">
                                    <div className="form-header">
                                        <div className="offer-tag">
                                            <img src="https://static.insurancedekho.com/pwa/img/offerImg.svg" alt="Offer" />
                                            <span>Get Online Discount upto <strong>25% off*</strong></span>
                                        </div>
                                        <p>Buy Health Plans from <strong>Rs. 10/day*</strong></p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <div className="radio-group">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        checked={formData.gender === 'male'}
                                                        onChange={handleChange}
                                                    />
                                                    Male
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        checked={formData.gender === 'female'}
                                                        onChange={handleChange}
                                                    />
                                                    Female
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder=" "
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={errors.name ? 'error-input' : ''}
                                            />
                                            <label>Full Name</label>
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="tel"
                                                name="mobile"
                                                placeholder=" "
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className={errors.mobile ? 'error-input' : ''}
                                            />
                                            <label>Mobile Number</label>
                                            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                                        </div>

                                        <button type="submit" className="submit-btn">
                                            View Plans
                                        </button>

                                        <p className="terms">
                                            By clicking, I agree to <a href="/terms">terms & conditions</a> and <a href="/privacy">privacy policy</a>.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </section>

                        {/* Best Plans Section */}
                        <section className="plans-section">
                            <div className="container">
                                <h2>Best Health Insurance Plans In India</h2>

                                <div className="plans-grid">
                                    {plans.map((plan, index) => (
                                        <div key={index} className="plan-card">
                                            <div className="plan-content">
                                                <div className="plan-header">
                                                    <img src={plan.logo} alt={plan.name} />
                                                    <div>
                                                        <h3>{plan.name}</h3>
                                                        <p>{plan.company}</p>
                                                    </div>
                                                </div>

                                                <div className="plan-details">
                                                    <div>
                                                        <p>Cover Amount</p>
                                                        <p className="bold">{plan.coverage}</p>
                                                    </div>
                                                    <div>
                                                        <p>Starting at</p>
                                                        <p className="bold">{plan.price}</p>
                                                    </div>
                                                </div>

                                                <div className="plan-features">
                                                    <ul>
                                                        {plan.features.map((feature, i) => (
                                                            <li key={i}>
                                                                <span className="tick">✓</span> {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <button
                                                className="check-premium-btn"
                                                onClick={() => navigate('/check-premium', { state: { plan } })}
                                            >
                                                Check Premium <span>→</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Benefits Section */}
                        <section className="benefits-section">
                            <div className="container">
                                <h2>Significance of having a health insurance policy</h2>
                                <p className="subtitle">Following are some significant benefits of a comprehensive health insurance plan</p>

                                <div className="benefits-grid">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="benefit-card">
                                            <img src={benefit.icon} alt={benefit.title} />
                                            <h3>{benefit.title}</h3>
                                            <p>{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                );
        }
    };

    return (
        <>
            {renderStep()}
            {step === 'form' && <Footer />}
        </>
    );
};

export default HealthInsurance;