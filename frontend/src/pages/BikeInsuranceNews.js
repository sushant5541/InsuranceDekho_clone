import React from 'react';
import '../styles/BikeInsuranceNews.css'; // You'll need to create this CSS file

const BikeInsuranceNews = () => {
  const newsItems = [
    {
      id: 1,
      title: "IRDAI Introduces New Guidelines for Two-Wheeler Insurance Claims",
      excerpt: "The Insurance Regulatory and Development Authority has issued new guidelines to streamline bike insurance claims process.",
      date: "May 10, 2023",
      image: "https://static.insurancedekho.com/pwa/img/news/irda-guidelines.jpg"
    },
    {
      id: 2,
      title: "Electric Bike Insurance Premiums to See Reduction from Next Month",
      excerpt: "Government announces subsidy on insurance premiums for electric two-wheelers to promote eco-friendly transportation.",
      date: "May 5, 2023",
      image: "https://static.insurancedekho.com/pwa/img/news/electric-bike.jpg"
    },
    {
      id: 3,
      title: "Monsoon Ready: Essential Bike Insurance Add-ons for Rainy Season",
      excerpt: "Protect your two-wheeler during monsoon with these must-have insurance riders and coverage options.",
      date: "April 28, 2023",
      image: "https://static.insurancedekho.com/pwa/img/news/monsoon-bike.jpg"
    },
    {
      id: 4,
      title: "Cashless Garage Network Expanded to 5000+ Centers Across India",
      excerpt: "Major insurers have expanded their cashless repair network for two-wheelers to provide better service.",
      date: "April 20, 2023",
      image: "https://static.insurancedekho.com/pwa/img/news/cashless-garage.jpg"
    },
    {
      id: 5,
      title: "New Instant Claim Settlement Feature Launched for Minor Bike Damages",
      excerpt: "Policyholders can now get instant settlement for minor damages without surveyor inspection.",
      date: "April 15, 2023",
      image: "https://static.insurancedekho.com/pwa/img/news/instant-claim.jpg"
    },
    {
      id: 6,
      title: "Bike Theft Claims See 20% Increase in Metro Cities: Survey",
      excerpt: "Insurance companies report rise in two-wheeler theft claims, especially in Delhi, Mumbai, and Bangalore.",
      date: "April 10, 2023",
      image: "https://static.insurancedekho.com/pwa/img/news/bike-theft.jpg"
    }
  ];

  return (
    <div className="bike-insurance-news-container">
      <div className="breadcrumb">
        <span><a href="/">Home</a></span>
        <span><a href="/bike-insurance">Bike Insurance</a></span>
        <span>News</span>
      </div>
      
      <div className="news-header">
        <h1>Bike Insurance News</h1>
      </div>
      
      <div className="news-content-wrapper">
        <div className="news-main-content">
          <div className="news-list">
            {newsItems.map(news => (
              <div key={news.id} className="news-item">
                <div className="news-image">
                  <img src={news.image} alt={news.title} />
                </div>
                <div className="news-details">
                  <h3>{news.title}</h3>
                  <p className="news-excerpt">{news.excerpt}</p>
                  <p className="news-date">{news.date}</p>
                  <a href={`/bike-insurance/news/${news.id}`} className="read-more">Read More</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="news-sidebar">
        
          
          <div className="partner-insurers">
            <h2>Partner Bike Insurance Companies</h2>
            <div className="insurer-grid">
              {[
                { name: "New India", logo: "new-india.png" },
                { name: "HDFC ERGO", logo: "hdfc.png" },
                { name: "ICICI Lombard", logo: "icici.png" },
                { name: "Bajaj Allianz", logo: "bajaj.png" },
                { name: "TATA AIG", logo: "tata.png" },
                { name: "Digit", logo: "digit.png" }
              ].map((insurer, index) => (
                <div key={index} className="insurer-item">
                  <img 
                    src={`https://staticimg.insurancedekho.com/seo/insurer/${insurer.logo}`} 
                    alt={`${insurer.name} Bike Insurance`} 
                  />
                  <span>{insurer.name}</span>
                </div>
              ))}
            </div>
            <div className="view-all">
              <a href="/bike-insurance/companies">View All Companies</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeInsuranceNews;