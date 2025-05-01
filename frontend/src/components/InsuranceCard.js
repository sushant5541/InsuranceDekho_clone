import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const insuranceItems = [
  { title: "Car Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_car.svg" },
  { title: "Bike Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg" },
  { title: "Term Insurance", img: "https://static.insurancedekho.com/pwa/img/v2_icon_life.svg" },
  { title: "Investment Plans", img: "https://www.insurancedekho.com/pwa/img/v2_icon_investment.svg" },
  { title: "Family Health", img: "https://static.insurancedekho.com/pwa/img/v2_icon_health.svg" },
  { title: "View More", img: "https://static.insurancedekho.com/pwa/img/v2_icon_viewmore.svg" },
];

const InsuranceCards = () => {
  return (
    <div className="container">
      <div className="p-4 border rounded shadow-sm bg-white">
        {/* First Row: 5 items */}
        <div className="row justify-content-center g-4">
          {insuranceItems.slice(0, 5).map((item, index) => (
            <div className="col-6 col-md-4 col-lg-2" key={index}>
              <div className="card text-center shadow-sm h-100">
                <div className="card-body">
                  <img src={item.img} alt={item.title} height="50" className="mb-2" />
                  <h6 className="card-title">{item.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row: View More item centered */}
        <div className="row justify-content-center g-4 mt-1">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <img src={insuranceItems[5].img} alt={insuranceItems[5].title} height="60" className="mb-2" />
                <h6 className="card-title">{insuranceItems[5].title}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCards;
