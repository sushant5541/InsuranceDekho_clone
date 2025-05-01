import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CarouselComponent = () => {
  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div
        id="homeCarousel"
        className="carousel slide mb-4"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        style={{ width: '90%', maxWidth: '1000px', height: '200px' }}
      >
        <div className="carousel-inner" style={{ height: '100%' }}>
          <div className="carousel-item active">
            <img
              src="https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png"
              className="d-block w-100"
              alt="Slide 1"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="carousel-item">
            
            <img
              src=""
              className="d-block w-100"
              alt="Slide 2"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="carousel-indicators">
  <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
  <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
</div>

      </div>
    </div>
  );
};

export default CarouselComponent;
