import React from 'react';
import '../styles/HealthnsuranceNews.css'

const HealthInsuranceNews = () => {
  const newsArticles = [
    {
      id: 1,
      title: "How Corporate Health Insurance Benefits Employees and Employers",
      excerpt: "Explore how corporate health insurance benefits both employees and employers. Learn about tax savings, employee retention, enhanced wellbeing, and why group health plans are a smart workplace investment...",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_How_Corporate_Health_Insurance_Benefits_Employees_and_Employers_a52a9f6560.png",
      author: "Khushi Agarwal",
      date: "22 Apr 2025"
    },
    {
      id: 2,
      title: "Health vs. Wellness: What's the Real Difference?",
      excerpt: "Understand the real difference between health and wellness. Explore how both concepts impact your physical, mental, and emotional wellbeing—and why balancing them is essential for a healthier life.",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_Health_vs_Wellness_Understanding_the_Key_Differences_and_Their_Importance_f229cd1386.png",
      author: "Ujjwal Swarup",
      date: "22 Apr 2025"
    },
    {
      id: 3,
      title: "How Super Top-Up Health Insurance Works: Key Features and Benefits",
      excerpt: "Discover how Super Top-Up health insurance works, including its features, benefits, and how it can enhance your coverage. Learn why it's a cost-effective option for additional health protection in India...",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_How_Super_Top_Up_Health_Insurance_Works_c6dead837c.png",
      author: "Rohit Khurana",
      date: "21 Apr 2025"
    },
    {
      id: 4,
      title: "Preventive Health Checkups Under Section 80D: What You Can Claim",
      excerpt: "Maximize your tax savings with preventive health checkups under Section 80D. Learn how much you can claim, who is eligible, and how to file deductions for health checkup expenses in India.",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_What_Are_the_Eligible_Expenses_for_Preventive_Health_Checkups_Under_Section_80_D_7092a2833e.png",
      author: "Khushi Agarwal",
      date: "21 Apr 2025"
    },
    {
      id: 5,
      title: "How to Apply for Government Health Insurance in India?",
      excerpt: "Discover how to apply for government health insurance in India. Get complete details on eligibility, required documents, and the online application process for schemes like Ayushman Bharat, PMJAY & more...",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_How_to_Apply_for_Government_Health_Insurance_in_India_141636b22a.png",
      author: "Abhishek Muraraka",
      date: "21 Apr 2025"
    },
    {
      id: 6,
      title: "Top Benefits of the PM Modi Health Insurance Scheme for Low-Income Families",
      excerpt: "Explore the key benefits of the PM Modi Health Insurance Scheme designed to support low-income families. Learn how this government initiative provides financial protection and access to quality healthcare...",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_Top_Benefits_of_the_PM_Modi_Health_Insurance_b3aa7f0cff.png",
      author: "Abhishek Muraraka",
      date: "16 Apr 2025"
    },
    {
      id: 7,
      title: "What is IRDAI Health Insurance? Its Role of IRDAI in Regulating Health Policies",
      excerpt: "Learn what IRDAI health insurance means and understand the vital role of the Insurance Regulatory and Development Authority of India (IRDAI) in regulating and safeguarding health insurance policies in India...",
      imageUrl: "https://staticimg.insurancedekho.com/strapi/Big_What_is_IRDAI_Health_Insurance_Role_of_IRDAI_in_Regulating_Health_Policies_e107e041b4.png",
      author: "Anurag Kumar",
      date: "16 Apr 2025"
    }
  ];

  return (
    <div className="health-insurance-news">
      <div className="breadcrumb">
        <span><a href="/">Home</a></span>
        <span><a href="/health-insurance">Health Insurance</a></span>
        <span>News</span>
      </div>

      <h1 className="news-heading">Health Insurance News</h1>

      <div className="news-list">
        {newsArticles.slice(0, 7).map(article => (
          <div key={article.id} className="news-card">
            <div className="news-image-container">
              <a href={`/health-insurance/news/${article.id}`}>
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="news-image"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="news-content">
              <h2>
                <a href={`/health-insurance/news/${article.id}`}>{article.title}</a>
              </h2>
              <p className="news-excerpt">{article.excerpt}</p>
              <div className="author-info">
                <div className="author-initial">{article.author.charAt(0)}</div>
                <div className="author-details">
                  <div className="author-name">
                    <a href={`/authors/${article.author.toLowerCase().replace(' ', '-')}`}>
                      {article.author}
                    </a>
                  </div>
                  <div className="article-date">{article.date}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthInsuranceNews;