import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/UserDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-content">
      <div className="my-account-body my-account-v2">
        <div className="my-account-wrap">
          <div className="my-account-board">
            <div className="my-overview" id="overview">
              <div className="card-v2 radius-6 bottom-20 my-account-card profile-card">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="profile-info">
                    <img 
                      src="/pwa/img/myaccount/img_profile.svg" 
                      alt="Profile" 
                      className="profile-img"
                    />
                    <div>
                      <h4>{user?.name || 'User'}</h4>
                      <span>Age 22 | Male</span>
                    </div>
                  </div>
                  {location.state?.success && (
        <div className="alert alert-success">
          {location.state.success}
        </div>
      )}

      {/* Update the edit button */}
      <button 
        className="edit-btn"
        onClick={() => navigate('/edit-profile')}
      >
        <img 
          src="https://static.insurancedekho.com/pwa/img/myaccount/editicon.svg" 
          alt="Edit" 
          width="16" 
          height="16" 
        />
        Edit
      </button>
                </div>
              </div>
            </div>

            <div className="no-policy-found">
              <img 
                src="/pwa/img/myaccount/img_empty_policy.svg" 
                alt="No policies" 
                className="empty-policy-img"
              />
              <h3>No Policies Found!</h3>
              <p>How about you start by buying a new policy?</p>
              <button className="btn btn-primary try-us-btn "
              onClick={() => navigate('/')}
              >
                Try Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;