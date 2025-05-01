// components/InsurancePartners/PartnerCard.jsx
import React from 'react';

const PartnerCard = ({ name, logo, link }) => {
  return (
    <div className="partner-card">
      <div className="image-area">
        <a href={link} className="partner-link">
          <span className="image-container">
            <img 
              loading="lazy" 
              src={logo} 
              className="partner-logo" 
              alt={`About ${name}`} 
              width="144" 
              height="101" 
            />
          </span>
          <div className="partner-name">{name}</div>
        </a>
      </div>
    </div>
  );
};

export default PartnerCard;