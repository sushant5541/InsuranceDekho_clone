import React from 'react';
import '../styles/TermNewsList.css';
import Footer from '../components/Footer/Footer';

const TermInsuranceNews = () => {
  return (
    <>
    <div className="news-container">
      <div className="news-left-column">
        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="Ladli Behna Yojana" 
              src="https://staticimg.insurancedekho.com/strapi/Renewable_vs_Convertible_300x200_a426301b59.jpg"
            />
          </div>
          <div className="news-content">
            <h2>Renewable vs Convertible Life Insurance Term Plans</h2>
            <p className="news-description">
             Know the difference between Renewable and Convertible Term Life Insurance Plans. Understand how each type works, their benefits, and which might be best for you
            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Manwendra Singh</div>
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
              src="https://staticimg.insurancedekho.com/strapi/SBI_Life_Term_Insurance_Vs_LIC_Term_Insurance_01e20f9768.jpg"
            />
          </div>
          <div className="news-content">
            <h2>SBI Life Term Insurance Vs LIC Term Insurance</h2>
            <p className="news-description">
Get a quick comparison of SBI Life Term Insurance Vs LIC Term Insurance to find out which policy is best.            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Kritika Singh</div>
                <div className="publish-date">14 May 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="Term Insurance Plan" 
              src="https://staticimg.insurancedekho.com/strapi/Importance_of_Considering_Inflation_While_Choosing_Term_Insurance_Plan_560f5a892f.jpg"
            />
          </div>
          <div className="news-content">
            <h2>Impact of Inflation on Term Insurance Coverage Amount</h2>
            <p className="news-description">
Find how inflation can impact term insurance coverage amount and how you can beat the inflation.            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">Kritika Singh</div>
                <div className="publish-date">14 May 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="news-card">
          <div className="news-image">
            <img 
              loading="lazy" 
              alt="Bhagya Lakshmi Yojana" 
              src="https://healthstatic.insurancedekho.com/prod/news/Increasing_Term_Insurance_Plan.webp"
            />
          </div>
          <div className="news-content">
            <h2>All You Need to Know About Increasing Term Insurance Plan</h2>
            <p className="news-description">
Increasing term insurance plans is ideal for those who want to enjoy enhanced coverage. Continue reading to find out more about this type of term life insurance in detail.            </p>
            <div className="author-info">
              <div className="author-thumb">A</div>
              <div className="author-details">
                <div className="author-name">InsuranceDekho
</div>
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
              <h2>Why to Buy Term Insurance Policy Online from InsuranceDekho</h2>
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
          <h2>Best Term Insurance Advisors in Your City.</h2>
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
          <h2>Partner Term Insurance Companies</h2>
          <div className="partners-grid">
            <div className="partner-item">
              <img 
                src="https://healthstatic.insurancedekho.com/prod/oem/20210609170207.jpg" 
                alt="ICICI Prudential Term Insurance" 
              />
              <span>ICICI Prudential Term Insurance</span>
            </div>
            <div className="partner-item">
              <img 
                src="https://healthstatic.insurancedekho.com/prod/oem/20240627124051.webp" 
                alt="SBI Term Insurance" 
              />
              <span>SBI Term Insurance</span>
            </div>
            {/* Add more partner items here */}
          </div>
          <div className="view-all-link">
            <a href="/term-insurance/companies">View All Term Insurance Companies</a>
          </div>
          <div className="disclaimer">
            <p>Disclaimer: InsuranceDekho does not endorse, rate or recommend any particular insurance company or term insurance plan.</p>
          </div>
        </div>

        <div className="quick-links">
          <h2>News Category</h2>
          <ul>
            <li><a href="/term-insurance/news">Term Insurance</a></li>
            <li><a href="/term-insurance/news/riders">Riders</a></li>
            <li><a href="/term-insurance/news/features">Features</a></li>
            <li><a href="/term-insurance/news/benefits">Benefits</a></li>
            <li><a href="/term-insurance/news/claim-process">Claim Process</a></li>
          </ul>
        </div>

        <div className="quick-links">
          <h2>Insurance Calculators</h2>
          <ul>
            <li><a href="/term-insurance/premium-calculator">Term Insurance Calculator</a></li>
            <li><a href="/health-insurance/premium-calculator">Health Insurance Premium Calculator</a></li>
            <li><a href="/car-insurance/premium-calculator">Car Insurance Calculator</a></li>
            <li><a href="/bike-insurance/premium-calculator">Bike Insurance Calculator</a></li>
            <li><a href="/term-insurance/human-life-value">Human Life Value Calculator</a></li>
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

export default TermInsuranceNews;