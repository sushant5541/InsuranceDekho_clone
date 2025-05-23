import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = (menu) => {
    if (!isMobile) {
      setActiveDropdown(menu);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  const handleClick = (menu) => {
    if (isMobile) {
      setActiveDropdown(activeDropdown === menu ? null : menu);
    }
  };

  const insuranceItems = [
    { title: "Car Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_car.svg", path: "/car-insurance" },
    { title: "Bike Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg", path: "/bike-insurance" },
    { title: "Health Insurance", img: "https://static.insurancedekho.com/pwa/img/v2_icon_health.svg", path: "/health-insurance" },
    { title: "Life Insurance", img: "https://static.insurancedekho.com/pwa/img/life_insurance.svg", path: "/life-insurance" },
    { title: "Term Insurance", img: "https://static.insurancedekho.com/pwa/img/v2_icon_life.svg", path: "/term-insurance" },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-light px-4 py-2 shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand">
            <img
              src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg"
              alt="InsuranceDekho"
              height="40"
            />
          </Link>

          <button
            className="navbar-toggler ms-auto"
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <div className="navbar-nav me-auto ">
            {/* Insurance Dropdown */}
            <div
              className="nav-item dropdown"
              onMouseEnter={() => handleMouseEnter('insurance')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('insurance')}
            >
              <span className="nav-link dropdown-toggle" >
                Insurance
              </span>
              <div className={`dropdown-menu ${activeDropdown === 'insurance' ? 'show' : ''}`}>
                {insuranceItems.map((item, index) => (
                  <Link
                    to={item.path}
                    key={index}
                    className="dropdown-item"
                    onClick={() => isMobile && setExpanded(false)}
                  >
                    <img src={item.img} alt={item.title} width="25" className="me-2" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Insurance Advisor */}
            <div className="nav-item">
              <span 
                className="nav-link" 
                onClick={() => {
                  navigate('/advisors');
                  isMobile && setExpanded(false);
                }}
              >
                Insurance Advisor
              </span>
            </div>

            {/* Renew */}
            <Link to="/login" className="nav-link" onClick={() => isMobile && setExpanded(false)}>
              Renew
            </Link>

            {/* Support Dropdown */}
            <div
              className="nav-item dropdown"
              onMouseEnter={() => handleMouseEnter('support')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('support')}
            >
              <span className="nav-link dropdown-toggle">
                Support
              </span>
              <div className={`dropdown-menu ${activeDropdown === 'support' ? 'show' : ''}`}>
                <Link 
                  to="/dashboard" 
                  className="dropdown-item"
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <img src="https://static.insurancedekho.com/pwa/img/v2_icon_policyrenew.svg" alt="" width="20" className="me-2" />
                  Renew Policy
                </Link>
                <Link 
                  to="/dashboard" 
                  className="dropdown-item"
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <img src="https://static.insurancedekho.com/pwa/img/v2_icon_policyTrack.svg" alt="" width="20" className="me-2" />
                  Track Policy
                </Link>
                <Link 
                  to="/dashboard" 
                  className="dropdown-item"
                  onClick={(e) => {
                    if (user) {
                      e.preventDefault();
                      navigate('/dashboard', { state: { autoPrint: true } });
                    }
                    isMobile && setExpanded(false);
                  }}
                >
                  <img src="https://static.insurancedekho.com/pwa/img/v2_icon_policyDownload.svg" alt="" width="20" className="me-2" />
                  Download Policy
                </Link>
                <Link 
                  to="/contact" 
                  className="dropdown-item"
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <img src="https://static.insurancedekho.com/pwa/img/v2_call-green.svg" alt="" width="20" className="me-2" />
                  Contact Us
                </Link>
              </div>
            </div>

            {/* News Dropdown */}
            <div
              className="nav-item dropdown"
              onMouseEnter={() => handleMouseEnter('news')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('news')}
            >
              <span className="nav-link dropdown-toggle">
                News
              </span>
              <div className={`dropdown-menu ${activeDropdown === 'news' ? 'show' : ''}`}>
                {insuranceItems.map((item, index) => (
                  <Link
                    to={`${item.path}/news`}
                    key={index}
                    className="dropdown-item"
                    onClick={() => isMobile && setExpanded(false)}
                  >
                    <img src={item.img} alt={item.title} width="25" className="me-2" />
                    {item.title} News
                  </Link>
                ))}
              </div>
            </div>

            {/* Become POSP Agent */}
            <Link 
              to="/become-agent" 
              className="nav-link"
              onClick={() => isMobile && setExpanded(false)}
            >
              Become POSP Agent
            </Link>
          </div>

          {/* Right Side - User Section */}
          <div className="d-flex ms-auto">
            <Link
              to="/dashboard"
              className="btn btn-link text-primary fw-medium text-decoration-none me-3"
              onClick={(e) => {
                if (user) {
                  e.preventDefault();
                  navigate('/dashboard', { state: { autoPrint: true } });
                }
                isMobile && setExpanded(false);
              }}
            >
              Track & Policy Download
            </Link>
            
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={user.name}
                >
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="dropdown-item"
                      onClick={() => isMobile && setExpanded(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        logout();
                        isMobile && setExpanded(false);
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-warning text-white"
                onClick={() => isMobile && setExpanded(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;