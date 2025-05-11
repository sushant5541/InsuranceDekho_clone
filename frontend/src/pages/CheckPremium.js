import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PremiumDetails = () => {
    const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const plan = location.state?.plan;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [gender, setGender] = useState('Male');
  const [formData, setFormData] = useState({
    name: user?.name || '',
        mobile: user?.mobile || '',
        gender: 'Male',
        address: '',
        city: '',
        pincode: '',
        whatsAppOptIn: true
  });

  // Auto-fill form when user is logged in
  useEffect(() => {
    try {
      console.log('Current User Data:', currentUser); // Debugging log
      
      if (currentUser) {
        // Check if currentUser has the expected properties
        const userData = {
          name: currentUser.displayName || currentUser.name || '',
          mobile: currentUser.phoneNumber || currentUser.mobile || '',
          whatsAppOptIn: currentUser.whatsAppOptIn !== false
        };

        console.log('Setting form data:', userData); // Debugging log
        setFormData(userData);

        if (currentUser.gender) {
          setGender(currentUser.gender);
        }
      }
    } catch (err) {
      console.error('Error setting user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, mobile } = formData;

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!mobile.trim() || mobile.length !== 10 || isNaN(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    navigate('/health-quote', { state: { plan, formData: { ...formData, gender } } });
  };

  if (loading) {
    return <div style={styles.loading}>Loading user data...</div>;
  }

  if (!plan) {
    return (
      <div style={styles.errorContainer}>
        <p>
          No plan data available. Go back to{' '}
          <span 
            onClick={() => navigate('/health-insurance')} 
            style={styles.linkText}
          >
            plans
          </span>.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.banner}>
        <img
          src="https://static.insurancedekho.com/pwa/img/v3_campaign_mobile_Health_insurance_new.webp"
          alt="Insurance Banner"
          style={styles.bannerImage}
        />
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>Save upto ₹75000* of Tax Benefits u/s 80D</h2>

        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}

        {currentUser && (
          <div style={styles.userInfo}>
            <p style={styles.userInfoText}>Logged in as: {currentUser.email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.genderSelector}>
            <button
              type="button"
              style={gender === 'Male' ? { ...styles.genderBtn, ...styles.activeGender } : styles.genderBtn}
              onClick={() => setGender('Male')}
            >
              Male
            </button>
            <button
              type="button"
              style={gender === 'Female' ? { ...styles.genderBtn, ...styles.activeGender } : styles.genderBtn}
              onClick={() => setGender('Female')}
            >
              Female
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
              style={{
                ...styles.input,
                ...(currentUser?.phoneNumber && styles.disabledInput)
              }}
              required
              disabled={!!currentUser?.phoneNumber}
            />
            {currentUser?.phoneNumber && (
              <small style={styles.editHint}>
                Contact support to update your mobile number
              </small>
            )}
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="whatsAppOptIn"
                checked={formData.whatsAppOptIn}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Get Details on
              <img
                src="https://static.insurancedekho.com/pwa/img/newImages/whatsapp-gray.svg"
                alt="WhatsApp"
                style={styles.whatsappIcon}
              />
              WhatsApp
            </label>
          </div>

          <button type="submit" style={styles.submitBtn}>
            View Plans
            <img
              src="https://static.insurancedekho.com/pwa/img/arrow-animation.gif"
              alt="Arrow"
              style={styles.arrowIcon}
            />
          </button>

          <p style={styles.terms}>
            By clicking, I agree to <a href="/disclaimer" style={styles.link}>*terms & conditions</a> and
            <a href="/privacy-policy" style={styles.link}> privacy policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

// Updated styles
const styles = {
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  banner: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  content: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  genderSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  genderBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center',
  },
  activeGender: {
    backgroundColor: '#2a7fba',
    color: 'white',
    borderColor: '#2a7fba',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  checkboxGroup: {
    margin: '10px 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkbox: {
    margin: '0',
  },
  whatsappIcon: {
    width: '20px',
    height: '20px',
  },
  submitBtn: {
    backgroundColor: '#2a7fba',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  arrowIcon: {
    width: '22px',
    height: '22px',
  },
  terms: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    marginTop: '10px',
  },
  link: {
    color: '#2a7fba',
    textDecoration: 'none',
    marginLeft: '4px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
  },
  errorContainer: {
    padding: '20px',
    textAlign: 'center',
    marginTop: '50px',
  },
  linkText: {
    color: '#2a7fba',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  userInfo: {
    backgroundColor: '#f0f8ff',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  userInfoText: {
    margin: 0,
    color: '#2a7fba',
    fontSize: '14px',
  },
  editHint: {
    color: '#666',
    fontSize: '12px',
    marginTop: '5px',
  }
};

export default PremiumDetails;