import React from 'react';

import Carousel from '../components/Carousel'
import InsuranceCards from '../components/InsuranceCard';
import '../styles/Home.css';
import InsurancePartners from '../components/InsurancePartners/InsurancePartners';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  return (
    <div>
      <Carousel />
      <InsuranceCards />
      <div id="idAchieve" style={{maxWidth:"100%"}}>
        <div className="achievement">
          <div className="achIcon">
            <img src="https://static.insurancedekho.com/pwa/img/v2_icon_happysmiles.svg" alt="ID Happy Smiles" />
          </div>
          <div className="achContain">80 Lacs+<span>Happy Smiles</span></div>
        </div>
        <div className="achievement">
          <div className="achIcon">
            <img alt="ID Rated on Google" width="45" height="45" src="https://static.insurancedekho.com/pwa/img/v2_icon_Grating.svg"></img>
          </div>
          <div className="achContain">4.8<span>Rated on Google</span>
          </div>
        </div>
        <div className="achievement">
          <div className="achIcon">
            <img alt="ID Claims Served" width="45" height="45" src="https://static.insurancedekho.com/pwa/img/v2_icon_claimsetteled_3.svg"></img>
          </div>
          <div className="achContain">35k+<span>Claims Served</span></div>
        </div>
      </div>


  <section className="benefits-section" >
  <div className="container"style={{maxWidth:"100%"}}>
    <h2>Benefits of InsuranceDekho</h2>
    <div className="subtitle">
      Understand your insurance policy options. Identify the best value. Enjoy peace of mind.
    </div>

    <div className="benefit-cards">
      <div className="benefit-card">
        <img src="https://static.insurancedekho.com/pwa/img/benifitimg1.svg" alt="5 Minutes Policy Issuance"></img>
        <div className="title">5 Minutes Policy Issuance*</div>
        <p>
          Say no to spending hours and days in queues doing paperwork. Get your insurance issued instantly — the entire process takes just 5 minutes on InsuranceDekho.
        </p>
      </div>

      <div className="benefit-card">
        <img src="https://static.insurancedekho.com/pwa/img/benifitimg2.svg" alt="80 Lac Happy Customers"></img>
        <div className="title">Over 80 Lac Happy Customers</div>
        <p>
          We’ve delighted over 80 lac customers with our quick process, transparent services, and dedicated support. Join the growing InsuranceDekho family.
        </p>
      </div>

      <div className="benefit-card">
        <img src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg" alt="Dedicated Support Team"></img>
        <div className="title">Dedicated Support Team</div>
        <p>
          Our support team is here for you 7 days a week — from policy purchase to claim settlement, we’ve got your back at every step.
        </p>
      </div>
    </div>
  </div>
</section>


<div className="how-it-works">
  <h2>How InsuranceDekho Works?</h2>
  <div className="steps-container">

    <div className="step">
      <img className="step-icon" src="https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg" alt="Fill in Your Details" />
      <img className="step-arrow" src="https://static.insurancedekho.com/pwa/img/fancy-arrow.svg" alt="arrow" />
      <div className="title">Fill in Your Details</div>
      <p>Fill in your details and get insurance policy premium quotes from top-rated insurers instantly.</p>
    </div>

    <div className="step">
      <img className="step-icon" src="https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg" alt="Select a Plan" />
      <img className="step-arrow" src="https://static.insurancedekho.com/pwa/img/fancy-arrow.svg" alt="arrow" />
      <div className="title">Select a Plan</div>
      <p>From numerous available quotes, choose the one that best suits your requirements and budget.</p>
    </div>

    <div className="step">
      <img className="step-icon" src="https://static.insurancedekho.com/pwa/img/HowIDwork_img3.svg" alt="Make Payment and Sit Back" />
      <div className="title">Make Payment and Sit Back</div>
      <p>Pay online and get your policy right away in your inbox.</p>
    </div>

  </div>
</div>

<InsurancePartners />
<Footer/>
    </div>

    
  );
};

export default HomePage;
