import React, { useState } from 'react';
import '../styles/CarInsurance.css';
import Navbar from '../components/Navbar'
const BikeInsurance = () => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    brand: '',
    city: '',
    year: ''
  });
  const [activeTab, setActiveTab] = useState('Comprehensive');

  const bikeBrands = ['Bajaj', 'Hero', 'Honda', 'TVS', 'Royal Enfield', 'Yamaha'];
  const cities = ['Ahmedabad', 'Bangalore', 'Chandigarh', 'Chennai'];
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);
  
  const insurancePlans = [
    {
      name: 'Hdfc Ergo Bike Insurance',
      logo: 'https://staticimg.insurancedekho.com/seo/insurer/hdfc-ergo.jpg',
      features: ['8000+ Cashless Garages', '100% Claims Settled', 'Unlimited Zero Dep. Claims'],
      price: '₹2881',
      keyFeatures: [
        'Maximum Cashless Garages',
        'Over Night Vehicle Repairs',
        '24x7 Roadside Assistance',
        'Quick Claim Settlement'
      ]
    },
    {
      name: 'United India Bike Insurance',
      logo: 'https://staticimg.insurancedekho.com/seo/insurer/united-india.png',
      features: ['3100 Cashless Garages', '95% Claims Settled', 'Unlimited Comprehensive Claims'],
      price: '₹2396',
      keyFeatures: [
        'Towing Assistance (For Accidents)',
        'Coverage Outside India',
        'PSU Provider',
        'Quick Claim Settlement'
      ]
    }
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
    <Navbar/>
    <div className="car-insurance-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="container">
          <div className="breadcrumb">
            <span><a href="/">Home</a></span>
            <span><a href="/bike-insurance">Bike Insurance</a></span>
          </div>
          
          <h1>Bike Insurance</h1>
          
          <div className="quote-section">
            <div className="quote-header">
              <p>Bike insurance starting from <span className="highlight">₹ 6/day*</span></p>
              <div className="quote-steps">
                <ul>
                  <li>Bike No. <span className="separator"></span></li>
                  <li>Select Plan <span className="separator"></span></li>
                  <li>Policy Issued</li>
                </ul>
              </div>
            </div>
            
            <form className="quote-form">
              <div className="form-group">
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Your bike number ex DL-12-AB-2345"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <select 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Brand</option>
                    {bikeBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <select 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <select 
                    name="year" 
                    value={formData.year} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button type="submit" className="submit-btn">
                Check Prices <span className="arrow-icon">→</span>
              </button>
              
              <div className="form-footer">
                <p className="terms">
                  By clicking, I agree to <a href="/terms">terms & conditions</a> and <a href="/privacy">privacy policy</a>.
                </p>
                <p className="new-bike">
                  <a href="#">Brand new bike? <span className="arrow-right">→</span></a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Insurance Plans */}
      <section className="insurance-plans">
        <div className="container">
          <h2>Top Bike Insurance Plans</h2>
          
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
                  </div>
                  <button className="check-price-btn">Check Prices</button>
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
          
          <a href="#" className="see-more">See More Plans ↓</a>
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
    </div>
    </>
  );
};

export default BikeInsurance;