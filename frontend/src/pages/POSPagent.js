import React from 'react';
import '../styles/POSPAgentPage.css';
import Footer from '../components/Footer/Footer';
const POSPAgentPage = () => {
  return (
    <>
    <div className="posp-agent-page">
      {/* Hero Banner */}
      <div className="homepage-banner">
        <div className="banner-container-wrapper">
          <div className="banner-container-inner-wrapper">
            <div className="banner-content">
              <div className="banner-text">
                <div className="tagline">
                  <p>InsuranceDekho POS Partners</p>
                </div>
                <h2>Start earning from anywhere <span>Become a POSP Insurance Agent</span></h2>
                <p className="subtext">Turn every policy into profit</p>
                <ul className="insurer-details">
                  <li>
                    <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/completStep.svg" alt="icon" />
                    <p>1.8 Lac + partners</p>
                  </li>
                  <li>
                    <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/completStep.svg" alt="icon" />
                    <p>49+ insurer integrations</p>
                  </li>
                  <li>
                    <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/completStep.svg" alt="icon" />
                    <p>Timely payouts</p>
                  </li>
                </ul>
              </div>
              
              {/* Login Widget - Desktop */}
              <div className="login-wrapper desktop-login">
                <div className="live-partners-badge">
                  <span className="green-dot"></span>
                  <span className="text"><span>25,000 </span>live Partners</span>
                </div>
                <div className="login-form">
                  <h2><span><b>Login</b> or <b>Signup</b></span></h2>
                  <div className="form-group">
                    <input type="tel" id="mobileNumber" name="mobileNumber" placeholder=" " />
                    <label htmlFor="mobileNumber">Mobile Number</label>
                  </div>
                  <button className="submit-btn">Start Earning Now</button>
                  <p className="terms-text">By continuing, you agree to our <a href="/terms-of-use">Terms & Conditions</a>.</p>
                </div>
                <div className="qr-code">
                  <img src="https://posstatic.insurancedekho.com/images/Frame-1000004076-1738934769300.jpg" alt="QR Code" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Login Widget - Mobile */}
        <div className="login-wrapper mobile-login">
          <div className="login-form">
            <h2><span><b>Login</b> or <b>Signup</b></span></h2>
            <div className="form-group">
              <input type="tel" id="mobileNumberMobile" name="mobileNumber" placeholder=" " />
              <label htmlFor="mobileNumberMobile">Mobile Number</label>
            </div>
            <button className="submit-btn">Send OTP</button>
            <p className="terms-text">By continuing, you agree to our <a href="/terms-of-use">Terms & Conditions</a> and <a href="/privacy-policy">privacy policy</a>.</p>
          </div>
          <div className="live-partners-badge">
            <span className="green-dot"></span>
            <span className="text"><span>25,000 </span>live Partners</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container">
          <h2>Benefits of becoming POSP Insurance Agent <span>(Point of Sales Person)</span></h2>
          <p className="section-description">Understand your customer requirements, Search for the relevant quote, Sell policy, and earn income. Know about the benefits of becoming a POSP insurance advisor.</p>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/credit-card.svg" alt="Timely payouts" />
              </div>
              <h3>Timely payouts</h3>
              <p>Receive payments on time without any delays</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/touch.svg" alt="No paperwork" />
              </div>
              <h3>No paperwork</h3>
              <p>100% digital process</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/online-education.svg" alt="Professional trainings" />
              </div>
              <h3>Professional trainings</h3>
              <p>Get trained by industry experts</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/img-support.svg" alt="24x7 support" />
              </div>
              <h3>Dedicated Support</h3>
              <p>Get assistance on all the 7 days for policy issuance and claim assistance</p>
            </div>
          </div>
          
          <div className="help-contact">
            <a href="tel:7551196989">
              <img className="desktop-help" src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/help-no.svg" alt="Help number" />
              <img className="mobile-help" src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/help-cal-mbl.svg" alt="Help number" />
            </a>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-section">
        <h2>We are loved and appreciated</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">
              <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/v2_icon_happysmiles.svg" alt="Happy Smiles" />
            </div>
            <div className="achievement-text">11 Mn+<span> Happy Smiles</span></div>
          </div>
          
          <div className="achievement-card">
            <div className="achievement-icon">
              <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/v2_icon_claimsetteled_3.svg" alt="Claims Served" />
            </div>
            <div className="achievement-text">95k+<span>Claims Served</span></div>
          </div>
          
          <div className="achievement-card">
            <div className="achievement-icon">
              <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/v2_icon_Grating.svg" alt="Google Rating" />
            </div>
            <div className="achievement-text">4.8<span>Rated on Google</span></div>
          </div>
        </div>
      </div>

      {/* POSP Info Section */}
      <div className="posp-info-section">
        <div className="content-wrapper">
          <div className="info-image" style={{display:'flex'}}>
            <img src="https://pos.insurancedekho.com/public/b2c/zigwheels/img/salesPointList.svg" alt="Sales Points" />
         
          <div className="info-text" style={{marginTop:'90px'}}>
            <h2><span>Who is a POSP</span>(Point of Sales Person)?</h2>
            <p>A POSP or Point of Sales Person is one who is responsible for selling different types of insurance products such as health insurance, car insurance, life insurance, and more. To become a POSP insurance agent, you must be at least 18 years of age and need to complete IRDAI certified course.</p>
          </div>
           </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default POSPAgentPage;