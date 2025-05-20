import React from 'react';
import '../styles/CarInsuranceNews.css';

const CarInsuranceNews = () => {
  const articles = [
    {
      id: 1,
      title: "What Is a Clutch in a Car, and How Does It Function?",
      description: "Learn what a car clutch is, how it engages and disengages power between the engine and wheels, and why it's vital for smooth gear shifts and control.",
      image: "https://staticimg.insurancedekho.com/strapi/Small_What_Is_a_Clutch_in_a_Car_and_How_Does_It_Function_d1cf005d0e.webp",
      date: "09 May 2025",
      author: "Khushi Agarwal"
    },
    {
      id: 2,
      title: "How to Clean a Car Windshield: Best Practices for a Smudge-Free Finish?",
      description: "Learn the best way to clean your car windshield inside and out with simple tools and techniques to achieve a streak-free, crystal-clear view.",
      image: "https://staticimg.insurancedekho.com/strapi/Small_How_to_Clean_a_Car_Windshield_Best_Practices_for_a_Smudge_Free_Finish_e8a639a098.webp",
      date: "09 May 2025",
      author: "Navneet Bhatt"
    },
    {
      id: 3,
      title: "What is Turbo Lag and How to Minimize It?",
      description: "Understand what turbo lag is, why it happens in turbocharged engines, and discover smart tips to minimize delay and improve throttle response.",
      image: "https://staticimg.insurancedekho.com/strapi/Small_Turbo_Lag_What_It_Is_and_How_to_Minimize_It_7e64373451.webp",
      date: "09 May 2025",
      author: "Navneet Bhatt"
    },
    {
      id: 4,
      title: "What Is a Windshield in a Car? Role, Materials & Features",
      description: "From safety to aerodynamics, windshields play a crucial role in cars. Learn about different types of windshields, common issues, and maintenance.",
      image: "https://staticimg.insurancedekho.com/strapi/Small_What_Is_a_Windshield_in_a_Car_ca3f371c4f.webp",
      date: "08 May 2025",
      author: "Navneet Bhatt"
    },
    {
      id: 5,
      title: "How to Defog a Car Windshield: Easy Tips for Clear Vision",
      description: "Learn easy and effective ways to defog your car windshield during any season for better visibility and safer driving in all weather conditions.",
      image: "https://staticimg.insurancedekho.com/strapi/Small_How_to_Defog_a_Car_Windshield_4934c3d9e9.webp",
      date: "08 May 2025",
      author: "Siddharth Malik"
    },
    {
      id: 6,
      title: "Car Headlights: Types, Features, and Maintenance Tips",
      description: "Explore different types of car headlights, their features, and essential maintenance tips to ensure clear night driving and road safety.",
      image: "https://staticimg.insurancedekho.com/strapi/Smell_Car_Headlights_e87a440eaa.webp",
      date: "08 May 2025",
      author: "Siddharth Malik"
    }
  ];
  

  return (
    
    <div className="car-insurance-news">
        <div className="breadcrumb">
        <span><a href="/">Home</a></span>
        <span><a href="/car-insurance">Car Insurance</a></span>
        <span>News</span>
      </div>

      <h1>Car Insurance News</h1>
      <div className="articles-container">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="article-content">
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <div className="article-meta">
                <span className="author">{article.author}</span>
                <span className="date">{article.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarInsuranceNews;