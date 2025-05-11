
import React, { useState } from 'react';
import PartnerCard from './PartnerCard';
import './InsurancePartners.css';

const InsurancePartners = () => {
  const [activeTab, setActiveTab] = useState('Health');
  
  // Insurance partners data organized by category
  const partnersData = {
    General: [
      { name: "Bajaj Allianz Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/bajaj.png", link: "/companies/bajaj-allianz" },
      { name: "HDFC ERGO Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/hdfc.png", link: "/companies/hdfc-ergo" },
      { name: "Royal Sundaram Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/royal-s.png", link: "/companies/royal-sundaram" },
      { name: "Cholamandalam Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/chola.png", link: "/companies/cholamandalam" },
      { name: "Zuno Insurance", logo: "https://staticimg.insurancedekho.com/assets/zuno_health_insurance.png", link: "/companies/zuno" },
      { name: "ICICI Lombard Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/icici.png", link: "/companies/icici-lombard" }
    ],
    Car: [
      { name: "HDFC ERGO Car Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/hdfc.png", link: "/car-insurance/companies/hdfc-ergo" },
      { name: "ICICI Lombard Car Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/icici.png", link: "/car-insurance/companies/icici-lombard" },
      { name: "Bajaj Allianz Car Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/bajaj.png", link: "/car-insurance/companies/bajaj-allianz" },
      { name: "Digit Car Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/digit.png", link: "/car-insurance/companies/digit" }
    ],
    Bike: [
      { name: "HDFC ERGO Bike Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/hdfc.png", link: "/bike-insurance/companies/hdfc-ergo" },
      { name: "Bajaj Allianz Bike Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/bajaj.png", link: "/bike-insurance/companies/bajaj-allianz" },
      { name: "Royal Sundaram Bike Insurance", logo: "https://staticimg.insurancedekho.com/seo/insurer/royal-s.png", link: "/bike-insurance/companies/royal-sundaram" }
    ],
    Health: [
      { name: "Niva Bupa Health Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20230904182919.jpg", link: "/health-insurance/niva-bupa-health-insurance" },
      { name: "Care Health Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20230626150438.png", link: "/health-insurance/care-health-insurance" },
      { name: "Bajaj Allianz Health Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20230407124557.png", link: "/health-insurance/bajaj-allianz" },
      { name: "ICICI Lombard Health Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20190903134454.jpg", link: "/health-insurance/icici-lombard" },
      { name: "HDFC ERGO Health Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20210422100011.png", link: "/health-insurance/hdfc-ergo" }
    ],
    Term: [
      { name: "ICICI Term Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20210609170906.jpg", link: "/life-insurance/term-insurance/icici-prudential" },
      { name: "HDFC Life Term Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20210609170631.jpg", link: "/life-insurance/term-insurance/hdfc" },
      { name: "LIC Term Insurance", logo: "https://healthstatic.insurancedekho.com/prod/oem/20210623203719.jpg", link: "/life-insurance/term-insurance/lic" }
    ]
  };

  const tabs = Object.keys(partnersData);

  return (
    <section className="insurance-partners">
      <div className="container" style={{maxWidth:"100%"}}>
        <div className="title-wrapper">
          <h2>Our Insurance Partners</h2>
          <div className="subtext">We're associated with India's popular insurance companies.</div>
        </div>
        
        <div className="tabs-container">
          <ul className="tabs-list">
            {tabs.map(tab => (
              <li 
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="partners-grid">
          {partnersData[activeTab].map((partner, index) => (
            <PartnerCard 
              key={index}
              name={partner.name}
              logo={partner.logo}
              link={partner.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsurancePartners;