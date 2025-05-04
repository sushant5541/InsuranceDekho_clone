import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (menu) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  return (
    <nav className="navbar navbar-expand-lg bg-light px-4 py-2 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div class="logo" style={{ marginTop: 10 }}>
            <img
              src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg"
              alt="InsuranceDekho"
              height="40"
            />

          </div>

          <div
            className="nav-item position-relative"
            onMouseEnter={() => handleMouseEnter('insurance')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Insurance <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'insurance' && (
  <div className="dropdown-menu show">

    {/* === Car Insurance (as-is) === */}
    <div className="dropdown-item position-relative nested-dropdown">
      <span>
        <img alt="" src="https://www.insurancedekho.com/pwa/img/v2_icon_car.svg" width="30" height="30" />
        Car Insurance
        <span className="arrow-right">›</span>
      </span>

      {/* First nested menu under Car Insurance */}
      <div className="nested-menu">
        <div
          className="dropdown-item position-relative nested-subdropdown"
          onMouseEnter={() => setActiveSubmenu('car-companies')}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          <span>Companies <span className="arrow-right1">›</span></span>

          {activeSubmenu === 'car-companies' && (
            <div className="nested-menu">
              <div className="dropdown-item">ICICI ERGO Car Insurance</div>
              <div className="dropdown-item">Digital Car Insurance</div>
              <div className="dropdown-item">Bajaj Allianz Car Insurance</div>
              <div className="dropdown-item">HDFC Ergo Car Insurance</div>
            </div>
          )}
        </div>
        <div className="dropdown-item">Car Insurance Quotes</div>
        <div className="dropdown-item">Car Insurance Renewal</div>
        <div className="dropdown-item">Premium Calculator</div>
      </div>
    </div>

    {/* === Bike Insurance === */}
    <div className="dropdown-item position-relative nested-dropdown">
      <span>
        <img alt="" src="https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg" width="30" height="30" />
        Bike Insurance
        <span className="arrow-right">›</span>
      </span>
      <div className="nested-menu">
        <div
          className="dropdown-item position-relative nested-subdropdown"
          onMouseEnter={() => setActiveSubmenu('bike-companies')}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          <span>Companies <span className="arrow-right1">›</span></span>

          {activeSubmenu === 'bike-companies' && (
            <div className="nested-menu">
              <div className="dropdown-item">Royal Sundaram Bike Insurance</div>
              <div className="dropdown-item">Bajaj Allianz Bike Insurance</div>
              <div className="dropdown-item">HDFC Ergo Bike Insurance</div>
            </div>
          )}
        </div>
        <div className="dropdown-item">Bike Insurance Quotes</div>
        <div className="dropdown-item">Bike Insurance Renewal</div>
        <div className="dropdown-item">Premium Calculator</div>
      </div>
    </div>

    {/* === Health Insurance === */}
    <div className="dropdown-item position-relative nested-dropdown">
      <span>
        <img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_health.svg" width="30" height="30" />
        HealthInsurance
        <span className="arrow-right">›</span>
      </span>
      <div className="nested-menu">
        <div
          className="dropdown-item position-relative nested-subdropdown"
          onMouseEnter={() => setActiveSubmenu('health-companies')}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          <span>Companies <span className="arrow-right1">›</span></span>

          {activeSubmenu === 'health-companies' && (
            <div className="nested-menu">
              <div className="dropdown-item">Niva Bupa Health Insurance</div>
              <div className="dropdown-item">Care Health Insurance</div>
              <div className="dropdown-item">Bajaj allianz Health Insurance</div>
              <div className="dropdown-item">ICICI Lombard</div>
            </div>
          )}
        </div>
        <div className="dropdown-item">Best Health Insurance Plan</div>
        <div className="dropdown-item">Women Health Insurance</div>
        <div className="dropdown-item">Health Insurance for Family</div>
      </div>
    </div>

    {/* === Life Insurance === */}
    <div className="dropdown-item position-relative nested-dropdown">
      <span>
        <img alt="" src="https://static.insurancedekho.com/pwa/img/life_insurance.svg" width="30" height="30" />
        Life Insurance
        <span className="arrow-right">›</span>
      </span>
      <div className="nested-menu">
        <div
          className="dropdown-item position-relative nested-subdropdown"
          onMouseEnter={() => setActiveSubmenu('life-companies')}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          <span>Companies <span className="arrow-right1">›</span></span>

          {activeSubmenu === 'life-companies' && (
            <div className="nested-menu">
              <div className="dropdown-item">LIC Life Insurance</div>
              <div className="dropdown-item">HDFC Life</div>
              <div className="dropdown-item">SBI Life</div>
              <div className="dropdown-item">ICICI Prudential</div>
            </div>
          )}
        </div>
        <div className="dropdown-item">Life Insurance Plans</div>
        <div className="dropdown-item">Postal Life Insurance</div>
        <div className="dropdown-item">Life Insurance Quotes</div>
      </div>
    </div>

    {/* === Term Insurance === */}
    <div className="dropdown-item position-relative nested-dropdown">
      <span>
        <img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_life.svg" width="30" height="30" />
        Term Insurance
        <span className="arrow-right">›</span>
      </span>
      <div className="nested-menu">
        <div
          className="dropdown-item position-relative nested-subdropdown"
          onMouseEnter={() => setActiveSubmenu('term-companies')}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          <span>Companies <span className="arrow-right1">›</span></span>

          {activeSubmenu === 'term-companies' && (
            <div className="nested-menu">
              <div className="dropdown-item">LIC Term Insurance</div>
              <div className="dropdown-item">HDFC Life Term Insurance</div>
              <div className="dropdown-item">ICICI Term Insurance</div>
            </div>
          )}
        </div>
        <div className="dropdown-item">Term Insurnace Plan</div>
        <div className="dropdown-item">Family Term Insurnace</div>
        <div className="dropdown-item">Group Term Life Insurance</div>
      </div>
    </div>
  </div>
)}
</div>


          <div
            className="nav-item position-relative"
            onMouseEnter={() => handleMouseEnter('advisor')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Insurance Advisor <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'advisor' && (
              <div className="dropdown-menu show">
                <div className="dropdown-item">Insurance Advisor in Pune</div>
                <div className="dropdown-item">Insurance Advisor in Mumbai</div>
                <div className="dropdown-item">Insurance Advisor in Bangalore</div>
              </div>
            )}
          </div>

          <span className="nav-link">Renew</span>

          <div
            className="nav-item position-relative"
            onMouseEnter={() => handleMouseEnter('support')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Support <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'support' && (
              <div className="dropdown-menu show">

                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_policyrenew.svg" width="20" height="20"></img>Renew Policy</div>
                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_policyTrack.svg" width="20" height="20"></img>Track Policy</div>
                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_policyDownload.svg" width="20" height="20"></img>Download Policy</div>
                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/v2_call-green.svg" width="20" height="20"></img>Contact Us</div>
              </div>
            )}
          </div>

          <div
            className="nav-item position-relative"
            onMouseEnter={() => handleMouseEnter('support')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">News <span style={{ fontSize: '0.75rem' }}>▼</span></span>
            {activeDropdown === 'support' && (
              <div className="dropdown-menu show">
                <div className="dropdown-item"> <img alt="" src="https://www.insurancedekho.com/pwa/img/v2_icon_car.svg" width="30" height="30"></img> Car Insurance</div>
                <div className="dropdown-item"><img alt="" src="https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg" width="30" height="30"></img> Bike Insurance</div>
                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_health.svg" width="30" height="30"></img> Health Insurance</div>
                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/life_insurance.svg" width="30" height="30"></img> Life Insurance</div>
                <div className="dropdown-item"><img alt="" src="https://static.insurancedekho.com/pwa/img/v2_icon_life.svg" width="30" height="30"></img> Term Insurance</div>
              </div>
            )}
          </div>
          <span className="nav-link">Become POSP Agent</span>
        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-3">
          <span className="text-primary fw-medium">Track & Policy Download</span>
          {user ? (
            <div className="dropdown">
              <button 
                className="btn btn-outline-primary dropdown-toggle" 
                type="button" 
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img 
                  src="/pwa/img/myaccount/img_profile.svg" 
                  alt="Profile" 
                  width="24" 
                  height="24" 
                  className="me-2"
                />
                {user.name.split(' ')[0]} {/* Show first name */}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
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

