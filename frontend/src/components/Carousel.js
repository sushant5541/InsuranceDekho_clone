import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Add this line
import { useNavigate } from 'react-router-dom';

const CarouselComponent = () => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/life-insurance');
  };

  return (
    <div className="container mt-2 d-flex justify-content-center" style={{maxWidth:"100%"}}>
      <div
        id="homeCarousel"
        className="carousel slide carousel-fade mb-4" // Added carousel-fade for smoother transition
        data-bs-ride="carousel"
        data-bs-interval="3000"
        style={{ width: '90%', maxWidth: '1000px', height: '200px' }}
      >
        <div className="carousel-inner" style={{ height: '100%', cursor:'pointer' }}>
          <div className="carousel-item active" onClick={handleImageClick}>
            <img
              src="https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png"
              className="d-block w-100"
              alt="Slide 1"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="carousel-item" onClick={handleImageClick}>
            <img
              src="https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png"
              className="d-block w-100"
              alt="Slide 2"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
        </div>
      </div>
  );
};

export default CarouselComponent;