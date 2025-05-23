import React from 'react';
import '../styles/LifeNewsList.css'; // We'll create this CSS file next
import Footer from '../components/Footer/Footer';

const LifeInsuranceNews = () => {
  return (
    <>
    <div className="news-container">
      <div className="news-left-column">
        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="Ladli Behna Yojana" 
              src="https://staticimg.insurancedekho.com/strapi/Small_Ladli_Behna_Yojana_Login_and_Online_Application_7540ad7665.webp"
            />
          </div>
          <div className="news-content">
            <h2>Ladli Behna Yojana: Women's Empowerment Program</h2>
            <p className="news-description">
              Know all about Ladli Behna Yojana—objectives, benefits, eligibility, and how it empowers women through financial support and social welfare in India.
            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Amit Jain</div>
                <div className="publish-date">14 May 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="SSPMIS Mukhyamantri Vridhjan Pension Yojana" 
              src="https://staticimg.insurancedekho.com/strapi/Small_SSPMIS_Mukhyamantri_Vridhjan_Pension_Yojana_c515b7b4fe.webp"
            />
          </div>
          <div className="news-content">
            <h2>SSPMIS Mukhyamantri Vridhjan Pension Yojana</h2>
            <p className="news-description">
              Learn all about SSPMIS Mukhyamantri Vridhjan Pension Yojana. Find details on eligibility, benefits, application process, and how to check your status online.
            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Amit Jain</div>
                <div className="publish-date">14 May 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="SSPMIS Mukhyamantri Vridhjan Pension Yojana" 
              src="https://staticimg.insurancedekho.com/strapi/Small_Buy_Best_Term_Insurance_Plan_and_Policy_a91c1de79a.webp"
            />
          </div>
          <div className="news-content">
            <h2>Buy Best Term Insurance with Return of Premium in India in 2025</h2>
            <p className="news-description">
              Learn all about SSPMIS Mukhyamantri Vridhjan Pension Yojana. Find details on eligibility, benefits, application process, and how to check your status online.
            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Amit Jain</div>
                <div className="publish-date">14 May 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="SSPMIS Mukhyamantri Vridhjan Pension Yojana" 
              src="https://staticimg.insurancedekho.com/strapi/Small_Bhagya_Lakshmi_Yojana_e9ee08e978.webp"
            />
          </div>
          <div className="news-content">
            <h2>Bhagya Lakshmi Yojana: Securing the Future of the Girl Child</h2>
            <p className="news-description">
             Bhagya Lakshmi Yojana: Empowering girl children. Your guide to benefits, application, eligibility, status check, FAQs & more. Read now!
            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Amit Jain</div>
                <div className="publish-date">14 May 2025</div>
              </div>
            </div>
          </div>
        </div>


        <section className="benefits-section">
          <div className="benefits-content">
            <span className="must-dot">
              <img src="https://static.insurancedekho.com/pwa/img/must_dot.png" alt="Must Buy" />
            </span>
            <span className="must-graphic">
              <img src="https://static.insurancedekho.com/pwa/img/must_graphic.svg" alt="Must Buy" />
            </span>
            <span className="must-logo">
              <img src="https://static.insurancedekho.com/pwa/img/must_id_logo.png" alt="Must Buy" />
            </span>
            <div className="benefits-list">
              <h2>Why to Buy Life Insurance Policy Online from InsuranceDekho</h2>
              <ul>
                <li>
                  <i className="icon-check"></i>
                  <div>Tax benefit upto 1,50,000*</div>
                </li>
                <li>
                  <i className="icon-check"></i>
                  <div>Claim support everyday 10AM-7PM</div>
                </li>
                <li>
                  <i className="icon-check"></i>
                  <div>11 Mn+ happy customers</div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="advisors-section">
          <h2>Best Life Insurance Advisors in Your City.</h2>
          <div className="cities-slider">
            <div className="city-item">
              <span className="city-icon"></span>
              <span>New Delhi</span>
            </div>
            <div className="city-item">
              <span className="city-icon"></span>
              <span>Gurgaon</span>
            </div>
            {/* Add more city items here */}
          </div>
        </section>
      </div>

      <div className="news-right-column">
        <div className="insurance-partners">
          <h2>Partner Life Insurance Companies</h2>
          <div className="partners-grid">
            <div className="partner-item">
              <img 
                src="https://healthstatic.insurancedekho.com/prod/oem/20210609170207.jpg" 
                alt="ICICI Prudential Life Insurance" 
              />
              <span>ICICI Prudential Life Insurance</span>
            </div>
            <div className="partner-item">
              <img 
                src="https://healthstatic.insurancedekho.com/prod/oem/20240627124051.webp" 
                alt="SBI Life Insurance" 
              />
              <span>SBI Life Insurance</span>
            </div>
            {/* Add more partner items here */}
          </div>
          <div className="view-all-link">
            <a href="/life-insurance/companies">View All Life Insurance Companies</a>
          </div>
          <div className="disclaimer">
            <p>Disclaimer: InsuranceDekho does not endorse, rate or recommend any particular insurance company or insurance plan.</p>
          </div>
        </div>

        <div className="quick-links">
          <h2>News Category</h2>
          <ul>
            <li><a href="/life-insurance/news/term-insurance">Term Insurance</a></li>
            <li><a href="/life-insurance/news/riders">Riders</a></li>
            <li><a href="/life-insurance/news/ulip">ULIP</a></li>
            <li><a href="/life-insurance/news/endowment-plan">Endowment Plan</a></li>
            <li><a href="/life-insurance/news/retirement-plan">Retirement Plan</a></li>
            <li><a href="/life-insurance/news/money-back-plan">Money Back Plan</a></li>
            <li><a href="/life-insurance/news/child-plan">Child Plan</a></li>
          </ul>
        </div>

        <div className="quick-links">
          <h2>Insurance Calculators</h2>
          <ul>
            <li><a href="/life-insurance/human-life-value">Human Life Value Calculator</a></li>
            <li><a href="/health-insurance/premium-calculator">Health Insurance Premium Calculator</a></li>
            <li><a href="/car-insurance/premium-calculator">Car Insurance Calculator</a></li>
            <li><a href="/bike-insurance/premium-calculator">Bike Insurance Calculator</a></li>
            <li><a href="/life-insurance/premium-calculator">Life Insurance Calculator</a></li>
            <li><a href="/life-insurance/term-insurance/premium-calculator">Term Insurance Calculator</a></li>
            <li><a href="/investment/fixed-deposit">FD Calculator</a></li>
          </ul>
        </div>

        <div className="quick-links">
          <h2>Become POSP Insurance Agent</h2>
          <ul>
            <li><a className="blue-link" href="https://pos.insurancedekho.com/">Become Insurance Agent</a></li>
          </ul>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default LifeInsuranceNews;