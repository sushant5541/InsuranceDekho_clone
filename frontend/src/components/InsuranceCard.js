import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const insuranceItems = [
  { title: "Car Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_car.svg", path: "/car-insurance" },
  { title: "Bike Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg", path: "/bike-insurance" },
  { title: "Health Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_health.svg", path: "/Health-insurance" },
  { title: "Term Insurance", img: "https://static.insurancedekho.com/pwa/img/v2_icon_life.svg", path: "/term-insurance" },
  { title: "Investment Plans", img: "https://www.insurancedekho.com/pwa/img/v2_icon_investment.svg", path: "/investment-plans" },
  { title: "Family Health", img: "https://static.insurancedekho.com/pwa/img/v2_icon_health.svg", path: "/family-health" },
];

const InsuranceCards = () => {
  return (
    <div className="container" style={{maxWidth:"100%"}}>
      <div className="p-4 border rounded shadow-sm bg-white">
        <div className="row justify-content-center g-4">
          {insuranceItems.slice(0, 5).map((item, index) => (
            <div className="col-6 col-md-4 col-lg-2" key={index}>
              <Link to={item.path} className="text-decoration-none text-dark">
                <div className="card text-center shadow-sm h-100">
                  <div className="card-body" style={{ cursor: 'pointer' }}>
                    <img src={item.img} alt={item.title} height="50" className="mb-2" />
                    <h6 className="card-title">{item.title}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="row justify-content-center g-4 mt-1">
          <div className="col-6 col-md-4 col-lg-2">
            <Link to={insuranceItems[5].path} className="text-decoration-none text-dark">
              <div className="card text-center shadow-sm h-100">
                <div className="card-body" style={{ cursor: 'pointer' }}>
                  <img src={insuranceItems[5].img} alt={insuranceItems[5].title} height="60" className="mb-2" />
                  <h6 className="card-title">{insuranceItems[5].title}</h6>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCards;
