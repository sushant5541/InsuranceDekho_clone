import React from 'react';
import './Footer.css';

const stats = [
  { icon: "https://www.insurancedekho.com/pwa/img/v2_icon_happysmiles_1.svg", value: "80 Lacs+", label: "Happy Smiles" },
  { icon: "https://www.insurancedekho.com/pwa/img/v2_icon_Grating_1.svg", value: "4.8", label: "Rated on Google" },
  { icon: "https://www.insurancedekho.com/pwa/img/v2_icon_claimsetteled_4.svg", value: "35k+", label: "Claims Served" }
];

const FooterStats = () => {
  return (
    <div className="footer-stats-section">
      <div className="link-listing-box">
        <ul>
          {stats.map((stat, index) => (
            <li key={index}>
              <div className="stat-icon">
                <img 
                  src={stat.icon} 
                  alt={stat.label} 
                  width="30" 
                  height="30" 
                  loading="lazy" 
                />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FooterStats;