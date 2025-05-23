// frontend/src/pages/TermInsurance.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/TermInsurance.css';
import Footer from '../components/Footer/Footer';
import TermInsurancePlans from '../components/TermInsurancePlans';

const TermInsurance = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    dob: user?.dob || '',
    phone: user?.phone || '',
    whatsappConsent: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [age, setAge] = useState('');

  const insurers = [
    { name: "Max Life", logo: "max" },
    { name: "LIC", logo: "lic" },
    { name: "Bajaj Allianz", logo: "bajaj" },
    { name: "TATA AIA", logo: "tata" },
    { name: "ICICI Pru", logo: "icici" },
    { name: "Bandhan Life", logo: "bandhan" },
    { name: "Canara HSBC", logo: "hsbc" },
    { name: "PNB MetLife", logo: "pnb" },
    { name: "Digit", logo: "digit" },
    { name: "HDFC Life", logo: "hdfc" }
  ];

  useEffect(() => {
    if (formData.dob) {
      setAge(calculateAge(formData.dob));
    }
  }, [formData.dob]);

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return `${calculatedAge} Years`;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.phone) errors.phone = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Invalid mobile number';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setShowPlans(true);
      
      setTimeout(() => {
        const plansSection = document.querySelector('.plans-section');
        if (plansSection) {
          plansSection.scrollIntoView({ behavior: 'smooth' });
        }
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <>
      <div className="insurance-dekho-page">
        {/* Hero Banner */}
        <div className="hero-banner term-banner">
          <div className="container">
            <div className="banner-content">
              <h1>Get <span>₹1 Crore</span> Term Cover at <span>₹490/month</span></h1>
              <p>Compare 15+ insurers and buy online in 5 minutes</p>
              
              <div className="insurer-logos">
                {insurers.map((insurer, index) => (
                  <div key={index} className="insurer-card">
                    <img 
                      src={`https://static.insurancedekho.com/pwa/img/banner/${insurer.logo}.png`} 
                      alt={insurer.name} 
                      loading="lazy"
                    />
                    <p>{insurer.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Form */}
            <form className="quote-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <img src="https://static.insurancedekho.com/pwa/img/offerImg.svg" alt="Offer" />
                <h2>Get Online Discount upto <span>15% off<sup>*</sup></span></h2>
              </div>

              <div className="form-body">
                <div className="form-group">
                  <input 
                    type="text" 
                    id="fullName" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className={formErrors.name ? 'error' : ''}
                    required 
                  />
                  <label htmlFor="fullName">Full Name</label>
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>

                <div className="form-group dob-group">
                  <input 
                    type="date" 
                    id="dob" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                    max={new Date().toISOString().split('T')[0]}
                    className={formErrors.dob ? 'error' : ''}
                    required
                  />
                  <label htmlFor="dob">Date of Birth</label>
                  <img 
                    src="https://static.insurancedekho.com/pwa/img/calendar.svg" 
                    alt="Calendar" 
                    className="calendar-icon"
                  />
                  {age && <span className="age-badge">{age}</span>}
                  {formErrors.dob && <span className="error-message">{formErrors.dob}</span>}
                </div>

                <div className="form-group phone-group">
                  <div className="country-code">
                    <span>+91</span>
                    <img src="https://static.insurancedekho.com/pwa/img/dropdown-gray.svg" alt="Dropdown" />
                  </div>
                  <input 
                    type="tel" 
                    id="mobile" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" "
                    maxLength="10"
                    className={formErrors.phone ? 'error' : ''}
                    required
                  />
                  <label htmlFor="mobile">Mobile Number</label>
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Loading...' : 'View Plans'}
                  {!isSubmitting && (
                    <img 
                      src="https://static.insurancedekho.com/pwa/img/arrow-animation.gif" 
                      alt="Arrow" 
                      className="arrow-animation"
                    />
                  )}
                </button>

                <div className="form-footer">
                  <p className="terms-text">
                    By clicking, I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>
                  </p>
                  <label className="whatsapp-optin">
                    <input 
                      type="checkbox" 
                      name="whatsappConsent"
                      checked={formData.whatsappConsent}
                      onChange={handleChange}
                    />
                    <span>Get Quotes on <img src="https://static.insurancedekho.com/pwa/img/newImages/whatsapp-gray.svg" alt="WhatsApp" /> WhatsApp</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Google Reviews */}
        <div className="reviews-section">
          <div className="container">
            <div className="reviews-card">
              <img 
                src="https://static.insurancedekho.com/pwa/img/landingpages/google-rating-icon.svg" 
                alt="Google" 
                className="google-logo"
              />
              <div className="rating-stars">
                <img src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg" alt="Star" />
                <img src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg" alt="Star" />
                <img src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg" alt="Star" />
                <img src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingFull.svg" alt="Star" />
                <img src="https://static.insurancedekho.com/pwa/img/landingpages/googleStar-ratingHalf.svg" alt="Half Star" />
                <span>4.8/5</span>
              </div>
              <h3>Read what our customers have to say</h3>
              <p className="rating-text">Rated <span>4.8/5</span> with over <span>5775</span> reviews on Google</p>
              <a href="https://www.google.com" className="reviews-link">See all reviews</a>
              <a href="https://www.google.com" className="rate-us-btn">Rate Us</a>
            </div>
          </div>
        </div>

        {/* Insurance Plans */}
        <div className="plans-section">
          <div className="container">
            <div className="section-header">
              <h2>Best Term Insurance Plans for Maximum Protection</h2>
            </div>
            
            {showPlans ? (
              <TermInsurancePlans formData={{ ...formData, age }} />
            ) : (
              <>
                <div className="plans-content">
                  <p className="intro-text">
                    Term insurance provides pure life cover at affordable premiums, ensuring your family's financial security 
                    even in your absence. It's the most cost-effective way to get a high sum assured for your loved ones.
                  </p>
                  
                  <div className="plan-highlights">
                    <div className="plan-card">
                      <h3>HDFC Life Click 2 Protect Life</h3>
                      <p>
                        HDFC Life Click 2 Protect Life is a pure term insurance plan that offers comprehensive life cover 
                        at affordable premiums. It provides multiple plan options to choose from, including increasing cover, 
                        return of premium, and critical illness rider options.
                      </p>
                    </div>
                    
                    <div className="plan-card">
                      <h3>ICICI Pru iProtect Smart</h3>
                      <p>
                        ICICI Pru iProtect Smart is a comprehensive term insurance plan that offers life cover along with 
                        optional riders for critical illness, accidental death, and disability. It provides flexibility to 
                        choose between regular pay or limited pay premium payment options.
                      </p>
                    </div>
                    
                    <div className="plan-card">
                      <h3>Max Life Smart Secure Plus Plan</h3>
                      <p>
                        Max Life Smart Secure Plus Plan offers a pure protection term insurance cover with the option to 
                        add riders for enhanced protection. It provides tax benefits under Section 80C and Section 10(10D) 
                        of the Income Tax Act, 1961.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="cta-banner">
                  <p>Fill the form above to view personalized term insurance plans</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Why Choose Us Section */}
    </div>
      <Footer />
    </>
  );
};

export default TermInsurance;