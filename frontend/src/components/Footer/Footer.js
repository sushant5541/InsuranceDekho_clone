import React from 'react';
import './Footer.css';
import SocialLinks from './SocialLinks';
import FooterLinks from './FooterLinks';
import FooterStats from './FooterStats';

const Footer = () => {
  return (
    <footer className="footer-container" style={{maxWidth:"100%"}}>
      <div className="footer-row">
        <div className="footer-brand-section">
          <div className="footer-logo">
            <a href="/" title="Compare & Buy Car, Bike and Health Insurance Online - InsuranceDekho">
              <img 
                src="https://static.insurancedekho.com/pwa/img/id-main-logo-new_4.svg" 
                alt="InsuranceDekho" 
                width="250" 
                height="50" 
              />
            </a>
          </div>
          <SocialLinks />
          <div className="footer-support">
            <p><span>Email: </span> <a href="mailto:support@insurancedekho.com">support@insurancedekho.com</a></p>
            <p><span>Call: </span> <a href="tel:7551196989">755 1196 989</a></p>
          </div>
        </div>
        
        <FooterLinks 
          title="Products"
          links={[
            { title: "Car Insurance", url: "/car-insurance" },
            { title: "Bike Insurance", url: "/bike-insurance" },
            { title: "Health Insurance", url: "/health-insurance" },
            { title: "Life Insurance", url: "/life-insurance" },
            { title: "Term Insurance", url: "/life-insurance/term-insurance" },
          ]}
        />
        
        <FooterLinks 
          title="Policy"
          links={[
            { title: "Privacy Policy", url: "/privacy-policy" },
            { title: "Grievance Redressal", url: "/grievance-redressal" },
            { title: "Fraud Detection", url: "/fraud-detection" },
            { title: "Shipping Policy", url: "/shipping-policy" },
            { title: "Terms of Use", url: "/term-use" },
            { title: "Cancellation & Refund", url: "/cancellation-and-refund" },
            { title: "E-Insurance Account", url: "/e-insurance-account" }
          ]}
        />
        
        <FooterLinks 
          title="General"
          links={[
            { title: "Contact Us", url: "/contact-us" },
            { title: "Feedback", url: "/motor/feedback" },
            { title: "Fraud identification", url: "/fraud-identification" },
            { title: "Disclaimer", url: "/disclaimer" },
            { title: "Annual Reports/Annual Returns", url: "/investor" },
            { title: "Solicitation Process", url: "/solicitation-process" },
            { title: "ID Alumni Page", url: "https://alumni.insurancedekho.com/" },
            { title: "Corporate Social Responsibility", url: "/corporate-social-responsibility" }
          ]}
        />
        
        <FooterStats />
      </div>
    </footer>
  );
};

export default Footer;