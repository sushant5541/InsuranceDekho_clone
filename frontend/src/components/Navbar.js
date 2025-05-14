import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleMouseEnter = (menu) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);

  // Insurance items matching your InsuranceCards component
  const insuranceItems = [
    { title: "Car Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_car.svg", path: "/car-insurance" },
    { title: "Bike Insurance", img: "https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg", path: "/bike-insurance" },
    { title: "Health Insurance", img: "https://static.insurancedekho.com/pwa/img/v2_icon_health.svg", path: "/health-insurance" },
    { title: "Life Insurance", img: "https://static.insurancedekho.com/pwa/img/life_insurance.svg", path: "/life-insurance" },
    { title: "Term Insurance", img: "https://static.insurancedekho.com/pwa/img/v2_icon_life.svg", path: "/term-insurance" },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-light px-4 py-2 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="logo" style={{ marginTop: 10 }}>
            <Link to="/">
              <img
                src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg"
                alt="InsuranceDekho"
                height="40"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </div>

          {/* Insurance Dropdown */}
          <div
            className="nav-item position-relative ms-auto"
            onMouseEnter={() => handleMouseEnter('insurance')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Insurance <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'insurance' && (
              <div className="dropdown-menu show">
                {insuranceItems.map((item, index) => (
                  <Link
                    to={item.path}
                    key={index}
                    className="dropdown-item position-relative nested-dropdown text-decoration-none"
                  >
                    <span>
                      <img alt={item.title} src={item.img} width="30" height="30" />
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Insurance Advisor Link */}
          <div
            className="nav-item position-relative ms-auto"
            onClick={() => navigate('/advisors')}
            style={{ cursor: 'pointer' }}
          >
            <span className="nav-link">Insurance Advisor</span>
          </div>

          {/* Renew Link */}
          <Link to="/login" className="nav-link">Renew</Link>

          {/* Support Dropdown */}
          <div
            className="nav-item position-relative"
            onMouseEnter={() => handleMouseEnter('support')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Support <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'support' && (
              <div className="dropdown-menu show">
                <Link to="/dashboard" className="dropdown-item text-decoration-none">
                  <img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_policyrenew.svg" width="20" height="20" /> Renew Policy
                </Link>
                <Link to="/dashboard"  className="dropdown-item text-decoration-none">
                  <img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_policyTrack.svg" width="20" height="20" /> Track Policy
                </Link>
                <Link to="/dashboard" onClick={(e) => {
              if (user) {
                e.preventDefault();
                navigate('/dashboard', { state: { autoPrint: true } });
              }
            }}className="dropdown-item text-decoration-none">
                  <img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_policyDownload.svg" width="20" height="20" /> Download Policy
                </Link>
                <Link to="/contact" className="dropdown-item text-decoration-none">
                  <img alt="" src="https://static.insurancedekho.com/pwa/img/v2_call-green.svg" width="20" height="20" /> Contact Us
                </Link>
              </div>
            )}
          </div>

          {/* News Dropdown */}
          <div
            className="nav-item position-relative"
            onMouseEnter={() => handleMouseEnter('news')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">News <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'news' && (
              <div className="dropdown-menu show">
                {insuranceItems.map((item, index) => (
                  <Link
                    to={`${item.path}/news`}  // Updated path to include /news
                    key={index}
                    className="dropdown-item text-decoration-none"
                  >
                    <img alt={item.title} src={item.img} width="30" height="30" /> {item.title} News
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Become POSP Agent Link */}
          <Link to="/become-agent" className="nav-link">Become POSP Agent</Link>
        </div>

        {/* Right Side - User Section */}
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/dashboard"
            className="text-primary fw-medium text-decoration-none"
            onClick={(e) => {
              if (user) {
                e.preventDefault();
                navigate('/dashboard', { state: { autoPrint: true } });
              }
            }}
          >
            Track & Policy Download
          </Link>
          {user ? (
            <div className="dropdown position-relative">
              <button
                className="btn btn-outline-primary dropdown-toggle text-truncate"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: '150px', overflow: 'hidden', whiteSpace: 'nowrap' }}
                title={user.name}
              >
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                {/* Dashboard link based on user role */}
                {user.role === 'admin' ? (
                  <li><Link to="/dashboard" className="dropdown-item"> Dashboard</Link></li>
                ) : (
                  <li><Link to="/dashboard" className="dropdown-item"> Dashboard</Link></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-warning text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;